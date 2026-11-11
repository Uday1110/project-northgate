"""
Orchestrator Sub-Component: Approval Gate.
Blocks all outbound sends except approved re-take templates (PROVISIONAL-GAP-6).
"""

from typing import Dict, Any, Optional
import datetime

class UnapprovedOutboundSendError(Exception):
    pass

class ApprovalGate:
    def __init__(self, audit_log: Optional[Any] = None):
        self.approved_records: Dict[str, Dict[str, Any]] = {}
        self.audit_log = audit_log

    def approve_dispatch(self, message_id: str, analyst_id: str, justification: str) -> Dict[str, Any]:
        """
        Human analyst grants formal sign-off for outbound message dispatch.
        """
        record = {
            "message_id": message_id,
            "analyst_id": analyst_id,
            "justification": justification,
            "is_approved": True,
            "status": "APPROVED",
            "approved_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        self.approved_records[message_id] = record
        if self.audit_log:
            self.audit_log.record_event(
                case_id="OUTBOUND_GATE",
                actor=analyst_id,
                category="ANALYST_APPROVAL",
                description=f"Outbound dispatch approved for {message_id}",
                source_reference=message_id,
                reason=justification
            )
        return record

    def approve_notification(self, notification_id: str, analyst_id: str, notes: str):
        class ApprovalRec:
            def __init__(self, notif_id, status, notes):
                self.notification_id = notif_id
                self.status = status
                self.notes = notes
        self.approve_dispatch(notification_id, analyst_id, notes)
        return ApprovalRec(notification_id, "APPROVED", notes)

    def is_notification_approved(self, notification_id: str) -> bool:
        rec = self.approved_records.get(notification_id)
        return bool(rec and rec.get("is_approved"))

    def check_can_dispatch(
        self,
        template_id: str,
        message_id: str,
        contains_case_specific_risk: bool = False
    ) -> bool:
        """
        PROVISIONAL-GAP-6: Re-take messages are approved templates that bypass the approval gate
        only when they contain no case-specific risk content. Anything else is strictly gated.
        """
        is_retake_template = "RETAKE" in template_id.upper()

        # Bypass criteria: re-take template without risk content
        if is_retake_template and not contains_case_specific_risk:
            return True

        # Otherwise requires explicit approval
        approval = self.approved_records.get(message_id)
        if approval and approval.get("is_approved"):
            return True

        return False

    def validate_and_dispatch(self, notification: Any) -> bool:
        """
        Validates whether notification can be dispatched, or raises UnapprovedOutboundSendError.
        """
        msg_id = getattr(notification, "id", str(notification))
        tmpl_id = getattr(notification, "template_id", "DEFAULT")
        has_risk = getattr(notification, "contains_case_specific_risk", False)

        allowed = self.check_can_dispatch(
            template_id=tmpl_id,
            message_id=msg_id,
            contains_case_specific_risk=has_risk
        )

        if not allowed:
            raise UnapprovedOutboundSendError(
                f"Approval Gate Violation: Outbound message '{msg_id}' requires explicit human analyst approval before dispatch."
            )

        if self.audit_log:
            self.audit_log.record_event(
                case_id=getattr(notification, "case_id", "UNKNOWN"),
                actor="APPROVAL_GATE",
                category="OUTBOUND_DISPATCH",
                description=f"Message '{msg_id}' passed approval gate (template: {tmpl_id})",
                source_reference=msg_id
            )

        return True
