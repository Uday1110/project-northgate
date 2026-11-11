# Project Northgate: Jobs-to-be-Done (JTBD) Product Specification

**Document Version:** 1.1.0 (Reconciled & Aligned Architecture)  
**Classification:** Institutional Commercial Banking & Corporate Compliance  
**Compliance Standard:** FATF Recommendation 10, EU 5AMLD / 6AMLD, FCA MLR 2017, UK Companies Act 2006, SEC Rule 17a-4 / FINRA  
**Security Baseline:** FedRAMP High Enclave  

---

## 1. Executive Summary & Vision

Project Northgate is an institutional-grade, automated Know Your Customer (KYC), Anti-Money Laundering (AML), and Corporate Entity Onboarding platform. It is engineered to transform corporate customer onboarding from a multi-week, manual, error-prone clerical exercise into an automated, verifiable, and regulator-audited workflow completed in under 24 hours (with automated document extraction and cross-verification targeted under 90 seconds).

The system automates the ingestion of corporate formation dossiers, cross-reconciles declared entity records against statutory company registries (e.g., UK Companies House, OpenCorporates, GLEIF), mathematically reconstructs complex multi-tiered cap tables to identify Ultimate Beneficial Owners (UBOs $\ge 25\%$), validates natural person UBO credentials with biometric liveness checks, identifies evidentiary discrepancies, generates remediation punch lists, and enforces strict human-in-the-loop analyst review and dual-approval (4-eye) gates prior to account activation.

---

## 2. Scope

### 2.1 In-Scope (Pilot Scope)
1. **Dossier & Document Ingestion:** Dual-channel ingestion of corporate onboarding packets in PDF, ZIP, and TIFF formats (up to 500MB):
   - Direct self-service digital submission by the commercial Applicant.
   - Assisted package deposit by the internal Relationship Manager (RM).
   - Ingests Certificates of Incorporation, Articles of Association, Registers of Members, Registers of Directors, Proof of Registered Address (e.g., utility bills, statutory resolutions), and government-issued photo IDs (passports, national IDs).
2. **Automated Document Extraction & OCR:** High-precision OCR extraction (Leptos OCR engine) capturing structured corporate entities, individual officers, equity allocations, document expiry dates, and registration numbers with coordinate-level evidentiary bounding box overlays.
3. **Statutory Registry Cross-Verification:** Real-time synchronization and reconciliation against official company registers (UK Companies House REST API v3, OpenCorporates, and GLEIF LEI resolver) mediated via the Model Context Protocol (MCP) Identity Service.
4. **Discrepancy Identification:** Automated field-level reconciliation between declared onboarding data and public statutory records (registered office address, legal entity name, corporate registration number, active filing status, director rosters).
5. **Multi-Tier UBO & Cap Table Resolution:** Algorithmic calculation of direct and indirect shareholdings across multi-jurisdictional holding chains applying the FATF / 5AMLD beneficial ownership threshold ($\ge 25.0\%$).
6. **Individual UBO & Director Liveness Verification:** Automated verification of identity documents for natural persons identified as Qualified UBOs ($\ge 25\%$) or Authorized Signatories, including biometric liveness checks (facial liveness and anti-spoofing) mediated through the MCP Identity Service returning verdicts only.
7. **Deficiency Punch List & Remediation Triage:** Automated compilation of an actionable discrepancy ledger categorizing issues into Critical Blockers (halting activation) and Standard Warnings (remediation within 5-day window), with pre-formatted outreach generation for Relationship Managers and Applicants.
8. **Human-in-the-Loop Analyst Workbench:** Interactive operational console enabling KYC analysts to inspect source documents, confirm or reject discrepancy findings, apply regulatory overrides with mandatory justification, and execute final onboarding decisions.
9. **Governed AI Gateway & Agentic Reasoning:** Mediation of all KYC Agent inference and complex reasoning calls exclusively through an enterprise AI Gateway restricted to approved models with strict prompt governance and audit capture.
10. **Immutable Audit Lineage:** Complete, cryptographically chained audit logging (SHA-256 Merkle chain) capturing every extraction, model prompt/completion, API response, rule evaluation, and analyst override in compliance with SEC Rule 17a-4 and FINRA WORM storage standards.

### 2.2 Out-of-Scope (Pilot Scope)
1. **Unmediated Direct Client Communications:** Fully autonomous, unreviewed email or messaging dispatch directly to external corporate executives without internal Relationship Manager / Analyst approval at the Orchestrator Approval Gate.
2. **Continuous Post-Onboarding Transaction Monitoring:** Real-time transaction filtering, AML transaction anomaly detection, and ongoing payment screening post-account opening (handled by downstream transaction monitoring enclaves).
3. **Automated Tax Information Exchange (FATCA / CRS):** Direct automated filings to tax authorities or foreign revenue agencies.
4. **Direct External Model / LLM Execution:** Unrestricted or client-facing generative AI endpoints without mediation through the approved AI Gateway.

