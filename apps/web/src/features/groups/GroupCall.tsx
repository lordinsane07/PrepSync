import '@livekit/components-styles';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  GridLayout,
  ParticipantTile,
  useTracks,
  useChat,
  TrackToggle,
  DisconnectButton,
  useParticipants,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useState, useEffect, useRef } from 'react';
import { getLiveKitToken } from '@/services/livekit.service';


const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://your-livekit-server-url';

interface GroupCallProps {
  roomName: string;
}

/* ─── Custom Video Grid ─── */
function VideoGrid() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{
        height: '100%',
        width: '100%',
        padding: '12px',
        gap: '12px',
      }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}

/* ─── Chat Sidebar ─── */
function ChatPanel({ onClose }: { onClose: () => void }) {
  const { chatMessages, send } = useChat();
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    send(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="gc-chat-panel">
      {/* Header */}
      <div className="gc-chat-header">
        <span className="gc-chat-title">In-call messages</span>
        <button className="gc-icon-btn" onClick={onClose} title="Close chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="gc-chat-messages" ref={scrollRef}>
        {chatMessages.length === 0 && (
          <div className="gc-chat-empty">
            <p>Messages can only be seen by people in the call and are deleted when the call ends.</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className="gc-chat-msg">
            <div className="gc-chat-msg-meta">
              <span className="gc-chat-msg-name">
                {msg.from?.name || msg.from?.identity || 'Unknown'}
              </span>
              <span className="gc-chat-msg-time">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
            <p className="gc-chat-msg-text">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="gc-chat-input-bar">
        <input
          className="gc-chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
          placeholder="Send a message to everyone"
        />
        <button
          className="gc-send-btn"
          onClick={handleSend}
          disabled={!inputValue.trim()}
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Participant Count Badge ─── */
function ParticipantCount() {
  const participants = useParticipants();
  return (
    <span className="gc-participant-count">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      {participants.length}
    </span>
  );
}

/* ─── Control Bar ─── */
function ControlBar({ chatOpen, onToggleChat }: { chatOpen: boolean; onToggleChat: () => void }) {
  return (
    <div className="gc-controls">
      <div className="gc-controls-center">
        <TrackToggle source={Track.Source.Microphone} className="gc-ctrl-btn">
          Mic
        </TrackToggle>
        <TrackToggle source={Track.Source.Camera} className="gc-ctrl-btn">
          Camera
        </TrackToggle>
        <TrackToggle source={Track.Source.ScreenShare} className="gc-ctrl-btn">
          Share
        </TrackToggle>
      </div>

      <div className="gc-controls-right">
        <ParticipantCount />
        <button
          className={`gc-ctrl-btn gc-ctrl-btn-subtle ${chatOpen ? 'gc-ctrl-btn-active' : ''}`}
          onClick={onToggleChat}
          title="Toggle chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <DisconnectButton className="gc-leave-btn">
          Leave
        </DisconnectButton>
      </div>
    </div>
  );
}

/* ─── Call Stage (inside LiveKitRoom) ─── */
function CallStage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="gc-stage">
      <div className="gc-video-area">
        <VideoGrid />
      </div>
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}
      <ControlBar chatOpen={chatOpen} onToggleChat={() => setChatOpen((v) => !v)} />
    </div>
  );
}

/* ─── Main Component ─── */
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
      <div className="gc-status">
        <div className="gc-spinner" />
        <p className="gc-status-text">Joining call…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gc-status gc-status-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="gc-root">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: '100%', width: '100%' }}
      >
        <CallStage />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
