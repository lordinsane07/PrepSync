import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

// ===== Peer Room helpers =====

export function joinRoom(roomId: string, displayName: string): void {
  getSocket().emit('room:join', { roomId, displayName });
}

export function leaveRoom(roomId: string): void {
  getSocket().emit('room:leave', { roomId });
}

export function sendRoomMessage(roomId: string, content: string, displayName: string): void {
  getSocket().emit('room:message', { roomId, content, displayName });
}

export function switchRoomRole(roomId: string): void {
  getSocket().emit('room:role-switch', { roomId });
}

// ===== WebRTC Signaling helpers =====

export function sendWebRTCOffer(roomId: string, offer: RTCSessionDescriptionInit): void {
  getSocket().emit('webrtc:offer', { roomId, offer });
}

export function sendWebRTCAnswer(roomId: string, answer: RTCSessionDescriptionInit): void {
  getSocket().emit('webrtc:answer', { roomId, answer });
}

export function sendICECandidate(roomId: string, candidate: RTCIceCandidateInit): void {
  getSocket().emit('webrtc:ice-candidate', { roomId, candidate });
}

// ===== Group Chat helpers =====

export function joinGroup(groupId: string): void {
  getSocket().emit('group:join', { groupId });
}

export function leaveGroup(groupId: string): void {
  getSocket().emit('group:leave', { groupId });
}

export function sendGroupMessage(groupId: string, userId: string, content: string, displayName: string): void {
  getSocket().emit('group:message', { groupId, userId, content, displayName });
}

export function sendGroupTyping(groupId: string, displayName: string): void {
  getSocket().emit('group:typing', { groupId, displayName });
}

// ===== DM helpers =====

export function joinDMThread(threadId: string): void {
  getSocket().emit('dm:join', { threadId });
}

export function leaveDMThread(threadId: string): void {
  getSocket().emit('dm:leave', { threadId });
}

export function sendDM(threadId: string, senderId: string, content: string): void {
  getSocket().emit('dm:message', { threadId, senderId, content });
}

export function sendDMTyping(threadId: string, displayName: string): void {
  getSocket().emit('dm:typing', { threadId, displayName });
}

// ===== Editor/Whiteboard helpers =====

export function joinEditor(roomId: string): void {
  getSocket().emit('editor:join', { roomId });
}

export function sendEditorUpdate(roomId: string, update: Uint8Array): void {
  getSocket().emit('editor:update', { roomId, update });
}

export function joinWhiteboard(roomId: string): void {
  getSocket().emit('whiteboard:join', { roomId });
}

export function sendWhiteboardUpdate(roomId: string, objects: any): void {
  getSocket().emit('whiteboard:update', { roomId, objects });
}
