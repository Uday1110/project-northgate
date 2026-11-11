"""
Pydantic schemas and domain models for Project Northgate.
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class LegalEntity(BaseModel):
    id: str
    name: str
    crn: Optional[str] = None
    lei: Optional[str] = None
    jurisdiction: str
    entity_type: str = "Private Ltd"

class NaturalPerson(BaseModel):
    id: str
    name: str
    citizenship: str
    role: str
    passport_number: Optional[str] = None
    passport_expiry: Optional[str] = None
    is_expired: bool = False

class OwnershipPath(BaseModel):
    source_entity_id: str
    target_node_id: str
    direct_percentage: float
    tier: int

# PROVISIONAL-GAP-1: Qualified UBO definition (>= 25.0%)
class UBOResult(BaseModel):
    node_id: str
    name: str
    role: str
    citizenship: str
    effective_percentage: float
    is_ubo: bool  # True if effective_percentage >= 25.0
    threshold_status: Literal["QUALIFIED_UBO", "NON_UBO_MINORITY"]
    path_summary: str
    # PROVISIONAL-GAP-1 & PROVISIONAL-GAP-5: Liveness verdict metadata
    liveness_status: Optional[Literal["PASS", "FAIL", "EXPIRED_CREDENTIAL", "PENDING", "NOT_REQUIRED"]] = None
    liveness_verification_id: Optional[str] = None

class RegistryFieldRecord(BaseModel):
    field_name: str
    field_code: str
    declared_value: str
    registry_value: str
    source: str
    is_fixture: bool = True  # Labeled as fixtures per prompt rule
    status: Literal["PERFECT_MATCH", "WARNING", "CRITICAL_MISMATCH"]
    regulatory_reference: Optional[str] = None
    remediation_action: Optional[str] = None

class Deficiency(BaseModel):
    id: str
    severity: Literal["CRITICAL_BLOCKER", "STANDARD_WARNING"]
    title: str = Field(..., alias="title")
    description: str
    target_entity_or_person: str
    regulatory_reference: str
    status: Literal["PENDING_RM_SUBMISSION", "UNDER_REVIEW", "RESOLVED"] = "PENDING_RM_SUBMISSION"
    age_days: int = 0
    action_required: str

class OutboundNotification(BaseModel):
    id: str
    case_id: str
    recipient: str
    template_id: str
    content: str
    is_retake_template: bool = False
    contains_case_specific_risk: bool = False
    is_approved: bool = False
    approved_by: Optional[str] = None
    status: Literal["PENDING_APPROVAL", "DISPATCHED", "BLOCKED"] = "PENDING_APPROVAL"

class AuditLogEntry(BaseModel):
    seq: int
    timestamp: str
    case_id: str
    actor: str
    category: str
    description: str
    source_reference: str
    reason: Optional[str] = None  # Mandatory for analyst overrides
    hash: str
    previous_hash: Optional[str] = None

# PROVISIONAL-GAP-9: LLM Output Schema for KYC Agent
class KYCAgentAnalysisOutput(BaseModel):
    case_id: str
    entity_name: str
    risk_summary: str
    discrepancy_count: int
    recommended_action: Literal["PROCEED_TO_ANALYST", "HOLD_DEFICIENCIES", "ESCALATE_SUPERVISOR"]
    # Model output NEVER sets UBO percentages (PROVISIONAL-GAP-2)
    reasoning_notes: str
