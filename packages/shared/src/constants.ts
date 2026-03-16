import type { Domain, Difficulty } from './types';

// ===== Duration Options =====
export const SESSION_DURATIONS = [20, 40, 60] as const;
export type SessionDuration = (typeof SESSION_DURATIONS)[number];

// ===== Domain Colors =====
export const DOMAIN_COLORS: Record<Domain, { bg: string; text: string }> = {
  dsa: { bg: 'rgba(124,58,237,0.12)', text: '#A78BFA' },
  systemDesign: { bg: 'rgba(14,165,233,0.12)', text: '#38BDF8' },
  backend: { bg: 'rgba(16,185,129,0.12)', text: '#34D399' },
  conceptual: { bg: 'rgba(245,158,11,0.12)', text: '#FCD34D' },
  behavioural: { bg: 'rgba(236,72,153,0.12)', text: '#F9A8D4' },
};

// ===== Group IDs =====
export const GROUP_IDS: Record<Domain, string> = {
  dsa: 'dsa',
  systemDesign: 'system-design',
  backend: 'backend',
  conceptual: 'conceptual',
  behavioural: 'behavioural',
};

export const GROUP_NAMES: Record<string, string> = {
  dsa: 'DSA Group',
  'system-design': 'System Design Group',
  backend: 'Backend Group',
  conceptual: 'Conceptual Group',
  behavioural: 'Behavioural Group',
};

// ===== Evaluation Dimension Labels =====
export const EVALUATION_DIMENSIONS = [
  'correctness',
  'approachQuality',
  'timeEfficiency',
  'communicationClarity',
  'problemDecomposition',
  'edgeCaseHandling',
] as const;

export const DIMENSION_LABELS: Record<string, string> = {
  correctness: 'Correctness',
  approachQuality: 'Approach Quality',
  timeEfficiency: 'Time/Space Efficiency',
  communicationClarity: 'Communication Clarity',
  problemDecomposition: 'Problem Decomposition',
  edgeCaseHandling: 'Edge Case Handling',
};

// ===== Score Color Ranges =====
export const SCORE_RANGES = {
  DANGER: { min: 0, max: 39 },
  WARNING: { min: 40, max: 59 },
  NEUTRAL: { min: 60, max: 79 },
  ACCENT: { min: 80, max: 100 },
} as const;

// ===== Validation Constants =====
export const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 60,
  PASSWORD_MIN: 8,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  OTP_RESEND_SECONDS: 60,
  OTP_MAX_ATTEMPTS: 3,
  OTP_LOCKOUT_MINUTES: 15,
  INVITE_CODE_LENGTH: 6,
  WEEKLY_GOAL_MIN: 1,
  WEEKLY_GOAL_MAX: 14,
  WEEKLY_GOAL_DEFAULT: 5,
} as const;

// ===== Difficulty Order =====
export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'faang'];

// ===== All Domains =====
export const ALL_DOMAINS: Domain[] = [
  'dsa',
  'systemDesign',
  'backend',
  'conceptual',
  'behavioural',
];

// ===== Onboarding Goal Options =====
export const GOAL_OPTIONS = [
  { value: 'placement', label: 'On-campus placements' },
  { value: 'switch', label: 'Off-campus applications' },
  { value: 'practice', label: 'Job switch' },
] as const;

// ===== Weekly Goal Labels =====
export const WEEKLY_GOAL_LABELS = {
  CASUAL: { min: 1, max: 3, label: 'Casual' },
  FOCUSED: { min: 4, max: 7, label: 'Focused' },
  INTENSIVE: { min: 8, max: 14, label: 'Intensive' },
} as const;
