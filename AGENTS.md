# AGENTS.md — Engineering & Operational Guide

## Project Purpose
Project Northgate is an institutional-grade, automated Know Your Customer (KYC), Anti-Money Laundering (AML), and corporate onboarding verification platform designed to accelerate corporate client onboarding from weeks into a compliant, defensible, and audited workflow completed within 24 hours. The platform automates the ingestion of corporate formation dossiers, extracts evidentiary fields with spatial coordinate bounding boxes, cross-reconciles declared company data against authoritative public registries (e.g., UK Companies House, OpenCorporates, GLEIF), mathematically resolves multi-tier beneficial ownership hierarchies against statutory UBO thresholds ($\ge 25\%$), identifies evidentiary discrepancies, and generates actionable deficiency punch lists, all while enforcing strict human-in-the-loop analyst review and dual-approval (4-eye) gates prior to account activation.

## Source of Truth
- `docs/jtbd-spec.md` for scope and acceptance criteria.
- `docs/architecture.md` for components and rules.
- `docs/decisions.md` for scope decisions.
- `designs/stitch/` for screens and UI layouts.

**Precedence Hierarchy:** If these sources disagree, `docs/decisions.md` wins, followed by `docs/jtbd-spec.md`, and then `docs/architecture.md`.

## Stack
- **Frontend:** React with TypeScript.
- **Backend:** Python FastAPI.
- **Dependency Rule:** Do not add dependencies without asking first.

## Spec Guardrails
- **No direct write access to the legacy ledger:** The system operates purely in a non-invasive read/staging posture with respect to core banking ledgers.
- **Spatial evidentiary linking:** Every extracted field must link directly to a source bounding box in the evidentiary PDF.
  - *Exception (PROVISIONAL-GAP-5):* Biometric liveness check verdicts link to the case record via case ID, individual ID, timestamp, and verdict hash rather than a PDF bounding box.
- **Written justification for overrides:** Analyst overrides require a mandatory written regulatory justification.
- **Sidecar architecture:** The tool functions as a non-invasive ingestion sidecar to existing enterprise systems.

## Diagram Guardrails
- **Approval gate enforcement:** No outbound message may be dispatched without explicit human analyst approval.
  - *Exception (PROVISIONAL-GAP-6):* Standardized biometric re-take prompts using approved templates bypass the approval gate only when they contain no case-specific risk content.
- **Comprehensive audit capture:** All events, state changes, model invocations, and tool executions must go to the immutable audit log.
- **AI gateway restriction:** Model calls must go strictly and exclusively through the approved AI gateway.
- **MCP server mediation:** External systems must be reached solely through the gated Model Context Protocol (MCP) server, which exposes four gated tools: Identity service, Case system, Notifications, and Public registries (PROVISIONAL-GAP-3, PROVISIONAL-GAP-4).
  - *Exception (PROVISIONAL-GAP-4):* The OCR extraction engine is an internal processing module outside the MCP server.

## Working Rules
1. **Plan first:** Always list your implementation plan before writing any code.
2. **Comprehensive testing:** Write unit and integration tests for every workflow.
3. **No synthetic hallucination:** Never invent registry data or personal data.
4. **Fictional sample data:** Use only fictional sample data (primary reference client: `Harbor Crest Holdings Ltd`).
5. **No guessing:** Flag any ambiguity or uncertainty instead of making assumptions.
6. **Decision dependency:** Do not start a phase unless `docs/decisions.md` is filled in and agreed upon for the gaps that phase depends on.