---

## 3. Actors & User Personas

| Actor | Role Type | Description & Responsibilities |
| :--- | :--- | :--- |
| **Applicant / Corporate Representative** | External Commercial Entity | Authorized signatory or corporate officer of the entity seeking an institutional account. Submits onboarding packages, corporate formation papers, and individual UBO identity/liveness records directly via the applicant intake interface. |
| **Relationship Manager (RM)** | Internal Front Office | Commercial banking representative (e.g., Sarah Lin) managing the client relationship. Deposits assisted onboarding packages, tracks deficiency remediations, and coordinates with applicants for clarification. |
| **KYC Senior Analyst** | Internal Compliance Operations | Principal operational user (e.g., Marcus Vance). Evaluates extracted dossiers, validates registry discrepancies, reviews cap table ownership trees, evaluates liveness verdicts, records manual overrides with regulatory justifications, and makes final approval decisions. |
| **Compliance Supervisor / VP Approver** | Internal Compliance Authority | Senior compliance officer required for secondary sign-off (4-eye check) on high-risk files, regulatory exemptions, PEP flags, and manual overrides on beneficial ownership thresholds. |
| **System Orchestrator** | Automated Backend Service | Central workflow coordinator managing lifecycle state, tracking the 24-hour SLA clock, enforcing the outbound Approval Gate, and operating the Fallback Kill Switch. |
| **KYC Agent** | Autonomous Analytical Worker | Domain-specialized agent executing reasoning tasks, querying MCP tools (Identity service, Case system), and calling the AI Gateway to synthesize compliance verdicts. |

---

## 4. Jobs-to-be-Done (JTBD) Framework

### Core Job Statement
> **When** an institutional commercial client applies for corporate banking onboarding,  
> **I want to** automatically extract formation data, reconcile corporate structures against official company registries, verify beneficial owner identities and liveness, and compute beneficial ownership,  
> **So that** I can accurately identify compliance risks, resolve evidentiary discrepancies, and reach a defensible onboarding decision within 24 hours without manual clerical overhead.

---

### JTBD 1: Ingestion & Document Processing
* **Job Summary:** Ingest corporate dossier packages from both direct and RM channels, and extract evidentiary data with spatial traceability.
* **Functional Requirements:**
  1. Ingest multi-file bundles up to 500MB (PDF/A, PDF, ZIP, TIFF) via direct Applicant upload or RM assisted intake.
  2. Perform OCR parsing to identify legal entities, officers, share allocations, and validity periods.
  3. Maintain bounding-box coordinate mappings `[x, y, w, h]` for every extracted entity linked to the source page and document SHA-256 hash.
  4. Complete extraction and initial parsing in $\le 90$ seconds.

### JTBD 2: Statutory Registry Cross-Verification
* **Job Summary:** Verify declared onboarding details against authoritative public company registers via the MCP Identity Service.
* **Functional Requirements:**
  1. Query public registries (UK Companies House API v3, OpenCorporates, GLEIF) through the MCP Identity Service tool.
  2. Reconcile primary fields: Legal Entity Name, Company Registration Number (CRN), Active Corporate Status, Incorporation Date, and Registered Office Address.
  3. Classify comparison results into:
     - **Verified / Clear Match:** Identical data strings.
     - **Warning / Review Required:** Minor formatting or pending corporate filing differences.
     - **Critical Discrepancy / Mismatch:** Material contradictions (e.g., statutory registered office address mismatch, such as Cannon St vs Finsbury Circus).

### JTBD 3: Beneficial Ownership & Cap Table Resolution
* **Job Summary:** Unravel multi-tier legal structures to compute effective equity and identify Ultimate Beneficial Owners.
* **Functional Requirements:**
  1. Model multi-tier ownership hierarchies across parent entities, holding companies, operating companies, and nominee arrangements.
  2. Implement the mathematical formula for effective ownership:
     $$\text{Effective Ownership \%} = \prod_{i=1}^{n} \text{Tier Direct Ownership \%}_i$$
  3. Apply the regulatory threshold ($\ge 25.0\%$) to automatically classify natural persons as Qualified UBOs.
  4. Flag entities or individuals holding $\ge 25\%$ voting rights, direct equity, or indirect dominant influence per FATF Rec 10 / 5AMLD Art 3(6)(a)(i).
  5. Validate that total direct equity of any entity node equals exactly $100.0\%$; flag cap table anomalies if sum $\ne 100\%$.

