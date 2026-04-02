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
  const [groupsPanelOpen, setGroupsPanelOpen] = useState(true);

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

  // Collapse panels when entering call, restore when leaving
  useEffect(() => {
    if (mainView === 'call') {
      setGroupsPanelOpen(false);
      window.dispatchEvent(new CustomEvent('group-call-mode', { detail: { active: true } }));
    } else {
      setGroupsPanelOpen(true);
      window.dispatchEvent(new CustomEvent('group-call-mode', { detail: { active: false } }));
    }
    return () => {
      window.dispatchEvent(new CustomEvent('group-call-mode', { detail: { active: false } }));
    };
  }, [mainView]);

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
      fetchMessages(activeGroup);
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
    if (mainView === 'call') return; // stay in call view
    setMainView('chat');
    navigate(`/groups/${gId}`, { replace: true });
  };

  const activeGroupInfo = groups.find((g) => g.groupId === activeGroup);
  const isCallMode = mainView === 'call';

  return (
    <div className="dgp-container">
      {/* ── Groups Panel (slides in / out) ── */}
      <div className={clsx('dgp-groups-panel', !groupsPanelOpen && 'dgp-groups-panel--hidden')}>
        <div className="dgp-groups-header">
          <h2 className="dgp-groups-title">Groups</h2>
          <button
            onClick={() => setGroupsPanelOpen(false)}
            className="dgp-icon-btn"
            title="Hide groups panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>
        <div className="dgp-groups-list">
          {groups.map((group) => (
            <button
              key={group.groupId}
              onClick={() => handleGroupClick(group.groupId)}
              className={clsx('dgp-group-item', activeGroup === group.groupId && 'dgp-group-item--active')}
            >
              {activeGroup === group.groupId && (
                <span className="dgp-group-indicator" style={{ backgroundColor: group.color }} />
              )}
              <div className="dgp-group-icon" style={{ backgroundColor: `${group.color}20` }}>
                <span>{GROUP_ICONS[group.groupId] || '💬'}</span>
              </div>
              <div className="dgp-group-info">
                <p className="dgp-group-name">{group.name}</p>
                {group.lastMessage && (
                  <p className="dgp-group-last-msg">
                    {group.lastMessage.senderName}: {group.lastMessage.content}
                  </p>
                )}
              </div>
            </button>
          ))}
          {loadingGroups && (
            <div className="dgp-loading">
              <div className="dgp-spinner" />
            </div>
          )}
        </div>
      </div>

      {/* ── Expand groups strip (inline, always clickable) ── */}
      {!groupsPanelOpen && (
        <div className="dgp-expand-strip">
          <button
            onClick={() => setGroupsPanelOpen(true)}
            className="dgp-expand-btn"
            title="Show groups panel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="dgp-main">
        {/* Header Bar */}
        <div className={clsx('dgp-header', isCallMode && 'dgp-header--call')}>
          <div className="dgp-header-left">
            <div className="dgp-header-icon" style={{ backgroundColor: `${GROUP_COLORS[activeGroup] || '#00D4FF'}20` }}>
              <span>{GROUP_ICONS[activeGroup] || '💬'}</span>
            </div>
            <div>
              <p className="dgp-header-name">{activeGroupInfo?.name || activeGroup}</p>
              <p className="dgp-header-meta">{activeGroupInfo?.totalMessages || 0} messages</p>
            </div>
          </div>
          <div className="dgp-header-tabs">
            <button
              className={clsx('dgp-tab', mainView === 'chat' && 'dgp-tab--active')}
              onClick={() => setMainView('chat')}
            >
              Chat
            </button>
            <button
              className={clsx('dgp-tab', mainView === 'lounge' && 'dgp-tab--active')}
              onClick={() => setMainView('lounge')}
            >
              Study Lounge
            </button>
            <button
              className={clsx('dgp-tab dgp-tab--call', mainView === 'call' && 'dgp-tab--active')}
              onClick={() => setMainView('call')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Group Call
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {mainView === 'lounge' ? (
          <div className="dgp-content">
            <StudyLounge groupId={activeGroup} />
          </div>
        ) : mainView === 'call' ? (
          <div className="dgp-content dgp-content--call">
            <GroupCall roomName={`group-${activeGroup}`} />
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="dgp-messages">
              {loadingMessages ? (
                <div className="dgp-messages-empty">
                  <div className="dgp-spinner" />
                </div>
              ) : messages.length === 0 ? (
                <div className="dgp-messages-empty">
                  <div className="dgp-messages-empty-inner">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <p className="dgp-empty-title">No messages yet</p>
                    <p className="dgp-empty-subtitle">Be the first to start a conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.userId?._id === user?._id;
                  return (
                    <div key={msg._id} className="dgp-msg">
                      <div
                        className="dgp-msg-avatar"
                        style={{ backgroundColor: `${GROUP_COLORS[activeGroup] || '#00D4FF'}15` }}
                      >
                        <span className="dgp-msg-avatar-letter" style={{ color: GROUP_COLORS[activeGroup] }}>
                          {msg.userId?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="dgp-msg-body">
                        <div className="dgp-msg-meta">
                          <span className={clsx('dgp-msg-name', isMe && 'dgp-msg-name--me')}>
                            {msg.userId?.name || 'Unknown'}
                          </span>
                          <span className="dgp-msg-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {msg.type === 'text' && (
                          <p className="dgp-msg-text">{msg.content}</p>
                        )}

                        {msg.type === 'poll' && msg.poll && (
                          <div className="dgp-poll">
                            <p className="dgp-poll-question">📊 {msg.poll.question}</p>
                            <div className="dgp-poll-options">
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
                                    className="dgp-poll-option"
                                  >
                                    <div
                                      className="dgp-poll-bar"
                                      style={{
                                        width: `${pct}%`,
                                        backgroundColor: GROUP_COLORS[activeGroup] || '#00D4FF',
                                      }}
                                    />
                                    <span className="dgp-poll-option-text">{opt.text}</span>
                                    <span className="dgp-poll-option-count">{voteCount} ({pct}%)</span>
                                  </button>
                                );
                              })}
                            </div>
                            {msg.poll.closed && (
                              <p className="dgp-poll-closed">Poll closed</p>
                            )}
                          </div>
                        )}

                        {msg.type === 'file' && msg.attachments?.map((att, i) => (
                          <a
                            key={i}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dgp-file-link"
                          >
                            <span>{att.type === 'image' ? '🖼️' : '📄'}</span>
                            <span>{att.filename}</span>
                          </a>
                        ))}

                        {msg.type === 'system' && (
                          <p className="dgp-msg-system">{msg.content}</p>
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
              <div className="dgp-poll-form">
                <div className="dgp-poll-form-inner">
                  <p className="dgp-poll-form-title">Create a Poll</p>
                  <input
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    className="dgp-input"
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
                      className="dgp-input dgp-input--option"
                    />
                  ))}
                  <div className="dgp-poll-form-actions">
                    {pollOptions.length < 4 && (
                      <Button size="sm" variant="ghost" onClick={() => setPollOptions([...pollOptions, ''])}>
                        + Add Option
                      </Button>
                    )}
                    <div style={{ flex: 1 }} />
                    <Button size="sm" variant="ghost" onClick={() => setShowPollForm(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleCreatePoll}>Create Poll</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Input bar */}
            <div className="dgp-input-bar">
              <button
                onClick={() => setShowPollForm(!showPollForm)}
                className="dgp-icon-btn"
                title="Create Poll"
              >
                📊
              </button>
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="dgp-chat-input"
              />
              <Button size="sm" onClick={handleSend} disabled={!messageInput.trim() || sending}>
                Send
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
