import api from './api';

export interface CodeSubmissionResult {
  token: string;
  status: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  time: string;
  memory: number;
}

export async function submitCode(
  sourceCode: string,
  language: string,
  stdin?: string,
): Promise<CodeSubmissionResult> {
  const { data } = await api.post('/code/submit', { sourceCode, language, stdin });
  return data;
}

export async function getSubmissionStatus(token: string): Promise<CodeSubmissionResult> {
  const { data } = await api.get(`/code/status/${token}`);
  return data;
}

export async function getLanguages(): Promise<{ languages: { name: string; id: number }[] }> {
  const { data } = await api.get('/code/languages');
  return data;
}
