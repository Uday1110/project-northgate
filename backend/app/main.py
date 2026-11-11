"""
FastAPI Backend Application for Project Northgate.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

from app.mcp.server import MCPServer
from app.ocr.leptos_ocr import LeptosOCREngine
from app.ai_gateway.gateway import AIGateway
from app.audit.audit_log import AuditLog, AuditValidationError
from app.orchestrator.clock import SLAClock
from app.orchestrator.approval_gate import ApprovalGate
from app.orchestrator.kill_switch import FallbackKillSwitch, KillSwitchTrippedError
from app.orchestrator.pipeline import OrchestratorPipeline

app = FastAPI(
    title="Project Northgate Compliance Engine",
    version="1.0.0",
    description="Automated Institutional KYC/AML and Beneficial Ownership Verification API"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singleton state instances
mcp_server = MCPServer()
ocr_engine = LeptosOCREngine()
ai_gateway = AIGateway()
audit_log = AuditLog()
sla_clock = SLAClock()
approval_gate = ApprovalGate()
kill_switch = FallbackKillSwitch()

pipeline = OrchestratorPipeline(
    mcp_server=mcp_server,
    ocr_engine=ocr_engine,
    ai_gateway=ai_gateway,
    audit_log=audit_log,
    sla_clock=sla_clock,
    approval_gate=approval_gate,
    kill_switch=kill_switch
)

class PipelineRunRequest(BaseModel):
    case_id: str = "CASE-2024-8841"
    bundle_name: str = "Harbor_Crest_Dossier_Bundle.zip"
    crn: str = "08921471"
    declared_address: str = "Suite 401, 25 Finsbury Circus, London EC2M 7EE, United Kingdom"

class KillSwitchRequest(BaseModel):
    case_id: Optional[str] = None
    reason: str = "MANUAL_ANALYST_ABORT"

class ApprovalRequest(BaseModel):
    message_id: str
    analyst_id: str
    justification: str

class NotificationDispatchRequest(BaseModel):
    case_id: str
    recipient: str
    template_id: str
    message_id: str
    contains_case_specific_risk: bool = False

class OverrideRequest(BaseModel):
    case_id: str
    actor: str
    target_node: str
    reason: str  # Mandatory

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Project Northgate Backend API",
        "mcp_tools": mcp_server.list_tools(),
        "kill_switch_active": kill_switch.is_global_kill_switch_active
    }

@app.post("/api/pipeline/run")
def run_pipeline(req: PipelineRunRequest):
    try:
        result = pipeline.run_full_pipeline(
            case_id=req.case_id,
            bundle_name=req.bundle_name,
            crn=req.crn,
            declared_address=req.declared_address
        )
        return result
    except KillSwitchTrippedError as kse:
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail=str(kse))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post("/api/kill-switch/engage")
def engage_kill_switch(req: KillSwitchRequest):
    if req.case_id:
        kill_switch.engage_case_kill_switch(req.case_id, req.reason)
        audit_log.record_event(
            case_id=req.case_id,
            actor="SYSTEM/ANALYST",
            category="KILL_SWITCH",
            description=f"Fallback kill switch engaged for case {req.case_id}: {req.reason}",
            source_reference="KillSwitchService"
        )
        return {"status": "ENGAGED", "scope": f"CASE:{req.case_id}", "reason": req.reason}
    else:
        kill_switch.engage_global_kill_switch(req.reason)
        audit_log.record_event(
            case_id="GLOBAL",
            actor="SYSTEM",
            category="KILL_SWITCH",
            description=f"Global fallback kill switch engaged: {req.reason}",
            source_reference="KillSwitchService"
        )
        return {"status": "ENGAGED", "scope": "GLOBAL", "reason": req.reason}

@app.post("/api/kill-switch/disengage")
def disengage_kill_switch(req: KillSwitchRequest):
    if req.case_id:
        kill_switch.disengage_case(req.case_id)
        return {"status": "DISENGAGED", "scope": f"CASE:{req.case_id}"}
    else:
        kill_switch.disengage_global()
        return {"status": "DISENGAGED", "scope": "GLOBAL"}

@app.post("/api/approval-gate/approve")
def approve_dispatch(req: ApprovalRequest):
    record = approval_gate.approve_dispatch(
        message_id=req.message_id,
        analyst_id=req.analyst_id,
        justification=req.justification
    )
    audit_log.record_event(
        case_id="APPROVAL-GATE",
        actor=req.analyst_id,
        category="APPROVAL",
        description=f"Analyst sign-off granted for message {req.message_id}",
        source_reference=f"Message-{req.message_id}",
        reason=req.justification
    )
    return {"status": "APPROVED", "record": record}

@app.post("/api/notifications/dispatch")
def dispatch_notification(req: NotificationDispatchRequest):
    # Verify through approval gate
    can_dispatch = approval_gate.check_can_dispatch(
        template_id=req.template_id,
        message_id=req.message_id,
        contains_case_specific_risk=req.contains_case_specific_risk
    )

    if not can_dispatch:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Approval Gate Block: Message {req.message_id} requires explicit human analyst approval before dispatch."
        )

    approval_rec = approval_gate.approved_records.get(req.message_id)

    try:
        sent_record = mcp_server.call_tool(
            "notifications",
            "send_notification",
            case_id=req.case_id,
            recipient=req.recipient,
            template_id=req.template_id,
            contains_case_specific_risk=req.contains_case_specific_risk,
            approval_record=approval_rec
        )
        return {"status": "SENT", "notification": sent_record}
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))

@app.post("/api/analyst/override")
def record_analyst_override(req: OverrideRequest):
    try:
        entry = audit_log.record_event(
            case_id=req.case_id,
            actor=req.actor,
            category="ANALYST_OVERRIDE",
            description=f"Manual override applied to node {req.target_node}",
            source_reference=f"TargetNode-{req.target_node}",
            reason=req.reason
        )
        return {"status": "OVERRIDE_RECORDED", "entry": entry.model_dump()}
    except AuditValidationError as ave:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(ave))

@app.get("/api/audit/verify-hashes")
def verify_audit_hashes():
    is_valid = audit_log.verify_chain_integrity()
    return {
        "is_valid": is_valid,
        "total_records": len(audit_log.entries),
        "merkle_root_hash": audit_log.last_hash
    }