### JTBD 4: Individual UBO Identity & Biometric Liveness Verification
* **Job Summary:** Validate individual identity documents and execute liveness checks on Qualified UBOs and Directors.
* **Functional Requirements:**
  1. Check document expiration dates against current system timestamp; flag expired IDs as Critical Blockers.
  2. Execute biometric liveness and anti-spoofing verification on natural person UBOs via the MCP Identity Service.
  3. Enforce the verdict-only rule: the Identity Service must return only normalized verdicts (`PASS`, `FAIL: LIVENESS_CHECK_FAILED`, `SUSPECTED_SPOOF`), never raw biometric telemetry.
  4. Flag any failed liveness check as a Critical Blocker, prohibiting activation pending human analyst remediation.

### JTBD 5: Deficiency Punch List & Remediation
* **Job Summary:** Triage compliance defects and generate structured remediation actions.
* **Functional Requirements:**
  1. Consolidate all registry discrepancies, expired documents, missing filings, and failed liveness checks into a centralized Deficiency Punch List in the Case System.
  2. Assign severity levels:
     - **Critical Blocker:** Prohibits account activation and locks the onboarding pipeline gate.
     - **Standard Warning:** Allows provisional processing with required remediation within 5 business days.
  3. Generate actionable outreach packages detailing specific regulatory citations (e.g., FCA MLR 2017 / 5AMLD Art 13(1)(a)) and required forms (e.g., Companies House Form AD01).

### JTBD 6: Analyst Review, Overrides & Approval Gate
* **Job Summary:** Enable compliance analysts to review automated findings, apply reasoned overrides, and execute onboarding decisions.
* **Functional Requirements:**
  1. Provide a unified workbench displaying side-by-side document bounding boxes, registry extracts, and cap table trees.
  2. Support manual analyst overrides (e.g., classifying a below-threshold shareholder as Non-UBO after sanctions clearance, or granting a documented exemption).
  3. Enforce mandatory regulatory justification text for any analyst override.
  4. Require secondary compliance supervisor approval (4-eye principle) for critical overrides or exemptions.
  5. Enforce the Orchestrator Approval Gate: prevent any final onboarding approval or outbound notification dispatch without explicit analyst authorization.

### JTBD 7: Cryptographic Compliance Audit Trail
* **Job Summary:** Maintain an indelible, regulatory-compliant audit log of all system and human events.
* **Functional Requirements:**
  1. Log all system extractions, AI Gateway model requests/responses, MCP tool calls, rule evaluations, analyst overrides, and approval verdicts.
  2. Record events chronologically with microsecond UTC timestamps, actor/engine IDs, and source document hashes.
  3. Chain all log events into a cryptographically verifiable SHA-256 Merkle chain.
  4. Store audit records in SEC Rule 17a-4 and FINRA compliant Write-Once-Read-Many (WORM) storage.
  5. Provide export capabilities in structured formats (JSON, CSV, PDF) for regulatory examiners.

---

## 5. Acceptance Criteria (Given / When / Then)

### Scenario 1: Corporate Dossier Ingestion & Parsing
* **Given** a valid corporate onboarding bundle (PDF/ZIP up to 500MB) is submitted by an Applicant or Relationship Manager,
* **When** the System Orchestrator dispatches the intake extraction workers,
* **Then** the system extracts all corporate entities, officers, and shareholders with OCR bounding boxes in $\le 90$ seconds,
* **And** sets the case status to `Ready for Review` with all source documents hashed using SHA-256.

### Scenario 2: Public Registry Discrepancy Detection
* **Given** an ingested onboarding dossier declaring a registered address (e.g., Suite 401, 25 Finsbury Circus),
* **When** the Registry Lookup worker queries the official company registry via the MCP Identity Service and retrieves the statutory address (e.g., 128 Cannon Street),
* **Then** the system detects the address mismatch, flags it as a `Critical Discrepancy` citing FCA MLR 2017 / 5AMLD Art 13(1)(a),
* **And** automatically adds a `Critical Blocker` item to the Deficiency Punch List in the Case System.

### Scenario 3: Beneficial Ownership (UBO) Multi-Tier Calculation
* **Given** an operating entity owned 60% by an intermediate holding company (e.g., Atlantic Horizon Capital Ltd),
* **And** the intermediate holding company is owned 53.33% by Individual A and 46.67% by Individual B,
* **When** the Ownership Reconciliation engine computes effective equity,
* **Then** Individual A is assigned an effective ownership of $32.00\%$ ($60\% \times 53.33\%$) and flagged as `Qualified UBO (\ge 25\%)`,
* **And** Individual B is assigned an effective ownership of $28.00\%$ ($60\% \times 46.67\%$) and flagged as `Qualified UBO (\ge 25\%)`,
* **And** both nodes display tabular calculation formulas and visual hierarchy links.

