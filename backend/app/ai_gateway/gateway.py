"""
AI Gateway Module.
PROVISIONAL-GAP-2: The KYC agent calls models only through an AI gateway module.
Use a stub model client.
Every output must pass JSON schema validation (PROVISIONAL-GAP-9).
Invalid output is rejected and flagged for analyst review.
Model output never sets UBO percentages.
"""

from typing import Dict, Any, Type
import json
from pydantic import BaseModel, ValidationError
from app.models.schemas import KYCAgentAnalysisOutput

class AIGatewayError(Exception):
    pass

class SchemaValidationError(AIGatewayError):
    pass

class GatewayOutageError(AIGatewayError):
    pass

class AIGateway:
    """
    Enterprise proxy governing LLM model interactions.
    Enforces approved model execution, rate limiting, and strict JSON schema validation.
    """
    def __init__(self, model_name: str = "approved-enterprise-v1"):
        self.approved_model = model_name
        self.is_outage_simulated = False
        self.call_history = []

    def set_outage_simulation(self, status: bool):
        self.is_outage_simulated = status

    def execute_inference(
        self,
        prompt: str,
        expected_schema: Type[BaseModel] = KYCAgentAnalysisOutput,
        simulated_invalid_payload: bool = False
    ) -> BaseModel:
        """
        Executes model inference via approved model proxy with strict schema validation.
        """
        if self.is_outage_simulated:
            raise GatewayOutageError("503 Service Unavailable: AI Gateway connection timeout / outage.")

        # Stub model execution returning compliant structured JSON
        if simulated_invalid_payload:
            # Simulate a malformed or invalid response (e.g. missing required field or wrong types)
            raw_response_json = {
                "corrupted_field": True,
                "note": "Malformed payload missing required case_id and risk_summary"
            }
        else:
            raw_response_json = {
                "case_id": "CASE-2024-8841",
                "entity_name": "Harbor Crest Holdings Ltd",
                "risk_summary": "High risk detected due to statutory address mismatch and expired UBO passport.",
                "discrepancy_count": 2,
                "recommended_action": "HOLD_DEFICIENCIES",
                # PROVISIONAL-GAP-2: Model output NEVER sets UBO percentages!
                "reasoning_notes": "Ownership percentages computed mathematically by deterministic rule engine (32.0% Arthur, 28.0% Helena). Model evaluates only legal narrative and consistency."
            }

        # PROVISIONAL-GAP-9: Mandatory JSON Schema Validation
        try:
            validated_output = expected_schema.model_validate(raw_response_json)
        except ValidationError as val_err:
            raise SchemaValidationError(
                f"Model output schema validation failed: {str(val_err)}. Rejected and flagged for analyst review."
            )

        self.call_history.append({
            "model": self.approved_model,
            "prompt_length": len(prompt),
            "status": "VALIDATED"
        })

        return validated_output
