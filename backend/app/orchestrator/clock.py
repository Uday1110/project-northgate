"""
Orchestrator Sub-Component: 24-Hour Clock.
Records SLA start, flags breaches, and pauses on escalation.
"""

from typing import Dict, Any, Optional
import datetime

class SLAClock:
    def __init__(self, sla_hours: float = 24.0):
        self.sla_duration = datetime.timedelta(hours=sla_hours)
        self.start_times: Dict[str, datetime.datetime] = {}
        self.is_paused: Dict[str, bool] = {}
        self.paused_durations: Dict[str, datetime.timedelta] = {}
        self.pause_start_times: Dict[str, datetime.datetime] = {}

    def start_clock(self, case_id: str) -> str:
        now = datetime.datetime.now(datetime.timezone.utc)
        self.start_times[case_id] = now
        self.is_paused[case_id] = False
        self.paused_durations[case_id] = datetime.timedelta()
        return now.isoformat()

    def pause_clock_on_escalation(self, case_id: str, reason: str = "ESCALATED_TO_SUPERVISOR") -> bool:
        if case_id in self.start_times and not self.is_paused.get(case_id, False):
            self.is_paused[case_id] = True
            self.pause_start_times[case_id] = datetime.datetime.now(datetime.timezone.utc)
            return True
        return False

    def resume_clock(self, case_id: str) -> bool:
        if case_id in self.start_times and self.is_paused.get(case_id, False):
            pause_start = self.pause_start_times.pop(case_id, None)
            if pause_start:
                now = datetime.datetime.now(datetime.timezone.utc)
                self.paused_durations[case_id] += (now - pause_start)
            self.is_paused[case_id] = False
            return True
        return False

    def check_sla_status(self, case_id: str) -> Dict[str, Any]:
        if case_id not in self.start_times:
            raise KeyError(f"Case {case_id} not registered with SLA clock.")

        start_time = self.start_times[case_id]
        now = datetime.datetime.now(datetime.timezone.utc)

        if self.is_paused.get(case_id, False):
            pause_start = self.pause_start_times[case_id]
            effective_elapsed = (pause_start - start_time) - self.paused_durations[case_id]
            is_currently_paused = True
        else:
            effective_elapsed = (now - start_time) - self.paused_durations[case_id]
            is_currently_paused = False

        is_breached = effective_elapsed > self.sla_duration
        remaining = self.sla_duration - effective_elapsed

        return {
            "case_id": case_id,
            "start_time": start_time.isoformat(),
            "elapsed_seconds": effective_elapsed.total_seconds(),
            "is_paused": is_currently_paused,
            "is_breached": is_breached,
            "remaining_seconds": max(0.0, remaining.total_seconds())
        }
