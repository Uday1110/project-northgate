"""
Test Suite: WORM-Compliant Audit Ledger.
Verifies append-only SHA-256 hash chaining, detection of tampering,
and strict rejection of analyst overrides lacking written justification.
"""

import pytest
from app.audit.audit_log import AuditLog, AuditValidationError

def test_audit_log_append_only_and_hash_chain():
    audit_log = AuditLog()
    case_id = "CASE-2024-8841"
    
    e1 = audit_log.record_event(
        case_id=case_id,
        actor="ORCHESTRATOR",
        category="WORKER_COMPLETION",
        description="Leptos OCR document parsing completed",
        source_reference="DOC-REF-001"
    )
    assert e1.seq == 1
    assert e1.previous_hash == "0000000000000000000000000000000000000000000000000000000000000000"
    
    e2 = audit_log.record_event(
        case_id=case_id,
        actor="ORCHESTRATOR",
        category="WORKER_COMPLETION",
        description="Public registries reconciliation completed",
        source_reference="COMPANIES_HOUSE_0849201"
    )
    assert e2.seq == 2
    assert e2.previous_hash == e1.hash
    
    assert audit_log.verify_chain_integrity() is True

def test_tampering_breaks_audit_chain():
    audit_log = AuditLog()
    case_id = "CASE-2024-8841"
    
    audit_log.record_event(
        case_id=case_id,
        actor="WORKER_1",
        category="SYSTEM_EVENT",
        description="Initial ingest",
        source_reference="REF-1"
    )
    audit_log.record_event(
        case_id=case_id,
        actor="WORKER_2",
        category="SYSTEM_EVENT",
        description="Registry check",
        source_reference="REF-2"
    )
    
    assert audit_log.verify_chain_integrity() is True
    
    # Tamper with first entry description
    audit_log.entries[0].description = "Tampered unauthorized text"
    
    assert audit_log.verify_chain_integrity() is False

def test_analyst_override_requires_written_reason():
    audit_log = AuditLog()
    case_id = "CASE-2024-8841"
    
    # Attempt override with None or empty reason
    with pytest.raises(AuditValidationError) as exc_info:
        audit_log.record_event(
            case_id=case_id,
            actor="ANALYST-007",
            category="ANALYST_OVERRIDE",
            description="Overrode address mismatch between cert and Companies House",
            source_reference="DEF-001",
            reason=""  # Empty reason
        )
    assert "Analyst overrides without a written justification" in str(exc_info.value)
    
    with pytest.raises(AuditValidationError):
        audit_log.record_event(
            case_id=case_id,
            actor="ANALYST-007",
            category="ANALYST_OVERRIDE",
            description="Overrode address mismatch",
            source_reference="DEF-001",
            reason=None
        )

def test_analyst_override_with_valid_reason_succeeds():
    audit_log = AuditLog()
    case_id = "CASE-2024-8841"
    
    entry = audit_log.record_event(
        case_id=case_id,
        actor="ANALYST-007",
        category="ANALYST_OVERRIDE",
        description="Overrode address mismatch between cert and Companies House",
        source_reference="DEF-001",
        reason="Board resolution dated 2024-03-01 confirms registered office move from 45 Berkeley Sq to 100 Bishopsgate. Companies House filing AD01 verified pending processing."
    )
    
    assert entry.category == "ANALYST_OVERRIDE"
    assert entry.reason is not None
    assert audit_log.verify_chain_integrity() is True
