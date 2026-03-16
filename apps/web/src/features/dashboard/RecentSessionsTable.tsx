import { Badge } from '@/components/ui';
import type { Domain } from '@prepsync/shared';

interface SessionRow {
  id: string;
  date: string;
  domain: Domain;
  type: 'ai' | 'peer';
  duration: string;
  score: number;
}

interface RecentSessionsTableProps {
  sessions: SessionRow[];
  className?: string;
}

function getScoreColor(score: number): string {
  if (score < 40) return 'var(--color-danger)';
  if (score < 60) return 'var(--color-warning)';
  if (score < 80) return 'var(--color-text-primary)';
  return 'var(--color-accent)';
}

export default function RecentSessionsTable({ sessions, className }: RecentSessionsTableProps) {
  if (sessions.length === 0) {
    return (
      <div className={className}>
        <h3 className="text-heading text-text-primary font-sans font-semibold mb-4">
          Recent Sessions
        </h3>
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-8 text-center">
          <p className="text-body text-text-muted">No sessions yet. Start your first interview!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-heading text-text-primary font-sans font-semibold mb-4">
        Recent Sessions
      </h3>
      <div className="bg-bg-surface border border-border-subtle rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-caption text-text-muted font-sans font-medium uppercase tracking-[0.04em] px-5 py-3">
                Date
              </th>
              <th className="text-left text-caption text-text-muted font-sans font-medium uppercase tracking-[0.04em] px-5 py-3">
                Domain
              </th>
              <th className="text-left text-caption text-text-muted font-sans font-medium uppercase tracking-[0.04em] px-5 py-3">
                Type
              </th>
              <th className="text-left text-caption text-text-muted font-sans font-medium uppercase tracking-[0.04em] px-5 py-3">
                Duration
              </th>
              <th className="text-right text-caption text-text-muted font-sans font-medium uppercase tracking-[0.04em] px-5 py-3">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-border-subtle last:border-b-0 hover:bg-bg-overlay cursor-pointer transition-colors"
              >
                <td className="px-5 py-3">
                  <span className="text-body text-text-secondary font-sans">{session.date}</span>
                </td>
                <td className="px-5 py-3">
                  <Badge variant="domain" domain={session.domain} />
                </td>
                <td className="px-5 py-3">
                  <span className="text-body text-text-secondary font-sans capitalize">
                    {session.type === 'ai' ? 'AI Interview' : 'Peer Session'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="text-code font-mono text-text-secondary">{session.duration}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span
                    className="text-code font-mono font-medium"
                    style={{ color: getScoreColor(session.score) }}
                  >
                    {session.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { SessionRow };
