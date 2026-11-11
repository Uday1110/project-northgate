"""
Orchestrator Sub-Component: Fallback Kill Switch.
Circuit breaker that freezes all automated agentic actions upon gateway outage,
system failure, or manual emergency stop.
"""

from typing import Dict, Any, Set, Optional

class KillSwitchTrippedError(Exception):
    pass

class KillSwitchRecord:
    def __init__(self, case_id: str, is_active: bool, reason: str, triggered_by: str):
        self.case_id = case_id
        self.is_active = is_active
        self.reason = reason
        self.triggered_by = triggered_by

class FallbackKillSwitch:
    def __init__(self, audit_log: Optional[Any] = None):
        self.audit_log = audit_log
        self.is_global_kill_switch_active: bool = False
        self.frozen_cases: Set[str] = set()
        self.reasons: Dict[str, str] = {}

    def engage(self, case_id: str, reason: str, triggered_by: str = "SYSTEM") -> KillSwitchRecord:
        if case_id == "GLOBAL":
            self.engage_global_kill_switch(reason)
        else:
            self.engage_case_kill_switch(case_id, reason)

        if self.audit_log:
            self.audit_log.record_event(
                case_id=case_id,
                actor=triggered_by,
                category="KILL_SWITCH",
                description=f"Fallback kill switch engaged for {case_id}: {reason}",
                source_reference="FALLBACK_KILL_SWITCH",
                reason=reason
            )

        return KillSwitchRecord(case_id, True, reason, triggered_by)

    def disengage(self, case_id: str, resolved_by: str = "ANALYST") -> None:
        if case_id == "GLOBAL":
            self.disengage_global()
        else:
            self.disengage_case(case_id)

        if self.audit_log:
            self.audit_log.record_event(
                case_id=case_id,
                actor=resolved_by,
                category="KILL_SWITCH",
                description=f"Fallback kill switch disengaged for {case_id}",
                source_reference="FALLBACK_KILL_SWITCH"
            )

    def is_case_tripped(self, case_id: str) -> bool:
        if self.is_global_kill_switch_active:
            return True
        return case_id in self.frozen_cases

    def engage_case_kill_switch(self, case_id: str, reason: str = "MANUAL_ANALYST_ABORT") -> None:
        self.frozen_cases.add(case_id)
        self.reasons[case_id] = reason

    def engage_global_kill_switch(self, reason: str = "AI_GATEWAY_OUTAGE") -> None:
        self.is_global_kill_switch_active = True
        self.reasons["GLOBAL"] = reason

    def disengage_case(self, case_id: str) -> None:
        self.frozen_cases.discard(case_id)
        self.reasons.pop(case_id, None)

    def disengage_global(self) -> None:
        self.is_global_kill_switch_active = False
        self.reasons.pop("GLOBAL", None)

    def assert_case_can_execute(self, case_id: str) -> None:
        """
        Enforces that a frozen case cannot dispatch any worker.
        """
        if self.is_global_kill_switch_active:
            reason = self.reasons.get("GLOBAL", "Global Kill Switch Active")
            raise KillSwitchTrippedError(f"Global Fallback Kill Switch Engaged: {reason}. Case execution prohibited.")

        if case_id in self.frozen_cases:
            reason = self.reasons.get(case_id, "Case Kill Switch Engaged")
            raise KillSwitchTrippedError(f"Kill switch is ENGAGED for case {case_id}: {reason}. Worker dispatch frozen.")
