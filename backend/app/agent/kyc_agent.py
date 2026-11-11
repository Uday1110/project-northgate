"""
KYC Agent Module.
PROVISIONAL-GAP-2: The KYC agent calls models only through an AI gateway module.
Output schema is strictly validated. Model output never sets UBO percentages.
"""

from typing import Dict, Any, List, Optional
from app.ai_gateway.gateway import AIGateway, AIGatewayError
from app.mcp.server import MCPServer
from app.models.schemas import KYCAgentAnalysisOutput

class KYCAgentError(Exception):
    pass

class KYCAgent:
    """
    Agentic reasoning worker evaluating corporate cases via AI Gateway and MCP tools.
    """
    def __init__(self, ai_gateway: AIGateway, mcp_server: MCPServer, audit_log: Optional[Any] = None):
        self.ai_gateway = ai_gateway
        self.mcp_server = mcp_server
        self.audit_log = audit_log

    def evaluate_case(self, case_id: str, prompt_context: str, simulate_invalid: bool = False) -> KYCAgentAnalysisOutput:
        """
        Executes model reasoning through AI Gateway with strict JSON schema validation.
        """
        try:
            analysis: KYCAgentAnalysisOutput = self.ai_gateway.execute_inference(
                prompt=f"Case ID: {case_id}\nContext: {prompt_context}",
                expected_schema=KYCAgentAnalysisOutput,
                simulated_invalid_payload=simulate_invalid
            )
            return analysis
        except Exception as e:
            if self.audit_log:
                self.audit_log.record_event(
                    case_id=case_id,
                    actor="KYC_AGENT",
                    category="GATEWAY_ERROR",
                    description=f"AI Gateway call failed: {str(e)}",
                    source_reference="AI_GATEWAY"
                )
            raise KYCAgentError(f"AI Gateway call failed: {str(e)}") from e

    def analyze_case(
        self,
        case_id: str,
        declared_entity: Dict[str, Any],
        ubo_results: List[Any],
        registry_data: List[Any],
        deficiencies: List[Any],
        simulate_invalid: bool = False
    ) -> KYCAgentAnalysisOutput:
        """
        Runs comprehensive analysis combining case facts and invoking AI Gateway.
        """
        context = (
            f"Entity: {declared_entity}\n"
            f"UBOs: {ubo_results}\n"
            f"Registry: {registry_data}\n"
            f"Deficiencies: {deficiencies}"
        )
        return self.evaluate_case(case_id, context, simulate_invalid=simulate_invalid)
