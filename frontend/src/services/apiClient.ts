// API Client configuration supporting dynamic GCP Cloud Run backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface PipelineRunPayload {
  case_id?: string;
  bundle_name?: string;
  crn?: string;
  declared_address?: string;
}

export class NorthgateApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend unavailable, using static fallback:', err);
      return { status: 'offline', mode: 'static_fallback' };
    }
  }

  async runPipeline(payload: PipelineRunPayload = { case_id: 'CASE-2024-8841' }) {
    const res = await fetch(`${this.baseUrl}/api/pipeline/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Pipeline execution failed: ${res.statusText}`);
    return await res.json();
  }

  async verifyAuditChain() {
    const res = await fetch(`${this.baseUrl}/api/audit/verify`);
    if (!res.ok) throw new Error(`Audit verification failed: ${res.statusText}`);
    return await res.json();
  }

  async approveNotification(messageId: string, analystId: string, justification: string) {
    const res = await fetch(`${this.baseUrl}/api/approval/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message_id: messageId,
        analyst_id: analystId,
        justification,
      }),
    });
    return await res.json();
  }

  async triggerKillSwitch(caseId?: string, reason: string = 'MANUAL_ABORT') {
    const res = await fetch(`${this.baseUrl}/api/kill-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        case_id: caseId,
        reason,
      }),
    });
    return await res.json();
  }
}

export const apiClient = new NorthgateApiClient();
