import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { clsx } from 'clsx';
import {
  listGroups,
  getGroupMessages,
  sendGroupMessage,
  createPoll,
  votePoll,
  type GroupInfo,
  type GroupMessageData,
} from '@/services/group.service';
import { useAuthStore } from '@/stores/authStore';
import StudyLounge from './StudyLounge';
import GroupCall from './GroupCall';

const GROUP_COLORS: Record<string, string> = {
  dsa: '#7C3AED',
  'system-design': '#0EA5E9',
  backend: '#10B981',
  conceptual: '#F59E0B',
  behavioural: '#EC4899',
};

const GROUP_ICONS: Record<string, string> = {
  dsa: '🧮',
  'system-design': '🏗️',
  backend: '⚙️',
  conceptual: '📖',
  behavioural: '🗣️',
};

export default function DomainGroupsPage() {
  const { groupId } = useParams<{ groupId?: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>(groupId || 'dsa');
  const [messages, setMessages] = useState<GroupMessageData[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [mainView, setMainView] = useState<'chat' | 'lounge' | 'call'>('chat');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch messages when active group changes
  useEffect(() => {
    if (activeGroup) {
      fetchMessages(activeGroup);
    }
  }, [activeGroup]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGroups = async () => {
    try {
      const data = await listGroups();
      setGroups(data.groups);
    } catch {
      // ignore
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchMessages = async (gId: string) => {
    setLoadingMessages(true);
    try {
      const data = await getGroupMessages(gId);
      setMessages(data.messages);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = useCallback(async () => {
    if (!messageInput.trim() || sending) return;
    setSending(true);
    try {
      const newMsg = await sendGroupMessage(activeGroup, messageInput.trim());
      setMessages((prev) => [...prev, newMsg]);
      setMessageInput('');
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }, [activeGroup, messageInput, sending]);

  const handleCreatePoll = async () => {
    const validOptions = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || validOptions.length < 2) return;
    try {
      const newMsg = await createPoll(activeGroup, pollQuestion.trim(), validOptions);
      setMessages((prev) => [...prev, newMsg]);
      setShowPollForm(false);
      setPollQuestion('');
      setPollOptions(['', '']);
    } catch {
      // ignore
    }
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await votePoll(activeGroup, pollId, optionIndex);
      fetchMessages(activeGroup); // Refresh to get updated vote counts
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGroupClick = (gId: string) => {
    setActiveGroup(gId);
    setMainView('chat');
    navigate(`/groups/${gId}`, { replace: true });
  };

  const activeGroupInfo = groups.find((g) => g.groupId === activeGroup);

  return (
    <div className="h-[calc(100vh-48px)] flex">
      {/* Left Panel — Group List */}
      <div className="w-[280px] bg-bg-surface border-r border-border-subtle flex flex-col shrink-0">
        <div className="p-4 border-b border-border-subtle">
          <h2 className="text-heading text-text-primary font-sans font-semibold">Groups</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {groups.map((group) => (
            <button
              key={group.groupId}
              onClick={() => handleGroupClick(group.groupId)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 transition-colors relative text-left',
                activeGroup === group.groupId
                  ? 'bg-bg-overlay'
                  : 'hover:bg-bg-overlay/50',
              )}
            >
              {activeGroup === group.groupId && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-sm"
                  style={{ backgroundColor: group.color }}
                />
              )}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${group.color}20` }}
              >
                <span className="text-lg">{GROUP_ICONS[group.groupId] || '💬'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body text-text-primary font-sans truncate">{group.name}</p>
                {group.lastMessage && (
                  <p className="text-caption text-text-muted font-sans truncate">
                    {group.lastMessage.senderName}: {group.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          ))}
          {loadingGroups && (
            <div className="p-4 text-center">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Active Group Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 bg-bg-surface border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${GROUP_COLORS[activeGroup] || '#00D4FF'}20` }}
            >
              <span>{GROUP_ICONS[activeGroup] || '💬'}</span>
            </div>
            <div>
              <p className="text-body text-text-primary font-sans font-medium">
                {activeGroupInfo?.name || activeGroup}
              </p>
              <p className="text-caption text-text-muted font-sans">
                {activeGroupInfo?.totalMessages || 0} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={mainView === 'chat' ? 'primary' : 'secondary'} 
              onClick={() => setMainView('chat')}
            >
              Chat
            </Button>
            <Button 
              size="sm" 
              variant={mainView === 'lounge' ? 'primary' : 'secondary'} 
              onClick={() => setMainView('lounge')}
            >
              Study Lounge
            </Button>
            <Button 
              size="sm" 
              variant={mainView === 'call' ? 'primary' : 'secondary'} 
              onClick={() => setMainView('call')}
            >
              Group Call
            </Button>
          </div>
        </div>

        {/* Dynamic Content */}
        {mainView === 'lounge' ? (
          <div className="flex-1 min-h-0 bg-bg-base">
            <StudyLounge groupId={activeGroup} />
          </div>
        ) : mainView === 'call' ? (
          <div className="flex-1 min-h-0 bg-black p-4">
            <GroupCall roomName={`group-${activeGroup}`} />
          </div>
        ) : (
          <>
            {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {loadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-body text-text-muted font-sans mb-1">No messages yet</p>
                <p className="text-caption text-text-muted font-sans">Be the first to start a conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.userId?._id === user?._id;
              return (
                <div key={msg._id} className="flex gap-3 group">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${GROUP_COLORS[activeGroup] || '#00D4FF'}15` }}
                  >
                    <span className="text-xs font-medium" style={{ color: GROUP_COLORS[activeGroup] }}>
                      {msg.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={clsx('text-body font-sans font-medium', isMe ? 'text-accent' : 'text-text-primary')}>
                        {msg.userId?.name || 'Unknown'}
                      </span>
                      <span className="text-[10px] text-text-muted font-sans">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Text message */}
                    {msg.type === 'text' && (
                      <p className="text-body text-text-secondary font-sans whitespace-pre-wrap">{msg.content}</p>
                    )}

                    {/* Poll message */}
                    {msg.type === 'poll' && msg.poll && (
                      <div className="bg-bg-surface border border-border-subtle rounded-lg p-4 max-w-sm mt-1">
                        <p className="text-body text-text-primary font-sans font-medium mb-3">
                          📊 {msg.poll.question}
                        </p>
                        <div className="flex flex-col gap-2">
                          {msg.poll.options.map((opt, idx) => {
                            const totalVotes = msg.poll!.options.reduce(
                              (sum, o) => sum + (o.voteCount || o.votes?.length || 0), 0,
                            );
                            const voteCount = opt.voteCount || opt.votes?.length || 0;
                            const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                            return (
                              <button
                                key={idx}
                                onClick={() => handleVote(msg._id, idx)}
                                disabled={msg.poll!.closed}
                                className="relative flex items-center justify-between px-3 py-2 rounded-md border border-border-subtle hover:border-accent/40 transition-colors overflow-hidden text-left"
                              >
                                <div
                                  className="absolute inset-0 rounded-md opacity-10"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: GROUP_COLORS[activeGroup] || '#00D4FF',
                                  }}
                                />
                                <span className="text-body text-text-primary font-sans relative z-10">
                                  {opt.text}
                                </span>
                                <span className="text-caption text-text-muted font-mono relative z-10">
                                  {voteCount} ({pct}%)
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {msg.poll.closed && (
                          <p className="text-caption text-text-muted font-sans mt-2">Poll closed</p>
                        )}
                      </div>
                    )}

                    {/* File message */}
                    {msg.type === 'file' && msg.attachments?.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-1 px-3 py-2 bg-bg-surface border border-border-subtle rounded-md hover:border-accent/40 transition-colors"
                      >
                        <span>{att.type === 'image' ? '🖼️' : '📄'}</span>
                        <span className="text-body text-text-primary font-sans">{att.filename}</span>
                      </a>
                    ))}

                    {/* System message */}
                    {msg.type === 'system' && (
                      <p className="text-caption text-text-muted font-sans italic">{msg.content}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Poll creation form */}
        {showPollForm && (
          <div className="bg-bg-surface border-t border-border-subtle p-4">
            <div className="max-w-md">
              <p className="text-body text-text-primary font-sans font-medium mb-3">Create a Poll</p>
              <input
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 text-body font-sans text-text-primary mb-3 focus:outline-none focus:border-accent placeholder:text-text-muted"
              />
              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="w-full bg-bg-elevated border border-border-default rounded-md px-3 py-2 text-body font-sans text-text-primary mb-2 focus:outline-none focus:border-accent placeholder:text-text-muted"
                />
              ))}
              <div className="flex gap-2 mt-2">
                {pollOptions.length < 4 && (
                  <Button size="sm" variant="ghost" onClick={() => setPollOptions([...pollOptions, ''])}>
                    + Add Option
                  </Button>
                )}
                <div className="flex-1" />
                <Button size="sm" variant="ghost" onClick={() => setShowPollForm(false)}>Cancel</Button>
                <Button size="sm" onClick={handleCreatePoll}>Create Poll</Button>
              </div>
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="bg-bg-surface border-t border-border-subtle p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPollForm(!showPollForm)}
              className="w-9 h-9 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-overlay transition-colors"
              title="Create Poll"
            >
              📊
            </button>
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-bg-base border border-border-subtle rounded-md px-4 py-2.5 text-body font-sans text-text-primary focus:outline-none focus:border-accent placeholder:text-text-muted"
            />
            <Button size="sm" onClick={handleSend} disabled={!messageInput.trim() || sending}>
              Send
            </Button>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
