# Project Northgate — Institutional KYC/AML Automation Platform

Project Northgate is an institutional-grade Know Your Customer (KYC), Anti-Money Laundering (AML), and corporate onboarding verification platform designed to accelerate corporate client onboarding from weeks into a compliant, defensible, and audited workflow completed within 24 hours.

The platform operates as a non-invasive read/staging ingestion sidecar, extracting evidentiary fields with spatial coordinate bounding boxes, cross-reconciling declared company data against authoritative public registries, mathematically resolving multi-tier beneficial ownership hierarchies ($\ge 25\%$ statutory UBO thresholds), generating actionable deficiency punch lists, and enforcing strict human-in-the-loop analyst review and dual-approval (4-eye) gates prior to account activation.

---

## Architecture & Governance Sources of Truth

- **Scope & Acceptance Criteria:** [`docs/jtbd-spec.md`](docs/jtbd-spec.md)
- **Component Architecture & Rules:** [`docs/architecture.md`](docs/architecture.md)
- **Scope Decisions & Gaps:** [`docs/decisions.md`](docs/decisions.md)
- **Engineering & Working Rules:** [`AGENTS.md`](AGENTS.md)
- **Screen Designs:** [`designs/stitch/`](designs/stitch/)

---

## Key System Features

1. **4-Worker Orchestrator Pipeline (`< 90s` execution target):**
   - **Worker 1 (Entity Parser):** Internal Leptos OCR engine providing spatial bounding boxes (`x, y, w, h` and `x1, y1, x2, y2`) linking extracted text to evidentiary documents.
   - **Worker 2 (Registry Lookup):** Queries official corporate registries (Companies House) via gated MCP tool.
   - **Worker 3 (Ownership Reconciliation):** Mathematical traversal and path multiplication across multi-tier corporate structures to identify UBOs ($\ge 25\%$) vs non-UBO minority holders.
   - **Worker 4 (Document Scanner):** Cross-checks declared facts against authoritative registries and identifies discrepancies.
2. **Gated MCP Server (4 Gated Tools):**
   - `identity_service`: Biometric liveness check verdicts for Qualified UBOs and Signatories. Stores verdicts only; never stores raw biometric telemetry (`PROVISIONAL-GAP-1`, `PROVISIONAL-GAP-8`).
   - `case_system`: Case status, cap tables, and deficiency punch lists.
   - `notifications`: Outbound applicant communications using approved templates (`PROVISIONAL-GAP-6`).
   - `public_registries`: Public corporate registries covering UK Companies House, GLEIF, and OpenCorporates (`PROVISIONAL-GAP-4`).
3. **AI Gateway & KYC Agent (`PROVISIONAL-GAP-2`, `PROVISIONAL-GAP-9`):**
   - Approved enterprise model client proxy enforcing strict Pydantic/JSON schema validation.
   - Outage simulation & graceful circuit-breaker degradation.
   - Guardrail: Model output *never* sets or overrides UBO percentages.
4. **Approval Gate & Fallback Kill Switch:**
   - Blocks risky outbound communications without explicit analyst sign-off.
   - Emergency circuit breaker that halts worker execution and freezes cases upon security alerts or system outages.
5. **Cryptographic WORM Audit Log:**
   - SEC 17a-4 / FINRA WORM append-only ledger with SHA-256 Merkle chain verification (`verify_chain_integrity()`).
   - Rejects analyst overrides submitted without a written regulatory justification reason.
6. **Institutional Frontend (React 19 + TypeScript + Vite + Tailwind CSS):**
   - 7 production screens: Intake Queue, Processing State, Ownership Workbench, Registry Reconciliation, Source Document Viewer, Deficiency Punch List, and Audit Trail.

---

## Getting Started

### Prerequisites
- Python 3.10+ (with `fastapi`, `pydantic`, `pytest`)
- Node.js 18+ (with `npm`)

### Running the Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

To build the static production bundle:
```bash
cd frontend
npm run build
```

### Running the Backend API
```powershell
$env:PYTHONPATH='backend'
& "C:\Program Files\Python313\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Swagger API documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### Running the Test Suite
Run the full test suite (22 tests covering workflows, tools, security controls, and failure scenarios):
```powershell
& "C:\Program Files\Python313\python.exe" -m pytest backend/tests/ -v
```

---

## Reference Sample Data

The prototype uses the reference client **Harbor Crest Holdings Ltd** (CRN `08921471`):
- **3-Layer Ownership Structure:**
  - `Arthur Pendelton`: $60.0\% \times 53.33\% = 32.00\%$ $\to$ **Qualified UBO ($\ge 25\%$)**
  - `Helena Vance-Cross`: $60.0\% \times 46.67\% = 28.00\%$ $\to$ **Qualified UBO ($\ge 25\%$)**
  - `Julian Sterling`: $22.00\%$ (Direct) $\to$ **Non-UBO Minority Holder**
  - `Vanguard Pacific Nominees Ltd`: $18.00\%$ (Direct) $\to$ **Non-UBO Institutional Holder**
- **Deficiencies:**
  - **Critical Blocker:** Registered office address discrepancy between formation certificate (*45 Berkeley Square, London W1J 5AS*) and Companies House record (*100 Bishopsgate, London EC2N 4AG*).
  - **Standard Warning:** Arthur Pendelton passport expired on `2024-01-12`.
