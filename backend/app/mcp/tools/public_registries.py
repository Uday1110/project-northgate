"""
MCP Gated Tool: Public Registries.
PROVISIONAL-GAP-4: Public registries is a fourth gated MCP tool covering Companies House,
GLEIF, and OpenCorporates.
With no API keys configured, it returns fixture data only.
Never invent registry values; fixtures must be labeled as fixtures.
"""

from typing import Dict, Any, Optional
from app.fixtures.sample_data import COMPANIES_HOUSE_FIXTURE_RECORDS

class PublicRegistriesTool:
    """
    Gated MCP tool querying official registries (UK Companies House, GLEIF, OpenCorporates).
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.is_connected_to_live_api = bool(api_key)

    def lookup_company(self, company_number: str) -> Dict[str, Any]:
        """
        Retrieves statutory company details.
        Returns fixture data labeled explicitly as fixtures if no API key is configured.
        """
        if not self.is_connected_to_live_api:
            # Return fixture data labeled as fixtures
            record = COMPANIES_HOUSE_FIXTURE_RECORDS.get(company_number)
            if record:
                return {
                    "source": "UK_COMPANIES_HOUSE",
                    "is_fixture": True,
                    "fixture_label": "COMPANIES_HOUSE_SAMPLE_FIXTURE",
                    "data": record
                }
            return {
                "source": "UK_COMPANIES_HOUSE",
                "is_fixture": True,
                "fixture_label": "NOT_FOUND_FIXTURE",
                "data": None,
                "error": f"Company number {company_number} not found in fixture store."
            }

        # If live API key were present (out of pilot scope / unconfigured)
        raise NotImplementedError("Live external registry access requires valid API credentials.")

    def lookup_lei(self, lei_code: str) -> Dict[str, Any]:
        """
        GLEIF LEI lookup tool stub.
        """
        return {
            "source": "GLEIF_GLOBAL_LEI",
            "is_fixture": True,
            "fixture_label": "GLEIF_SAMPLE_FIXTURE",
            "data": {
                "lei": lei_code,
                "legal_name": "HARBOR CREST HOLDINGS LIMITED",
                "registration_status": "ISSUED",
                "conformity_flag": "CONFORMING"
            }
        }
