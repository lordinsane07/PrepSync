import api from './api';

export async function getLiveKitToken(roomName: string): Promise<{ token: string }> {
  const { data } = await api.get(`/livekit/token/${encodeURIComponent(roomName)}`);
  return data;
}
