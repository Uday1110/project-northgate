"""
Test Suite: Fallback Kill Switch.
Tests immediate halt of execution, state preservation, and audit logging.
"""

import pytest
from app.orchestrator.kill_switch import FallbackKillSwitch, KillSwitchTrippedError
from app.audit.audit_log import AuditLog

@pytest.fixture
def kill_switch():
    audit_log = AuditLog()
    return FallbackKillSwitch(audit_log=audit_log)

def test_case_level_kill_switch_engagement(kill_switch):
    case_id = "CASE-2024-8841"
    
    # Assert normal operation
    kill_switch.assert_case_can_execute(case_id)
    assert not kill_switch.is_case_tripped(case_id)
    
    # Engage switch
    record = kill_switch.engage(
        case_id=case_id,
        reason="Sanctions alert triggered during entity hierarchy resolution",
        triggered_by="ORCHESTRATOR_GUARDRAIL"
    )
    
    assert record.is_active is True
    assert record.case_id == case_id
    assert kill_switch.is_case_tripped(case_id)
    
    # Execution must be frozen
    with pytest.raises(KillSwitchTrippedError) as exc_info:
        kill_switch.assert_case_can_execute(case_id)
    assert "Kill switch is ENGAGED" in str(exc_info.value)
    
    # Disengage switch
    kill_switch.disengage(case_id=case_id, resolved_by="CHIEF_COMPLIANCE_OFFICER")
    assert not kill_switch.is_case_tripped(case_id)
    
    # Execution resumes
    kill_switch.assert_case_can_execute(case_id)

def test_global_kill_switch_engagement(kill_switch):
    # Engage global switch
    kill_switch.engage(
        case_id="GLOBAL",
        reason="Infrastructure security boundary test",
        triggered_by="SYSTEM_SECURITY"
    )
    
    # Any case must be blocked
    with pytest.raises(KillSwitchTrippedError):
        kill_switch.assert_case_can_execute("ANY-CASE-999")
