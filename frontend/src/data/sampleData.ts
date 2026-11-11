// PROVISIONAL-GAP-1: Liveness checks applied to Qualified UBOs (>=25%) and Authorized Signatories.
// PROVISIONAL-GAP-2: Model calls routed through AI Gateway with schema validation.
// PROVISIONAL-GAP-4: Public registries fixture data for Companies House, GLEIF, OpenCorporates.
// PROVISIONAL-GAP-5: Liveness evidence linked via case/individual ID and timestamp, not PDF bounding box.
// PROVISIONAL-GAP-8: No raw biometric retention; verdicts only.

export interface BeneficialOwner {
  id: string;
  name: string;
  role: string;
  citizenship: string;
  directPct: number;
  effectivePct: number;
  isUBO: boolean; // >= 25%
  thresholdStatus: 'QUALIFIED_UBO' | 'NON_UBO_MINORITY';
  tier: number;
  parentEntity?: string;
  livenessStatus?: 'PASS' | 'FAIL' | 'EXPIRED_CREDENTIAL' | 'PENDING';
  documentRef?: string;
  notes?: string;
}

export interface RegistryField {
  fieldName: string;
  fieldCode: string;
  declaredValue: string;
  registryValue: string;
  source: string;
  status: 'PERFECT_MATCH' | 'WARNING' | 'CRITICAL_MISMATCH';
  regulatoryCitation?: string;
  remediationAction?: string;
}

export interface DeficiencyItem {
  id: string;
  severity: 'CRITICAL_BLOCKER' | 'STANDARD_WARNING';
  title: string;
  description: string;
  targetEntityOrPerson: string;
  regulatoryReference: string;
  status: 'PENDING_RM_SUBMISSION' | 'UNDER_REVIEW' | 'RESOLVED';
  ageDays: number;
  actionRequired: string;
}

export interface AuditEvent {
  seq: number;
  timestamp: string;
  category: 'EXTRACTION' | 'REGISTRY_QUERY' | 'ANALYST_OVERRIDE' | 'RULE_TRIGGER' | 'APPROVAL' | 'GATEWAY_CALL';
  actor: string;
  description: string;
  sourceRef: string;
  justification?: string;
  hash: string;
}

export interface CaseDossier {
  caseId: string;
  entityName: string;
  lei: string;
  crn: string;
  jurisdiction: string;
  status: string;
  cycleTime: string;
  assignedAnalyst: string;
  documentsReceived: number;
  uboThreshold: number; // 25.0%
}

export const sampleCase: CaseDossier = {
  caseId: "CASE-2024-8841",
  entityName: "Harbor Crest Holdings Ltd",
  lei: "213800XYZ90123456789",
  crn: "08921471",
  jurisdiction: "United Kingdom / Private Ltd",
  status: "Ready for Review",
  cycleTime: "04m 18s",
  assignedAnalyst: "Marcus Vance (KYC Senior Analyst)",
  documentsReceived: 5,
  uboThreshold: 25.0
};

