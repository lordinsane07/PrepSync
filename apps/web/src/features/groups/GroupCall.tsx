import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { useState, useEffect } from 'react';
import { getLiveKitToken } from '@/services/livekit.service';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server-url';

interface GroupCallProps {
  roomName: string;
}

export default function GroupCall({ roomName }: GroupCallProps) {
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const { token: tk } = await getLiveKitToken(roomName);
        setToken(tk);
      } catch (err: any) {
        setError(err.message || 'Failed to get call token');
      } finally {
        setIsConnecting(false);
      }
    }
    loadToken();
  }, [roomName]);

  if (isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center p-10 h-full">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-text-secondary font-sans animate-pulse">Joining call...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 h-full text-danger">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border-subtle bg-bg-base">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
