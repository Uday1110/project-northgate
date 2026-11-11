"""
Test Suite: Orchestrator Pipeline & Worker Retry Logic.
Tests 4 workers in sequence, timeout handling, and retry logic.
"""

import pytest
import time
from app.mcp.server import MCPServer
from app.ocr.leptos_ocr import LeptosOCREngine
from app.ai_gateway.gateway import AIGateway
from app.audit.audit_log import AuditLog
from app.orchestrator.clock import SLAClock
from app.orchestrator.approval_gate import ApprovalGate
from app.orchestrator.kill_switch import FallbackKillSwitch
from app.orchestrator.pipeline import OrchestratorPipeline, WorkerExecutionError

@pytest.fixture
def pipeline_instance():
    mcp_server = MCPServer()
    ocr_engine = LeptosOCREngine()
    ai_gateway = AIGateway()
    audit_log = AuditLog()
    sla_clock = SLAClock()
    approval_gate = ApprovalGate()
    kill_switch = FallbackKillSwitch()

    return OrchestratorPipeline(
        mcp_server=mcp_server,
        ocr_engine=ocr_engine,
        ai_gateway=ai_gateway,
        audit_log=audit_log,
        sla_clock=sla_clock,
        approval_gate=approval_gate,
        kill_switch=kill_switch
    )

def test_full_pipeline_completes_under_90_seconds(pipeline_instance):
    case_id = "CASE-2024-8841"
    res = pipeline_instance.run_full_pipeline(case_id=case_id)

    assert res["case_id"] == case_id
    assert res["total_elapsed_seconds"] < 90.0, "Full pipeline must complete in under 90s"
    assert res["target_sla_met"] is True
    assert res["pipeline_status"] == "BLOCKED_PENDING_REMEDIATION"

    # Verify workers ran in sequence and populated results
    assert "fields" in res["parsed_documents"]
    assert res["registry_lookup"]["source"] == "UK_COMPANIES_HOUSE"
    assert len(res["ubo_results"]) >= 2
    assert len(res["deficiencies"]) >= 1

def test_worker_retry_recovers_on_transient_failure(pipeline_instance):
    case_id = "CASE-RETRY-01"
    attempt_counter = [0]

    def flaky_task():
        attempt_counter[0] += 1
        if attempt_counter[0] == 1:
            raise ConnectionResetError("Transient network glitch on attempt 1")
        return {"status": "SUCCESS_AFTER_RETRY"}

    # Should succeed on attempt 2 (retry 1 of 2)
    result = pipeline_instance.execute_worker_with_retry(
        worker_name="FlakyWorker",
        case_id=case_id,
        task_fn=flaky_task,
        max_retries=2,
        timeout_seconds=5.0
    )

    assert result["status"] == "SUCCESS_AFTER_RETRY"
    assert attempt_counter[0] == 2

    # Verify retry warning was recorded in audit log
    events = pipeline_instance.audit_log.get_entries_for_case(case_id)
    retry_events = [e for e in events if "Retry" in e.source_reference]
    assert len(retry_events) == 1
    assert "Retry 1 of 2 scheduled" in retry_events[0].description

def test_worker_fails_after_exceeding_max_retries(pipeline_instance):
    case_id = "CASE-FAIL-01"

    def always_failing_task():
        raise TimeoutError("Persistent timeout")

    with pytest.raises(WorkerExecutionError) as exc_info:
        pipeline_instance.execute_worker_with_retry(
            worker_name="AlwaysFailingWorker",
            case_id=case_id,
            task_fn=always_failing_task,
            max_retries=2,
            timeout_seconds=1.0
        )

    assert "AlwaysFailingWorker failed after 3 attempts" in str(exc_info.value)
