import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../middleware/error';

// Judge0 CE config — self-hosted or RapidAPI
const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || '';

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  typescript: 74,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  go: 60,
  rust: 73,
};

async function judge0Fetch(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(JUDGE0_API_KEY ? { 'X-RapidAPI-Key': JUDGE0_API_KEY } : {}),
  };

  const res = await fetch(`${JUDGE0_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> || {}) },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error response');
    throw ApiError.badRequest(`Judge0 error: ${res.status} ${text}`);
  }

  return res.json();
}

// ===== POST /code/submit — Submit code for execution =====
export async function submitCode(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) throw ApiError.unauthorized();

    const { sourceCode, language, stdin } = req.body as {
      sourceCode: string;
      language: string;
      stdin?: string;
    };

    if (!sourceCode?.trim()) throw ApiError.badRequest('Source code is required');
    if (!language || !LANGUAGE_IDS[language]) {
      throw ApiError.badRequest('Unsupported language');
    }

    const result = await judge0Fetch('/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: LANGUAGE_IDS[language],
        stdin: stdin || '',
      }),
    });

    res.json({
      token: result.token,
      status: result.status?.description || 'Unknown',
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    next(error);
  }
}

// ===== GET /code/status/:token — Poll for execution results =====
export async function getSubmissionStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user;
    if (!user) throw ApiError.unauthorized();

    const { token } = req.params;
    if (!token) throw ApiError.badRequest('Token is required');

    const result = await judge0Fetch(`/submissions/${token}?base64_encoded=false`);

    res.json({
      token: result.token,
      status: result.status?.description || 'Unknown',
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      compileOutput: result.compile_output || '',
      time: result.time,
      memory: result.memory,
    });
  } catch (error) {
    next(error);
  }
}

// ===== GET /code/languages — List available languages =====
export async function getLanguages(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json({
      languages: Object.entries(LANGUAGE_IDS).map(([name, id]) => ({ name, id })),
    });
  } catch (error) {
    next(error);
  }
}
