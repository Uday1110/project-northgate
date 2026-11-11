"""
Test Suite: Ownership Calculation & UBO Thresholds (>= 25.0%).
Verifies Harbor Crest Holdings Ltd 3-layer ownership structure:
- Arthur Pendelton: 32.00% (Qualified UBO)
- Helena Vance-Cross: 28.00% (Qualified UBO)
- Julian Sterling: 22.00% (Non-UBO)
- Vanguard Pacific Nominees: 18.00% (Non-UBO)
"""

import pytest
from app.mcp.server import MCPServer
from app.ocr.leptos_ocr import LeptosOCREngine
from app.ai_gateway.gateway import AIGateway
from app.audit.audit_log import AuditLog
from app.orchestrator.clock import SLAClock
from app.orchestrator.approval_gate import ApprovalGate
from app.orchestrator.kill_switch import FallbackKillSwitch
from app.orchestrator.pipeline import OrchestratorPipeline

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

def test_cumulative_effective_ownership_and_ubo_flags(pipeline_instance):
    case_id = "CASE-2024-8841"
    ubo_results = pipeline_instance.run_ownership_reconciliation(case_id, ubo_threshold=25.0)

    # Find the natural person owners
    arthur = next((u for u in ubo_results if "Arthur" in u.name), None)
    helena = next((u for u in ubo_results if "Helena" in u.name), None)
    julian = next((u for u in ubo_results if "Julian" in u.name), None)

    assert arthur is not None, "Arthur Pendelton should be present in results"
    assert helena is not None, "Helena Vance-Cross should be present in results"
    assert julian is not None, "Julian Sterling should be present in results"

    # Verify Arthur: 60.0% * 53.33% = 32.00% -> Qualified UBO
    assert arthur.effective_percentage == 32.00
    assert arthur.is_ubo is True
    assert arthur.threshold_status == "QUALIFIED_UBO"

    # Verify Helena: 60.0% * 46.67% = 28.00% -> Qualified UBO
    assert helena.effective_percentage == 28.00
    assert helena.is_ubo is True
    assert helena.threshold_status == "QUALIFIED_UBO"

    # Verify Julian: 22.00% -> Below 25% threshold (Non-UBO)
    assert julian.effective_percentage == 22.00
    assert julian.is_ubo is False
    assert julian.threshold_status == "NON_UBO_MINORITY"
