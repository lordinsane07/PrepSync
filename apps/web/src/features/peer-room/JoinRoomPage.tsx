import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { getRoomByCode, joinRoom, type RoomParticipant } from '@/services/room.service';
import { useAuthStore } from '@/stores/authStore';

export default function JoinRoomPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState('');
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'active' | 'ended' | null>(null);
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    if (inviteCode) {
      fetchRoom(inviteCode);
    }
  }, [inviteCode]);

  const fetchRoom = async (code: string) => {
    setLoading(true);
    try {
      const room = await getRoomByCode(code);
      setRoomId(room.roomId);
      setParticipants(room.participants);
      setRoomStatus(room.status);
    } catch {
      setError('Room not found or has already ended.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    setError('');
    try {
      await joinRoom(roomId, isAuthenticated ? undefined : guestName);
      // Navigate to the persistent peer room page URL
      navigate(`/peer-room/${inviteCode}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-body text-text-muted font-sans">Finding room...</p>
        </div>
      </div>
    );
  }

  if (error && !roomId) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-title text-text-primary font-sans mb-2">Room Not Found</h2>
          <p className="text-body text-text-secondary font-sans mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="max-w-sm w-full mx-auto px-6">
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>

          <h2 className="text-title text-text-primary font-sans mb-1">
            Join Peer Room
          </h2>
          <p className="text-body text-text-secondary font-sans mb-1">
            Room: <span className="font-mono text-accent">{inviteCode}</span>
          </p>
          <p className="text-caption text-text-muted font-sans mb-6">
            {participants.length}/2 participants • {roomStatus === 'waiting' ? 'Waiting' : 'In progress'}
          </p>

          {/* Current participants */}
          {participants.length > 0 && (
            <div className="mb-4">
              {participants.map((p, i) => (
                <div key={i} className="flex items-center gap-2 justify-center py-1">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs text-accent">{p.displayName.charAt(0)}</span>
                  </div>
                  <span className="text-body text-text-primary font-sans">{p.displayName}</span>
                </div>
              ))}
            </div>
          )}

          {/* Guest name input */}
          {!isAuthenticated && (
            <div className="mb-4">
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your display name"
                className="w-full bg-bg-elevated border border-border-default rounded-md px-4 py-2.5 text-body font-sans text-text-primary text-center focus:outline-none focus:border-accent-border placeholder:text-text-muted"
              />
            </div>
          )}

          {error && (
            <p className="text-caption text-danger font-sans mb-3">{error}</p>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleJoin}
              isLoading={joining}
              disabled={!isAuthenticated && !guestName.trim()}
              className="w-full"
            >
              {isAuthenticated ? 'Join Room' : 'Join as Guest'}
            </Button>
            {!isAuthenticated && (
              <Button
                variant="ghost"
                onClick={() => navigate(`/login?redirect=/room/${inviteCode}`)}
                className="w-full"
              >
                Sign in to save your history
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
