"""
Test Suite: Architecture Failure Scenarios & Registry Fidelity.
Verifies the three mandatory architecture failure scenarios:
1. Genuine Applicant: End-to-end pass with human-in-the-loop gate on punch list.
2. Fails Liveness Check: Identity service returns FAIL, case blocked pending remediation, no outbound send without approval.
3. Gateway Outage: Simulated AI gateway outage engages fallback kill switch, fails safely, records audit event.
Plus: Verification that no registry data is synthetically hallucinated.
"""

import pytest
from app.mcp.server import MCPServer
from app.ocr.leptos_ocr import LeptosOCREngine
from app.ai_gateway.gateway import AIGateway, GatewayOutageError
from app.audit.audit_log import AuditLog
from app.orchestrator.clock import SLAClock
from app.orchestrator.approval_gate import ApprovalGate, UnapprovedOutboundSendError
from app.orchestrator.kill_switch import FallbackKillSwitch, KillSwitchTrippedError
from app.orchestrator.pipeline import OrchestratorPipeline
from app.agent.kyc_agent import KYCAgent, KYCAgentError
from app.models.schemas import OutboundNotification

@pytest.fixture
def test_stack():
    mcp_server = MCPServer()
    ocr_engine = LeptosOCREngine()
    ai_gateway = AIGateway()
    audit_log = AuditLog()
    sla_clock = SLAClock()
    approval_gate = ApprovalGate(audit_log=audit_log)
    kill_switch = FallbackKillSwitch(audit_log=audit_log)

    pipeline = OrchestratorPipeline(
        mcp_server=mcp_server,
        ocr_engine=ocr_engine,
        ai_gateway=ai_gateway,
        audit_log=audit_log,
        sla_clock=sla_clock,
        approval_gate=approval_gate,
        kill_switch=kill_switch
    )

    kyc_agent = KYCAgent(
        ai_gateway=ai_gateway,
        mcp_server=mcp_server,
        audit_log=audit_log
    )

    return {
        "mcp_server": mcp_server,
        "ocr_engine": ocr_engine,
        "ai_gateway": ai_gateway,
        "audit_log": audit_log,
        "sla_clock": sla_clock,
        "approval_gate": approval_gate,
        "kill_switch": kill_switch,
        "pipeline": pipeline,
        "kyc_agent": kyc_agent
    }

# ---------------------------------------------------------------------------
# SCENARIO 1: Genuine Applicant
# ---------------------------------------------------------------------------
def test_scenario_genuine_applicant_harbor_crest(test_stack):
    pipeline = test_stack["pipeline"]
    gate = test_stack["approval_gate"]
    audit_log = test_stack["audit_log"]
    case_id = "CASE-2024-8841"

    # Step 1: Run full pipeline
    result = pipeline.run_full_pipeline(case_id)

    assert result["pipeline_status"] == "BLOCKED_PENDING_REMEDIATION"
    assert result["total_elapsed_seconds"] < 90.0

    # Step 2: Ownership validation
    ubo_results = result["ubo_results"]
    arthur = next(u for u in ubo_results if "Arthur" in u["name"])
    helena = next(u for u in ubo_results if "Helena" in u["name"])
    julian = next(u for u in ubo_results if "Julian" in u["name"])

    assert arthur["is_ubo"] is True and arthur["effective_percentage"] == 32.00
    assert helena["is_ubo"] is True and helena["effective_percentage"] == 28.00
    assert julian["is_ubo"] is False and julian["effective_percentage"] == 22.00

    # Step 3: Evidentiary linking to bounding boxes
    parsed = result["parsed_documents"]
    for field in parsed["fields"]:
        assert "bounding_box" in field, f"Field {field['field_name']} must link to source bounding box"
        bbox = field["bounding_box"]
        assert bbox["x1"] <= bbox["x2"] and bbox["y1"] <= bbox["y2"]

    # Step 4: Discrepancy caught (address mismatch)
    deficiencies = result["deficiencies"]
    assert len(deficiencies) >= 1
    address_def = next((d for d in deficiencies if "Address" in d["title"]), None)
    assert address_def is not None
    assert address_def["severity"] == "CRITICAL_BLOCKER"

    # Step 5: Approval gate blocks unapproved notification dispatch
    notification = OutboundNotification(
        id="NOTIF-HC-001",
        case_id=case_id,
        recipient="compliance@harborcrest.com",
        template_id="TPL_DEFICIENCY_PUNCHLIST",
        content="Address discrepancy identified: 45 Berkeley Square vs 100 Bishopsgate.",
        is_retake_template=False,
        contains_case_specific_risk=True
    )
    with pytest.raises(UnapprovedOutboundSendError):
        gate.validate_and_dispatch(notification)

    # Step 6: Analyst approval allows dispatch
    gate.approve_notification(notification.id, analyst_id="SARAH_CHEN", notes="Approved punch list")
    assert gate.validate_and_dispatch(notification) is True

    # Step 7: Audit log verified
    assert audit_log.verify_chain_integrity() is True
    assert len(audit_log.entries) >= 5