// 3-layer structure with 32%, 28% (UBOs >= 25%) and 18%, 22% (Non-UBOs < 25%)
export const sampleOwnershipNodes: BeneficialOwner[] = [
  {
    id: "node-1",
    name: "Harbor Crest Holdings Ltd",
    role: "Operating Target Entity",
    citizenship: "GB",
    directPct: 100.0,
    effectivePct: 100.0,
    isUBO: false,
    thresholdStatus: "QUALIFIED_UBO",
    tier: 1
  },
  {
    id: "node-2",
    name: "Atlantic Horizon Capital Ltd",
    role: "Conduit / Holding Co",
    citizenship: "KY (Cayman Islands)",
    directPct: 60.0,
    effectivePct: 60.0,
    isUBO: false,
    thresholdStatus: "QUALIFIED_UBO",
    tier: 2,
    parentEntity: "Harbor Crest Holdings Ltd",
    notes: "Direct 60.0% shareholder in Target"
  },
  {
    id: "node-3",
    name: "Arthur Pendelton",
    role: "Natural Person UBO",
    citizenship: "GB",
    directPct: 53.33,
    effectivePct: 32.0, // 60% * 53.33% = 32.0%
    isUBO: true, // VERIFIED >= 25%
    thresholdStatus: "QUALIFIED_UBO",
    tier: 3,
    parentEntity: "Atlantic Horizon Capital Ltd",
    livenessStatus: "EXPIRED_CREDENTIAL", // PROVISIONAL-GAP-1 & GAP-5: Liveness/ID check
    documentRef: "Passport - Arthur Pendelton (Expired 12 Jan 2024)",
    notes: "Formula: 60.0% × 53.33% = 32.00% Effective Equity. FLAGGED UBO (>=25%)"
  },
  {
    id: "node-4",
    name: "Helena Vance-Cross",
    role: "Natural Person UBO",
    citizenship: "CA",
    directPct: 46.67,
    effectivePct: 28.0, // 60% * 46.67% = 28.0%
    isUBO: true, // VERIFIED >= 25%
    thresholdStatus: "QUALIFIED_UBO",
    tier: 3,
    parentEntity: "Atlantic Horizon Capital Ltd",
    livenessStatus: "PASS", // PROVISIONAL-GAP-1: Verified liveness
    documentRef: "Passport - Helena Vance-Cross (Valid to 2028)",
    notes: "Formula: 60.0% × 46.67% = 28.00% Effective Equity. FLAGGED UBO (>=25%)"
  },
  {
    id: "node-5",
    name: "Julian Sterling",
    role: "Direct Shareholder",
    citizenship: "GB",
    directPct: 22.0,
    effectivePct: 22.0,
    isUBO: false, // VERIFIED < 25%
    thresholdStatus: "NON_UBO_MINORITY",
    tier: 2,
    parentEntity: "Harbor Crest Holdings Ltd",
    notes: "Direct 22.0% equity. Below 25% threshold."
  },
  {
    id: "node-6",
    name: "Vanguard Pacific Nominees",
    role: "Regulated Trustee / Nominee",
    citizenship: "JE (Jersey)",
    directPct: 18.0,
    effectivePct: 18.0,
    isUBO: false, // VERIFIED < 25%
    thresholdStatus: "NON_UBO_MINORITY",
    tier: 2,
    parentEntity: "Harbor Crest Holdings Ltd",
    notes: "Direct 18.0% equity. Minority institutional holder. NOT flagged as UBO."
  }
];

// One critical registered office address mismatch (Cannon St vs Finsbury Circus)
export const sampleRegistryReconciliation: RegistryField[] = [
  {
    fieldName: "Registered Office Address",
    fieldCode: "CH.FIELD_004",
    declaredValue: "Suite 401, 25 Finsbury Circus, London EC2M 7EE, United Kingdom",
    registryValue: "128 Cannon Street, 4th Floor, London EC4N 6AS, United Kingdom",
    source: "UK Companies House API v3 (Reg #09841209)",
    status: "CRITICAL_MISMATCH",
    regulatoryCitation: "FCA MLR 2017 / 5AMLD Art 13(1)(a)",
    remediationAction: "Request Form AD01 statutory address confirmation"
  },
  {
    fieldName: "Legal Entity Name",
    fieldCode: "CH.FIELD_001",
    declaredValue: "Harbor Crest Holdings Ltd",
    registryValue: "HARBOR CREST HOLDINGS LIMITED",
    source: "UK Companies House API v3",
    status: "PERFECT_MATCH",
    remediationAction: "Standard capitalization match accepted"
  },
  {
    fieldName: "Company Registration Number (CRN)",
    fieldCode: "CH.FIELD_002",
    declaredValue: "08921471",
    registryValue: "08921471",
    source: "UK Companies House API v3",
    status: "PERFECT_MATCH"
  },
  {
    fieldName: "Company Status",
    fieldCode: "CH.FIELD_003",
    declaredValue: "Active",
    registryValue: "Active (Good Standing)",
    source: "UK Companies House API v3",
    status: "PERFECT_MATCH"
  },
  {
    fieldName: "LEI Code Registration",
    fieldCode: "GLEIF.LEI_001",
    declaredValue: "213800XYZ90123456789",
    registryValue: "213800XYZ90123456789",
    source: "GLEIF Global LEI Index",
    status: "PERFECT_MATCH"
  }
];

