"""
MCP Gated Tool: Notifications.
PROVISIONAL-GAP-6: Re-take messages are approved templates that bypass the approval gate
only when they contain no case-specific risk content. Anything else is gated.
"""

from typing import Dict, Any, List, Optional
import uuid
import datetime

class NotificationsTool:
    """
    Gated notifications tool. Enforces approval records on all outbound sends
    except low-risk approved re-take templates.
    """
    def __init__(self):
        self.outbound_messages: List[Dict[str, Any]] = []
        self.approved_templates = {
            "TEMPLATE_LIVENESS_RETAKE_BASIC": "Please retake your biometric liveness verification using the provided secure link.",
            "TEMPLATE_WELCOME_ONBOARDING": "Welcome to Northgate Banking. Your corporate account is activated.",
            "TEMPLATE_DEFICIENCY_OUTREACH": "Please provide the requested statutory documents for verification."
        }

    def send_notification(
        self,
        case_id: str,
        recipient: str,
        template_id: str,
        contains_case_specific_risk: bool = False,
        approval_record: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Dispatches outbound notification.
        PROVISIONAL-GAP-6: Re-take messages bypass approval gate ONLY when containing
        no case-specific risk content. All other messages strictly require an approval record.
        """
        if template_id not in self.approved_templates:
            raise ValueError(f"Template {template_id} is not an approved regulatory template.")

        is_retake_template = (template_id == "TEMPLATE_LIVENESS_RETAKE_BASIC")

        # Check approval gate exception
        can_bypass_gate = is_retake_template and (not contains_case_specific_risk)

        if not can_bypass_gate and (not approval_record or not approval_record.get("is_approved")):
            raise PermissionError(
                f"Approval Gate Block: Outbound message using template {template_id} cannot be dispatched without explicit human analyst approval."
            )

        msg_id = f"MSG-{uuid.uuid4().hex[:8]}"
        record = {
            "id": msg_id,
            "case_id": case_id,
            "recipient": recipient,
            "template_id": template_id,
            "content": self.approved_templates[template_id],
            "dispatched_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "bypassed_gate": can_bypass_gate,
            "approved_by": approval_record.get("analyst_id") if approval_record else ("AUTO_RETAKE_EXEMPTION" if can_bypass_gate else None)
        }
        self.outbound_messages.append(record)
        return record