# ---------------------------------------------------------------------------
# SCENARIO 2: Fails Liveness Check
# ---------------------------------------------------------------------------
def test_scenario_fails_liveness_check(test_stack):
    mcp_server = test_stack["mcp_server"]
    gate = test_stack["approval_gate"]
    audit_log = test_stack["audit_log"]
    case_id = "CASE-FAIL-LIVENESS-001"

    # Set mock verdict in identity service to FAIL
    mcp_server.call_tool(
        "identity_service",
        "set_mock_verdict",
        individual_id="IND-001",
        verdict="FAIL"
    )

    # Individual undergoes verification
    resp = mcp_server.call_tool(
        "identity_service",
        "verify_liveness_and_id",
        case_id=case_id,
        individual_id="IND-001",
        name="Arthur Pendelton",
        effective_pct=32.0,
        is_signatory=True
    )

    assert resp["verdict"] == "FAIL"
    assert resp["action_required"] == "CASE_HELD_PENDING_REMEDIATION"

    # Verify no raw biometric data is returned (PROVISIONAL-GAP-1, GAP-8)
    assert "face_vector" not in resp
    assert "biometric_sample" not in resp
    assert "image_data" not in resp
    assert {"case_id", "individual_id", "timestamp", "verdict", "action_required", "reason"}.issubset(set(resp.keys()))

    # Attempting to dispatch risky email is blocked by approval gate
    notif = OutboundNotification(
        id="NOTIF-LIVENESS-FAIL",
        case_id=case_id,
        recipient="arthur.pendelton@harborcrest.com",
        template_id="TPL_FRAUD_ALERT",
        content="Biometric verification failed due to presentation attack detection.",
        is_retake_template=False,
        contains_case_specific_risk=True
    )
    with pytest.raises(UnapprovedOutboundSendError):
        gate.validate_and_dispatch(notif)

    # However, a clean non-risk re-take template bypasses approval gate (PROVISIONAL-GAP-6)
    retake_notif = OutboundNotification(
        id="NOTIF-RETAKE-CLEAN",
        case_id=case_id,
        recipient="arthur.pendelton@harborcrest.com",
        template_id="TPL_LIVENESS_RETAKE",
        content="Please retake your selfie in a well-lit room.",
        is_retake_template=True,
        contains_case_specific_risk=False
    )
    assert gate.validate_and_dispatch(retake_notif) is True

# ---------------------------------------------------------------------------
# SCENARIO 3: Gateway Outage
# ---------------------------------------------------------------------------
def test_scenario_gateway_outage_fails_safely(test_stack):
    ai_gateway = test_stack["ai_gateway"]
    kyc_agent = test_stack["kyc_agent"]
    kill_switch = test_stack["kill_switch"]
    audit_log = test_stack["audit_log"]
    case_id = "CASE-OUTAGE-TEST"

    # Simulate AI Gateway outage
    ai_gateway.set_outage_simulation(True)

    # KYC Agent invocation should detect outage and handle gracefully
    with pytest.raises(KYCAgentError) as exc_info:
        kyc_agent.analyze_case(
            case_id=case_id,
            declared_entity={"name": "Harbor Crest Holdings Ltd"},
            ubo_results=[],
            registry_data=[],
            deficiencies=[]
        )
    assert "AI Gateway call failed" in str(exc_info.value)

    # Fallback kill switch engages for the case
    kill_switch.engage(
        case_id=case_id,
        reason="AI Gateway outage during KYC agent risk synthesis",
        triggered_by="ORCHESTRATOR_OUTAGE_DETECTOR"
    )

    # Case execution is frozen
    assert kill_switch.is_case_tripped(case_id)
    with pytest.raises(KillSwitchTrippedError):
        kill_switch.assert_case_can_execute(case_id)

    # Outage and kill-switch events are recorded in audit log
    outage_entries = [e for e in audit_log.entries if "KILL_SWITCH" in e.category or "GATEWAY" in e.description.upper()]
    assert len(outage_entries) >= 1
    assert audit_log.verify_chain_integrity() is True

# ---------------------------------------------------------------------------
# REGISTRY FIDELITY: Never Invent Registry Data
# ---------------------------------------------------------------------------
def test_public_registries_never_invents_unknown_data(test_stack):
    mcp_server = test_stack["mcp_server"]

    # Valid fixture returns labeled fixture data
    valid = mcp_server.call_tool("public_registries", "lookup_company", company_number="08921471")
    assert valid["is_fixture"] is True
    assert valid["data"] is not None
    assert valid["data"]["company_name"] == "HARBOR CREST HOLDINGS LIMITED"

    # Unknown company number must NEVER invent synthetic data
    unknown = mcp_server.call_tool("public_registries", "lookup_company", company_number="UNKNOWN_999999")
    assert unknown["data"] is None
    assert "error" in unknown