// Deficiency Punch List with Critical Blockers and Standard Warnings
export const sampleDeficiencies: DeficiencyItem[] = [
  {
    id: "DEF-001",
    severity: "CRITICAL_BLOCKER",
    title: "Proof of Current Registered Office Address Discrepancy",
    description: "Statutory address mismatch detected: declared Suite 401 Finsbury Circus vs official Companies House active filing 128 Cannon Street.",
    targetEntityOrPerson: "Harbor Crest Holdings Ltd",
    regulatoryReference: "FCA MLR 2017 / 5AMLD Art 13(1)(a)",
    status: "PENDING_RM_SUBMISSION",
    ageDays: 2,
    actionRequired: "Request Form AD01 or updated statutory lease"
  },
  {
    id: "DEF-002",
    severity: "CRITICAL_BLOCKER",
    title: "Expired Government-Issued Photo ID (32% Qualified UBO)",
    description: "Passport for Arthur Pendelton (32.0% Qualified UBO) expired on 12 Jan 2024 prior to application date.",
    targetEntityOrPerson: "Arthur Pendelton (32.0% Qualified UBO)",
    regulatoryReference: "FATF Recommendation 10 / CDD Rule",
    status: "PENDING_RM_SUBMISSION",
    ageDays: 4,
    actionRequired: "Submit current unexpired passport or national ID"
  },
  {
    id: "DEF-003",
    severity: "STANDARD_WARNING",
    title: "Register of Directors Certified Copy Disparity",
    description: "Roster has minor difference compared to electronic Companies House officers register.",
    targetEntityOrPerson: "Harbor Crest Holdings Ltd",
    regulatoryReference: "Companies Act 2006 s.162",
    status: "UNDER_REVIEW",
    ageDays: 2,
    actionRequired: "Confirm active directors list with corporate secretary"
  },
  {
    id: "DEF-004",
    severity: "STANDARD_WARNING",
    title: "Conduit Entity Certificate of Good Standing",
    description: "Atlantic Horizon Capital Ltd (Cayman Islands) requires fresh Certificate of Incumbency.",
    targetEntityOrPerson: "Atlantic Horizon Capital Ltd",
    regulatoryReference: "5AMLD Tier 2 Entity Verification",
    status: "UNDER_REVIEW",
    ageDays: 3,
    actionRequired: "Remediate within 5 business days"
  }
];

export const sampleAuditEvents: AuditEvent[] = [
  {
    seq: 28,
    timestamp: "2026-10-24 09:22:14 UTC",
    category: "ANALYST_OVERRIDE",
    actor: "MV (Marcus Vance #4092)",
    description: "Manual classification of Julian Sterling (22.0% direct) as Non-UBO after sanctions & PEP clearance.",
    sourceRef: "Register_of_Members.pdf (Page 6, [x:120, y:450])",
    justification: "Verified below 25.0% statutory threshold; no dominant shareholder pact found.",
    hash: "0x8f2a-cc91-44b0"
  },
  {
    seq: 27,
    timestamp: "2026-10-24 09:21:40 UTC",
    category: "RULE_TRIGGER",
    actor: "KYC Agent (Engine v2.4)",
    description: "UBO Rule Engine flagged Arthur Pendelton (32.0%) and Helena Vance-Cross (28.0%) as Qualified UBOs (>= 25%).",
    sourceRef: "Cap Table Resolution DAG",
    hash: "0x4e12-88ba-99f1"
  },
  {
    seq: 26,
    timestamp: "2026-10-24 09:21:05 UTC",
    category: "REGISTRY_QUERY",
    actor: "MCP Tool: public_registries",
    description: "UK Companies House API v3 returned active filing: 128 Cannon Street. Address mismatch detected.",
    sourceRef: "UK CH REST API v3 /company/08921471",
    hash: "0x2d99-55aa-77c3"
  },
  {
    seq: 25,
    timestamp: "2026-10-24 09:20:30 UTC",
    category: "EXTRACTION",
    actor: "OCR Module (Leptos v2.8)",
    description: "Parsed Articles of Association and Register of Members (5 documents, 3 legal entities, 4 directors).",
    sourceRef: "Articles_of_Association.pdf (SHA-256: d9e4...b71c)",
    hash: "0x11ab-33cf-9912"
  }
];
