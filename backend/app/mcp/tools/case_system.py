"""
MCP Gated Tool: Case System.
Stores and manages active onboarding cases, extracted cap tables, and deficiency punch lists.
"""

from typing import Dict, Any, List, Optional
from app.fixtures.sample_data import HARBOR_CREST_FIXTURE_CASE

class CaseSystemTool:
    def __init__(self):
        self.cases: Dict[str, Dict[str, Any]] = {
            HARBOR_CREST_FIXTURE_CASE["case_id"]: dict(HARBOR_CREST_FIXTURE_CASE)
        }
        self.deficiencies: Dict[str, List[Dict[str, Any]]] = {}
        self.cap_tables: Dict[str, List[Dict[str, Any]]] = {}

    def get_case(self, case_id: str) -> Optional[Dict[str, Any]]:
        return self.cases.get(case_id)

    def update_case_status(self, case_id: str, new_status: str) -> bool:
        if case_id in self.cases:
            self.cases[case_id]["status"] = new_status
            return True
        return False

    def record_deficiency(self, case_id: str, deficiency: Dict[str, Any]) -> str:
        if case_id not in self.deficiencies:
            self.deficiencies[case_id] = []
        self.deficiencies[case_id].append(deficiency)
        return deficiency.get("id", "DEF-UNKNOWN")

    def get_deficiencies(self, case_id: str) -> List[Dict[str, Any]]:
        return self.deficiencies.get(case_id, [])

    def save_cap_table(self, case_id: str, cap_table_nodes: List[Dict[str, Any]]) -> None:
        self.cap_tables[case_id] = cap_table_nodes

    def get_cap_table(self, case_id: str) -> List[Dict[str, Any]]:
        return self.cap_tables.get(case_id, [])
