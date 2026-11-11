"""
Test Suite: MCP Server & Four Gated Tools.
PROVISIONAL-GAP-3: MCP Server with 4 gated tools.
PROVISIONAL-GAP-1 & GAP-8: Identity Service returns verdicts only.
PROVISIONAL-GAP-4: Public registries returns labeled fixtures without API keys.
"""

import pytest
from app.mcp.server import MCPServer

@pytest.fixture
def mcp_server():
    return MCPServer()

def test_mcp_server_exposes_four_gated_tools(mcp_server):
    tools = mcp_server.list_tools()
    assert len(tools) == 4
    assert "identity_service" in tools
    assert "case_system" in tools
    assert "notifications" in tools
    assert "public_registries" in tools

def test_identity_service_returns_verdicts_only(mcp_server):
    # Test for Qualified UBO (>= 25%)
    res = mcp_server.call_tool(
        "identity_service",
        "verify_liveness_and_id",
        case_id="CASE-2024-8841",
        individual_id="ind-01",
        name="Arthur Pendelton",
        effective_pct=32.0,
        passport_expiry="2024-01-12"  # Expired
    )

    assert "verdict" in res
    assert res["verdict"] == "EXPIRED_CREDENTIAL"
    assert "verification_id" in res
    assert "case_id" in res
    assert "timestamp" in res

    # PROVISIONAL-GAP-8: Verify raw biometric telemetry is NOT stored or returned
    assert "face_vector" not in res
    assert "biometric_template" not in res
    assert "video_recording" not in res

def test_public_registries_returns_labeled_fixture_data(mcp_server):
    res = mcp_server.call_tool(
        "public_registries",
        "lookup_company",
        company_number="08921471"
    )

    assert res["source"] == "UK_COMPANIES_HOUSE"
    assert res["is_fixture"] is True
    assert "fixture_label" in res
    assert res["fixture_label"] == "COMPANIES_HOUSE_SAMPLE_FIXTURE"

    data = res["data"]
    assert data["company_name"] == "HARBOR CREST HOLDINGS LIMITED"
    assert data["registered_office_address"]["postal_code"] == "EC4N 6AS"

def test_public_registries_never_invents_unknown_records(mcp_server):
    # Query an unknown company number
    res = mcp_server.call_tool(
        "public_registries",
        "lookup_company",
        company_number="9999999999"
    )

    # Must return not found, never invent a fictitious company!
    assert res["data"] is None
    assert "error" in res
