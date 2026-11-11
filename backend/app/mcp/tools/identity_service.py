"""
MCP Gated Tool: Identity Service.
PROVISIONAL-GAP-1: Apply liveness checks to Qualified UBOs (25% or more) and Authorized Signatories.
Implement as a stub adapter behind the Identity service interface.
Store only the case ID, individual ID, timestamp, and verdict.
Store no raw biometric data.
PROVISIONAL-GAP-5: Liveness verdicts link to the case record by case ID, individual ID, timestamp, and verdict.
PROVISIONAL-GAP-8: No retention of biometric data.
TODO: Compliance decision pending on formal biometric retention periods. Do not set a value.
"""

from typing import Dict, Any, Optional
import datetime
import uuid

class IdentityServiceTool:
    """
    Gated tool for verifying individual identity and biometric liveness.
    Strictly returns verdicts only; never stores or returns raw biometric telemetry.
    """
    def __init__(self):
        # In-memory storage for verification records (case_id, individual_id, timestamp, verdict only)
        self.verdict_store: Dict[str, Dict[str, Any]] = {}
        self.mock_verdicts: Dict[str, str] = {}

    def set_mock_verdict(self, individual_id: str, verdict: str) -> None:
        """Allows testing failure scenarios by stubbing verdicts."""
        self.mock_verdicts[individual_id] = verdict

    def verify_liveness_and_id(
        self,
        case_id: str,
        individual_id: str,
        name: str,
        effective_pct: float,
        is_signatory: bool = False,
        passport_expiry: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        PROVISIONAL-GAP-1: Checks liveness for Qualified UBOs (>= 25.0%) and Signatories.
        Returns verdicts only.
        """
        # Rule check: Only trigger for UBOs >= 25% or Authorized Signatories
        requires_liveness = (effective_pct >= 25.0) or is_signatory
        timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        verification_id = f"VER-LIVE-{uuid.uuid4().hex[:8]}"

        if not requires_liveness:
            return {
                "verification_id": verification_id,
                "case_id": case_id,
                "individual_id": individual_id,
                "timestamp": timestamp,
                "verdict": "NOT_REQUIRED",
                "notes": "Effective equity < 25.0% and non-signatory."
            }

        # Check document validity
        is_expired = False
        if passport_expiry:
            try:
                exp_date = datetime.date.fromisoformat(passport_expiry)
                today = datetime.date.today()
                if exp_date < today:
                    is_expired = True
            except ValueError:
                pass

        if individual_id in self.mock_verdicts:
            verdict = self.mock_verdicts[individual_id]
        elif is_expired:
            verdict = "EXPIRED_CREDENTIAL"
        elif "FAIL" in individual_id.upper() or "SPOOF" in name.upper():
            verdict = "FAIL"
        else:
            verdict = "PASS"

        # PROVISIONAL-GAP-1, PROVISIONAL-GAP-5 & PROVISIONAL-GAP-8:
        # Store only case_id, individual_id, timestamp, and verdict.
        # Store NO raw biometric data.
        record = {
            "verification_id": verification_id,
            "case_id": case_id,
            "individual_id": individual_id,
            "timestamp": timestamp,
            "verdict": verdict
            # PROVISIONAL-GAP-8: TODO: Compliance decision pending on formal biometric retention periods.
        }
        if verdict == "FAIL":
            record["action_required"] = "CASE_HELD_PENDING_REMEDIATION"
            record["reason"] = "Biometric liveness check failed presentation attack detection."

        self.verdict_store[verification_id] = record
        return record
