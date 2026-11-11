"""
Fictional reference sample data for Harbor Crest Holdings Ltd.
Labeled explicitly as fixtures. Never invent registry data or personal data.
"""

from typing import Dict, Any, List

HARBOR_CREST_FIXTURE_CASE: Dict[str, Any] = {
    "case_id": "CASE-2024-8841",
    "entity_name": "Harbor Crest Holdings Ltd",
    "crn": "08921471",
    "lei": "213800XYZ90123456789",
    "jurisdiction": "United Kingdom / Private Ltd",
    "status": "READY_FOR_REVIEW",
    "is_fixture_data": True,
    "fixture_label": "FIXTURE_DATA_HARBOR_CREST_V1"
}

# Ownership Hierarchy Tree (3 Layers)
HARBOR_CREST_OWNERSHIP_FIXTURES: List[Dict[str, Any]] = [
    {
        "id": "node-target",
        "name": "Harbor Crest Holdings Ltd",
        "role": "Operating Target Entity",
        "tier": 1,
        "direct_pct": 100.0,
        "parent_id": None,
        "is_natural_person": False,
        "is_fixture": True
    },
    {
        "id": "node-holding",
        "name": "Atlantic Horizon Capital Ltd",
        "role": "Conduit / Holding Co",
        "jurisdiction": "Cayman Islands",
        "tier": 2,
        "direct_pct": 60.0,
        "parent_id": "node-target",
        "is_natural_person": False,
        "is_fixture": True
    },
    {
        "id": "node-arthur",
        "name": "Arthur Pendelton",
        "role": "Natural Person Shareholder",
        "citizenship": "British (GB)",
        "tier": 3,
        "direct_pct": 53.33,  # 53.33% of Atlantic Horizon (60.0% * 53.33% = 32.00% effective)
        "parent_id": "node-holding",
        "is_natural_person": True,
        "passport_expiry": "2024-01-12",  # Expired Jan 2024
        "is_fixture": True
    },
    {
        "id": "node-helena",
        "name": "Helena Vance-Cross",
        "role": "Natural Person Shareholder",
        "citizenship": "Canadian (CA)",
        "tier": 3,
        "direct_pct": 46.67,  # 46.67% of Atlantic Horizon (60.0% * 46.67% = 28.00% effective)
        "parent_id": "node-holding",
        "is_natural_person": True,
        "passport_expiry": "2028-09-30",  # Valid
        "is_fixture": True
    },
    {
        "id": "node-julian",
        "name": "Julian Sterling",
        "role": "Direct Shareholder",
        "citizenship": "British (GB)",
        "tier": 2,
        "direct_pct": 22.0,  # 22.0% direct in Target (< 25% threshold)
        "parent_id": "node-target",
        "is_natural_person": True,
        "passport_expiry": "2027-05-15",
        "is_fixture": True
    },
    {
        "id": "node-vanguard",
        "name": "Vanguard Pacific Nominees",
        "role": "Nominee / Regulated Trustee",
        "jurisdiction": "Jersey (JE)",
        "tier": 2,
        "direct_pct": 18.0,  # 18.0% direct in Target (< 25% threshold)
        "parent_id": "node-target",
        "is_natural_person": False,
        "is_fixture": True
    }
]

# Statutory Registry Fixture Data (Companies House API v3)
COMPANIES_HOUSE_FIXTURE_RECORDS: Dict[str, Dict[str, Any]] = {
    "08921471": {
        "company_name": "HARBOR CREST HOLDINGS LIMITED",
        "company_number": "08921471",
        "company_status": "active",
        "date_of_creation": "2014-06-15",
        "registered_office_address": {
            "address_line_1": "128 Cannon Street",
            "premises": "4th Floor",
            "locality": "London",
            "postal_code": "EC4N 6AS",
            "country": "United Kingdom"
        },
        "is_official_fixture": True,
        "fixture_source": "UK_COMPANIES_HOUSE_FIXTURE_STORE"
    }
}
