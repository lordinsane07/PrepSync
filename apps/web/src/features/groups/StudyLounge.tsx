import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';
import { clsx } from 'clsx';
import { useAuthStore } from '@/stores/authStore';
import {
  connectSocket,
  getSocket,
} from '@/services/socket';

interface LoungeUser {
  socketId: string;
  displayName: string;
}

export default function StudyLounge({ groupId }: { groupId: string }) {
  const user = useAuthStore((s) => s.user);
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState<LoungeUser[]>([]);
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleJoin = () => {
    const socket = connectSocket();
    const roomKey = `lounge:${groupId}`;

    socket.emit('room:join', { roomId: roomKey, displayName: user?.name || 'User' });

    socket.on('room:participants', (data: { participants: LoungeUser[] }) => {
      setUsers(data.participants);
    });

    socket.on('room:user-joined', (data: LoungeUser) => {
      setUsers((prev) => [...prev, data]);
      setChatMessages((prev) => [...prev, {
        id: `sys-${Date.now()}`,
        user: 'System',
        text: `${data.displayName} joined the lounge`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    });

    socket.on('room:user-left', (data: { displayName: string }) => {
      setUsers((prev) => prev.filter((u) => u.displayName !== data.displayName));
      setChatMessages((prev) => [...prev, {
        id: `sys-${Date.now()}`,
        user: 'System',
        text: `${data.displayName} left the lounge`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    });

    socket.on('room:message', (msg: { content: string; displayName: string }) => {
      setChatMessages((prev) => [...prev, {
        id: `msg-${Date.now()}`,
        user: msg.displayName,
        text: msg.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    });

    setJoined(true);
  };

  const handleLeave = () => {
    const socket = getSocket();
    socket.emit('room:leave', { roomId: `lounge:${groupId}` });
    socket.off('room:participants');
    socket.off('room:user-joined');
    socket.off('room:user-left');
    socket.off('room:message');
    setJoined(false);
    setUsers([]);
    setChatMessages([]);
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const socket = getSocket();
    socket.emit('room:message', {
      roomId: `lounge:${groupId}`,
      content: chatInput.trim(),
      displayName: user?.name || 'User',
    });
    setChatInput('');
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <span className="text-2xl">🎧</span>
        </div>
        <h3 className="text-heading text-text-primary font-sans font-semibold mb-2">Study Lounge</h3>
        <p className="text-body text-text-secondary font-sans mb-4 text-center max-w-xs">
          A persistent drop-in space. Chat casually, find study partners, or just hang out.
        </p>
        <Button onClick={handleJoin}>Join Lounge</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="text-body text-text-primary font-sans font-medium">🎧 Study Lounge</span>
          <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-caption font-sans">
            {users.length} online
          </span>
        </div>
        <Button size="sm" variant="danger" onClick={handleLeave}>Leave</Button>
      </div>

      {/* Online users */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border-subtle/50 overflow-x-auto">
        {users.map((u) => (
          <div
            key={u.socketId}
            className="flex items-center gap-1.5 px-2 py-1 bg-bg-overlay rounded-full shrink-0"
          >
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-caption text-text-primary font-sans">{u.displayName}</span>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={clsx(
            msg.user === 'System' && 'text-center',
          )}>
            {msg.user === 'System' ? (
              <p className="text-[10px] text-text-muted font-sans italic">{msg.text}</p>
            ) : (
              <div className={clsx(
                'px-3 py-1.5 rounded-lg max-w-[85%]',
                msg.user === (user?.name || '') ? 'bg-accent/10 ml-auto' : 'bg-bg-overlay',
              )}>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[10px] text-text-muted font-sans">{msg.user}</span>
                  <span className="text-[9px] text-text-muted font-sans">{msg.time}</span>
                </div>
                <p className="text-caption text-text-primary font-sans">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border-subtle p-3">
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
            placeholder="Say something..."
            className="flex-1 bg-bg-base border border-border-subtle rounded-md px-3 py-2 text-caption font-sans text-text-primary focus:outline-none focus:border-accent placeholder:text-text-muted"
          />
          <Button size="sm" onClick={handleSend} disabled={!chatInput.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
}
