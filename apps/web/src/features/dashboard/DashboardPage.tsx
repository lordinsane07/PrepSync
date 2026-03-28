import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/layout';
import MetricCard from './MetricCard';
import WeaknessRadar from './WeaknessRadar';
import WeeklyGoalRing from './WeeklyGoalRing';
import DomainReadiness from './DomainReadiness';
import RecentSessionsTable, { type SessionRow } from './RecentSessionsTable';
import ActivityHeatmap from './ActivityHeatmap';
import { useAuthStore } from '@/stores/authStore';
import { getUserActivity } from '@/services/auth.service';
import type { Domain } from '@prepsync/shared';

// === Mock data (replaced with real API data later) ===
const MOCK_READINESS: Record<Domain, number> = {
  dsa: 72,
  systemDesign: 45,
  backend: 68,
  conceptual: 81,
  behavioural: 55,
};

const MOCK_SESSIONS: SessionRow[] = [
  { id: '1', date: 'Today, 2:30 PM', domain: 'dsa', type: 'ai', duration: '42:15', score: 78 },
  { id: '2', date: 'Today, 10:00 AM', domain: 'systemDesign', type: 'ai', duration: '38:00', score: 52 },
  { id: '3', date: 'Yesterday', domain: 'backend', type: 'peer', duration: '45:30', score: 85 },
  { id: '4', date: 'Mar 14', domain: 'conceptual', type: 'ai', duration: '30:12', score: 90 },
  { id: '5', date: 'Mar 13', domain: 'behavioural', type: 'peer', duration: '35:45', score: 62 },
  { id: '6', date: 'Mar 12', domain: 'dsa', type: 'ai', duration: '40:00', score: 70 },
];

export default function DashboardPage() {
  const userName = useAuthStore((s) => s.user?.name || 'User');
  const firstName = userName.split(' ')[0];
  const [activityData, setActivityData] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchActivity() {
      try {
        const data = await getUserActivity();
        setActivityData(data);
      } catch (err) {
        console.error('Failed to fetch activity data', err);
      }
    }
    fetchActivity();
  }, []);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display text-text-primary font-sans">
          Welcome back, {firstName}
        </h1>
        <p className="text-body text-text-secondary mt-1">
          Here's how your interview prep is going.
        </p>
      </div>

      {/* Row 1: 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Overall Readiness"
          value={72}
          subtitle="out of 100"
          trend={{ value: 5, label: 'vs last week' }}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
        />
        <MetricCard
          title="Sessions This Week"
          value="6"
          subtitle="of 7 goal"
          trend={{ value: 2, label: 'vs last week' }}
          accentColor="#10B981"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
        <MetricCard
          title="Peer Percentile"
          value="Top 15%"
          subtitle="among all users"
          accentColor="#7C3AED"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <MetricCard
          title="Streak"
          value="12 days"
          subtitle="personal best!"
          trend={{ value: 4, label: 'day increase' }}
          accentColor="#F59E0B"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          }
        />
      </div>

      {/* Row 2: Weakness Radar (2/3) + Weekly Goals Ring (1/3) */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-bg-surface border border-border-subtle rounded-lg p-6">
          <h3 className="text-heading text-text-primary font-sans font-semibold mb-2">
            Weakness Radar
          </h3>
          <p className="text-caption text-text-muted mb-4">
            Your readiness across all domains
          </p>
          <div className="flex items-center justify-center">
            <WeaknessRadar data={MOCK_READINESS} size={280} />
          </div>
        </div>
        <div className="bg-bg-surface border border-border-subtle rounded-lg p-6 flex items-center justify-center">
          <WeeklyGoalRing completed={6} goal={7} />
        </div>
      </div>

      {/* Row 3: Domain Readiness Bars */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6 mb-6">
        <DomainReadiness data={MOCK_READINESS} />
      </div>

      {/* Row 4: Activity Heatmap */}
      <div className="bg-bg-surface border border-border-subtle rounded-lg p-6 mb-6">
        <ActivityHeatmap data={activityData} />
      </div>

      {/* Row 5: Recent Sessions Table */}
      <RecentSessionsTable sessions={MOCK_SESSIONS} />
    </PageWrapper>
  );
}
