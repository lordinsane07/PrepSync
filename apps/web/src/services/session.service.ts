import api from './api';
import type { Domain, Difficulty } from '@prepsync/shared';

export interface CreateSessionResponse {
  sessionId: string;
  question: string;
  domain: Domain;
  difficulty: Difficulty;
  durationMinutes: number;
  startedAt: string;
}

export interface SendMessageResponse {
  aiResponse: string;
  transcriptLength: number;
  timeRemainingMinutes: number;
}

export interface EndSessionResponse {
  sessionId: string;
  status: string;
  evaluationReport: {
    overallScore: number;
    dimensions: {
      correctness: number;
      approachQuality: number;
      timeEfficiency: number;
      communicationClarity: number;
      problemDecomposition: number;
      edgeCaseHandling: number;
    };
    mistakesIdentified: string[];
    strongAnswerExample: string;
    improvementSuggestions: string[];
    topicsToReview: string[];
    generatedAt: string;
  };
}

export async function createSession(
  domain: Domain,
  difficulty: Difficulty,
  durationMinutes: number,
): Promise<CreateSessionResponse> {
  const { data } = await api.post('/sessions', { domain, difficulty, durationMinutes });
  return data;
}

export async function sendMessage(
  sessionId: string,
  content: string,
  type: 'text' | 'code' = 'text',
): Promise<SendMessageResponse> {
  const { data } = await api.post(`/sessions/${sessionId}/message`, { content, type });
  return data;
}

export async function endSession(sessionId: string): Promise<EndSessionResponse> {
  const { data } = await api.patch(`/sessions/${sessionId}/end`);
  return data;
}

export async function getSession(sessionId: string) {
  const { data } = await api.get(`/sessions/${sessionId}`);
  return data;
}

export async function listSessions(params?: {
  page?: number;
  limit?: number;
  domain?: string;
  type?: string;
}) {
  const { data } = await api.get('/sessions', { params });
  return data;
}
