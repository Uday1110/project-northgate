# Project Northgate: Scope Decisions & Architectural Alignment

> [!IMPORTANT]
> The decisions below represent provisional defaults pending final formal compliance approval. Gaps 1 to 9 are provisionally decided to unblock implementation. Per the AGENTS.md precedence hierarchy, docs/decisions.md takes precedence over docs/jtbd-spec.md and docs/architecture.md.

### Conflict Notes
- **Gap 1 Conflict with docs/jtbd-spec.md:** docs/jtbd-spec.md Section 2.2 lists biometric liveness checks as out-of-scope for corporate entity onboarding. Per Gap 1 provisional decision and precedence rules, liveness checks are in-scope for natural person Qualified UBOs ($\ge 25\%$) and Authorized Signatories, implemented as a stub adapter behind the Identity service interface with no raw biometric retention.

---

| Gap # | Topic | Decision | Decided by | Date | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | Biometric Liveness Check | Apply liveness checks to Qualified UBOs (25% or more) and Authorized Signatories. Implement as a stub adapter behind the Identity service interface. Store only the case ID, individual ID, timestamp, and verdict. Store no raw biometric data. *(PROVISIONAL-GAP-1)* | Pending | Pending | Provisional, pending approval |
| 2 | AI Gateway and Model Use | The KYC agent calls models only through an AI gateway module. Use a stub model client. Every output must pass JSON schema validation. Invalid output is rejected and flagged for analyst review. Model output never sets UBO percentages. *(PROVISIONAL-GAP-2)* | Pending | Pending | Provisional, pending approval |
| 3 | MCP Server Tooling Protocol | Build an MCP server exposing four gated tools: Identity service, Case system, Notifications, and Public registries (resolving Gap 4). The Orchestrator and KYC agent reach external systems only through it. *(PROVISIONAL-GAP-3)* | Pending | Pending | Provisional, pending approval |
| 4 | Registry Access & OCR Module | Public registries is a fourth gated MCP tool covering UK Companies House, GLEIF, and OpenCorporates. The OCR engine is an internal module outside the MCP server, documented as an architectural exception in AGENTS.md. *(PROVISIONAL-GAP-4)* | Pending | Pending | Provisional, pending approval |
| 5 | Liveness Evidence Linkage | Liveness verdicts link to the case record by case ID, individual ID, timestamp, and verdict. This is an explicit exception to the PDF bounding-box rule in AGENTS.md. *(PROVISIONAL-GAP-5)* | Pending | Pending | Provisional, pending approval |
| 6 | Liveness Re-take Notifications | Re-take messages are approved templates that bypass the approval gate only when they contain no case-specific risk content. Anything else is gated. *(PROVISIONAL-GAP-6)* | Pending | Pending | Provisional, pending approval |
| 7 | Individual UBO Invitation Channel | Out of pilot scope. Do not build it. Record it as deferred to future phases. *(PROVISIONAL-GAP-7)* | Pending | Pending | Provisional, pending approval |
| 8 | Biometric Data Governance | No retention of biometric data. Retention periods are a compliance decision, so leave a TODO and do not set a value. *(PROVISIONAL-GAP-8)* | Pending | Pending | Provisional, pending approval |
| 9 | Model Output Validation | Strict JSON schema validation on all LLM output prior to state transitions. Invalid output is rejected and flagged for analyst review. *(PROVISIONAL-GAP-9)* | Pending | Pending | Provisional, pending approval |
