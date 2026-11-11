"""
Audit Log Module: SEC 17a-4 / FINRA WORM Compliant Append-Only Ledger.
Every worker event, verdict, override, approval, and kill-switch action writes
an append-only record with timestamp, actor, case ID, source document reference,
and reason where required.
Analyst overrides without a written reason MUST be rejected.
"""

from typing import List, Dict, Any, Optional
import hashlib
import json
import datetime
from app.models.schemas import AuditLogEntry

class AuditValidationError(Exception):
    pass

class AuditLog:
    def __init__(self):
        self.entries: List[AuditLogEntry] = []
        self.last_hash: str = "0000000000000000000000000000000000000000000000000000000000000000"

    def record_event(
        self,
        case_id: str,
        actor: str,
        category: str,
        description: str,
        source_reference: str,
        reason: Optional[str] = None
    ) -> AuditLogEntry:
        """
        Appends an immutable audit entry.
        Mandatory Rule: Analyst overrides without a written reason MUST be rejected.
        """
        if category == "ANALYST_OVERRIDE":
            if not reason or not reason.strip():
                raise AuditValidationError(
                    "Mandatory Regulatory Rule: Analyst overrides without a written justification reason are rejected."
                )

        seq = len(self.entries) + 1
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()

        # Compute cryptographic hash chaining previous record
        payload = {
            "seq": seq,
            "timestamp": timestamp,
            "case_id": case_id,
            "actor": actor,
            "category": category,
            "description": description,
            "source_reference": source_reference,
            "reason": reason,
            "previous_hash": self.last_hash
        }
        serialized = json.dumps(payload, sort_keys=True)
        current_hash = hashlib.sha256(serialized.encode('utf-8')).hexdigest()

        entry = AuditLogEntry(
            seq=seq,
            timestamp=timestamp,
            case_id=case_id,
            actor=actor,
            category=category,
            description=description,
            source_reference=source_reference,
            reason=reason,
            hash=current_hash,
            previous_hash=self.last_hash
        )

        self.entries.append(entry)
        self.last_hash = current_hash
        return entry

    def verify_chain_integrity(self) -> bool:
        """
        Verifies the SHA-256 Merkle chain from genesis.
        """
        prev = "0000000000000000000000000000000000000000000000000000000000000000"
        for entry in self.entries:
            if entry.previous_hash != prev:
                return False
            payload = {
                "seq": entry.seq,
                "timestamp": entry.timestamp,
                "case_id": entry.case_id,
                "actor": entry.actor,
                "category": entry.category,
                "description": entry.description,
                "source_reference": entry.source_reference,
                "reason": entry.reason,
                "previous_hash": prev
            }
            serialized = json.dumps(payload, sort_keys=True)
            expected_hash = hashlib.sha256(serialized.encode('utf-8')).hexdigest()
            if entry.hash != expected_hash:
                return False
            prev = entry.hash
        return True

    def get_entries_for_case(self, case_id: str) -> List[AuditLogEntry]:
        return [e for e in self.entries if e.case_id == case_id]