### Scenario 4: UBO Biometric Liveness Check Failure
* **Given** a Qualified UBO identified with $\ge 25\%$ effective ownership submitting biometric credentials,
* **When** the Identity Service evaluates the biometric capture and detects a liveness mismatch or spoof attempt,
* **Then** the Identity Service returns `FAIL: LIVENESS_CHECK_FAILED` to the KYC Agent via the MCP Server,
* **And** the Orchestrator transitions the case state to `BLOCKED_PENDING_REMEDIATION`,
* **And** the Approval Gate halts automated notification dispatch until an Analyst reviews and authorizes a re-take request.

### Scenario 5: Analyst Override with Mandatory Justification
* **Given** an unverified shareholder or potential UBO requiring manual adjustment,
* **When** a KYC Analyst applies a manual override (e.g., Tier 1 Exemption or reclassification),
* **Then** the system prompts for a mandatory regulatory justification text,
* **And** records the analyst ID, timestamp, prior state, new state, and justification in the Merkle audit chain,
* **And** routes the override for VP/Supervisor sign-off if required by policy.

### Scenario 6: Approval Gate Enforcing Blockers & Outbound Dispatch
* **Given** an onboarding case with one or more unresolved Critical Blockers or an unapproved notification,
* **When** an automated agent or user attempts to activate the account or dispatch an external notice,
* **Then** the Approval Gate rejects the action,
* **And** displays an explicit validation message prohibiting approval until all critical deficiencies are remedied and the analyst signs off.

### Scenario 7: Fallback Kill Switch Triggered by AI Gateway Outage
* **Given** an active onboarding case requiring agentic analysis,
* **When** the AI Gateway becomes unreachable or returns persistent 5xx errors,
* **Then** the Orchestrator trips the Fallback Kill Switch,
* **And** halts automated agent processing, freezes the case in `MANUAL_REVIEW_FALLBACK`,
* **And** alerts compliance analysts while keeping the 24-hour clock running.

### Scenario 8: Audit Trail Merkle Chain Integrity
* **Given** a series of extraction, verification, override, tool call, and triage events,
* **When** an auditor or system triggers `Verify Hashes`,
* **Then** the system verifies the SHA-256 Merkle chain from Session Genesis to the latest event sequence,
* **And** returns a $100\%$ valid cryptographic verification with zero orphaned entities.

---

## 6. Guardrails & Compliance Constraints

1. **24-Hour Turnaround SLA Clock:**
   - The Orchestrator's internal 24-hour clock tracks the end-to-end onboarding lifecycle from initial submission to final disposition.
   - Initial automated intake, OCR extraction, and registry reconciliation must execute within 90 seconds.
   - Active queue triage cycle time target is $< 5$ minutes per case.
   - Automated alerts trigger at T+12h, T+18h, and T+22h as cases approach SLA breach.
2. **Deterministic Human-in-the-Loop Approval:**
   - No automated agent or background worker may independently grant final KYC clearance, activate a customer account, or disburse account credentials.
   - Outbound notifications involving deficiency demands or statutory filings must pass through the Orchestrator Approval Gate.
3. **Approved AI Gateway & Model Governance:**
   - All model interactions must route strictly through the AI Gateway using pre-approved, enterprise-whitelisted models.
   - Direct external LLM endpoint connections are strictly blocked by network security policy.
4. **Standardized MCP Tool Gating:**
   - External systems (Identity service, Case system, Notifications) are accessible strictly through the MCP Server.
   - The Identity Service returns verdicts only; raw biometric features are never stored in the application database.
   - Notifications use approved regulatory templates only.
5. **Fallback Kill Switch Circuit Breaker:**
   - In the event of an AI Gateway outage, tool failure, or anomalous agent behavior, the Orchestrator's Fallback Kill Switch immediately engages to safely pause automation and divert cases to manual analyst workflows.
6. **Strict Beneficial Ownership Threshold ($\ge 25.0\%$):**
   - In alignment with FATF and EU 5AMLD regulations, any natural person holding $\ge 25.0\%$ direct or indirect effective equity/voting interest must be identified, screened, and verified.
   - Any departure or exemption requires explicit analyst override with recorded legal rationale and supervisor concurrence.
7. **Data Isolation & FedRAMP High Compliance:**
   - All customer documents, identity data, and corporate registries must be processed within a FedRAMP High compliant sovereign enclave.
   - Raw identity documents must be encrypted at rest (AES-256) and in transit (TLS 1.3), with access restricted by least-privilege role-based access control (RBAC).
8. **WORM Storage Immutability (SEC 17a-4 / FINRA):**
   - The compliance audit log must be written to Write-Once-Read-Many (WORM) storage.
   - Audit entries cannot be modified, deleted, or retroactively re-ordered by any system administrator or analyst.
