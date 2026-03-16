// ===== Domain Types =====

export type Domain = 'dsa' | 'systemDesign' | 'backend' | 'conceptual' | 'behavioural';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'faang';

export type SessionType = 'ai' | 'peer';

export type SessionStatus = 'active' | 'completed' | 'abandoned';

export type UserGoal = 'placement' | 'switch' | 'practice';

export type UserRole = 'interviewer' | 'candidate';

export type RoomStatus = 'waiting' | 'active' | 'ended';

export type AuthTokenPurpose = 'email_verification' | 'password_reset' | 'magic_login';

export type MessageType = 'text' | 'file' | 'poll' | 'system';

export type TranscriptEntryRole = 'ai' | 'user' | 'system';

export type TranscriptEntryType = 'text' | 'code' | 'whiteboard_snapshot';

// ===== Domain Labels =====

export const DOMAIN_LABELS: Record<Domain, string> = {
  dsa: 'DSA',
  systemDesign: 'System Design',
  backend: 'Backend',
  conceptual: 'Conceptual',
  behavioural: 'Behavioural',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  faang: 'FAANG-level',
};

// ===== Interfaces =====

export interface ReadinessIndex {
  overall: number;
  dsa: number;
  systemDesign: number;
  backend: number;
  conceptual: number;
  behavioural: number;
  lastUpdated: string;
}

export interface EvaluationDimensions {
  correctness: number;
  approachQuality: number;
  timeEfficiency: number;
  communicationClarity: number;
  problemDecomposition: number;
  edgeCaseHandling: number;
}

export interface EvaluationReport {
  overallScore: number;
  dimensions: EvaluationDimensions;
  mistakesIdentified: string[];
  strongAnswerExample: string;
  improvementSuggestions: string[];
  topicsToReview: string[];
  generatedAt: string;
}

export interface SessionSummary {
  topicsCovered: string[];
  strongMoments: string[];
  weakMoments: string[];
  actionItems: string[];
  generatedAt: string;
}

export interface TranscriptEntry {
  role: TranscriptEntryRole;
  content: string;
  timestamp: string;
  type: TranscriptEntryType;
}

export interface Attachment {
  type: 'image' | 'pdf';
  url: string;
  filename: string;
  filesize: number;
}

export interface PollOption {
  text: string;
  voteCount: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  expiresAt?: string;
  closed: boolean;
}

export interface Percentiles {
  overall: number;
  dsa: number;
  systemDesign: number;
  backend: number;
  conceptual: number;
  behavioural: number;
}

export interface RoomParticipant {
  userId?: string;
  displayName: string;
  role: UserRole;
  isGuest: boolean;
  joinedAt: string;
}

// ===== API Response Types =====

export interface ApiError {
  error: string;
  code: string;
}

export interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
  mongodb: string;
  redis: string;
}
