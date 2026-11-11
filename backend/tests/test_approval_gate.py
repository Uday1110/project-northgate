"""
Test Suite: Approval Gate Enforcement (PROVISIONAL-GAP-6).
Verifies that no outbound message is dispatched without analyst approval,
except approved re-take templates containing no case-specific risk content.
"""

import pytest
from app.orchestrator.approval_gate import ApprovalGate, UnapprovedOutboundSendError
from app.models.schemas import OutboundNotification
from app.audit.audit_log import AuditLog

@pytest.fixture
def gate():
    audit_log = AuditLog()
    return ApprovalGate(audit_log=audit_log)

def test_unapproved_risky_notification_is_blocked(gate):
    notification = OutboundNotification(
        id="NOTIF-001",
        case_id="CASE-2024-8841",
        recipient="compliance@harborcrest.com",
        template_id="TPL_DEFICIENCY_PUNCHLIST",
        content="Discrepancy identified in registry address and beneficial ownership.",
        is_retake_template=False,
        contains_case_specific_risk=True
    )
    
    with pytest.raises(UnapprovedOutboundSendError) as exc_info:
        gate.validate_and_dispatch(notification)
    
    assert "Approval Gate Violation" in str(exc_info.value)
    assert not gate.is_notification_approved("NOTIF-001")

def test_approved_risky_notification_dispatches_successfully(gate):
    notification = OutboundNotification(
        id="NOTIF-002",
        case_id="CASE-2024-8841",
        recipient="compliance@harborcrest.com",
        template_id="TPL_DEFICIENCY_PUNCHLIST",
        content="Discrepancy identified in registry address.",
        is_retake_template=False,
        contains_case_specific_risk=True
    )
    
    # Analyst approves message
    approval_rec = gate.approve_notification(
        notification_id="NOTIF-002",
        analyst_id="ANALYST-SARAH-CHEN",
        notes="Reviewed punch list and verified regulatory alignment"
    )
    assert approval_rec.status == "APPROVED"
    assert gate.is_notification_approved("NOTIF-002")
    
    # Now dispatch succeeds
    dispatched = gate.validate_and_dispatch(notification)
    assert dispatched is True

def test_retake_template_without_risk_content_bypasses_gate(gate):
    # PROVISIONAL-GAP-6: Re-take template without risk content may bypass gate
    retake_notif = OutboundNotification(
        id="NOTIF-RETAKE-001",
        case_id="CASE-2024-8841",
        recipient="arthur.pendelton@harborcrest.com",
        template_id="TPL_LIVENESS_RETAKE",
        content="Your photo submission was unclear. Please retry the biometric capture using the secure link.",
        is_retake_template=True,
        contains_case_specific_risk=False
    )
    
    # Must bypass without explicit prior analyst approval
    dispatched = gate.validate_and_dispatch(retake_notif)
    assert dispatched is True

def test_retake_template_with_risk_content_is_blocked_without_approval(gate):
    # PROVISIONAL-GAP-6: If re-take template contains risk notes, it cannot bypass
    retake_with_risk = OutboundNotification(
        id="NOTIF-RETAKE-002",
        case_id="CASE-2024-8841",
        recipient="arthur.pendelton@harborcrest.com",
        template_id="TPL_LIVENESS_RETAKE",
        content="Your liveness failed due to suspicion of deepfake injection artifact. Please retake.",
        is_retake_template=True,
        contains_case_specific_risk=True  # Has case-specific risk commentary
    )
    
    with pytest.raises(UnapprovedOutboundSendError):
        gate.validate_and_dispatch(retake_with_risk)
