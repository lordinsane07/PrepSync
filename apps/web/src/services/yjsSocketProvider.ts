import * as Y from 'yjs';
import { Socket } from 'socket.io-client';
import * as awarenessProtocol from 'y-protocols/awareness';

export class YjsSocketProvider {
  public awareness: awarenessProtocol.Awareness;
  private socket: Socket;
  private roomId: string;
  private doc: Y.Doc;

  // Track event listener references to detach them properly
  private _onUpdate: (update: Uint8Array, origin: any) => void;
  private _onAwarenessUpdate: (changes: any, origin: any) => void;
  private _onSocketEditorUpdate: (data: { update: ArrayBuffer | Uint8Array }) => void;
  private _onSocketEditorAwareness: (data: { state: ArrayBuffer | Uint8Array; clientId: string }) => void;

  constructor(socket: Socket, roomId: string, doc: Y.Doc) {
    this.socket = socket;
    this.roomId = roomId;
    this.doc = doc;
    this.awareness = new awarenessProtocol.Awareness(doc);

    // 1. Listen for local Yjs document changes and send to Socket
    this._onUpdate = (update: Uint8Array, origin: any) => {
      // Don't echo back updates we just received
      if (origin !== this) {
        this.socket.emit('editor:update', { roomId: this.roomId, update: Array.from(update) });
      }
    };
    this.doc.on('update', this._onUpdate);

    // 2. Listen for Socket updates and apply to local Yjs document
    this._onSocketEditorUpdate = (data: { update: ArrayBuffer | Uint8Array | number[] }) => {
      // The backend or socket.io might convert Uint8Array to a normal Array. We must convert it back.
      const updateData = new Uint8Array(data.update as Iterable<number>);
      Y.applyUpdate(this.doc, updateData, this);
    };
    this.socket.on('editor:update', this._onSocketEditorUpdate);

    // 3. Listen for local awareness changes (cursor, selection) and send to Socket
    this._onAwarenessUpdate = ({ added, updated, removed }: any, origin: any) => {
      if (origin !== this) {
        const changedClients = added.concat(updated, removed);
        const state = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients);
        this.socket.emit('editor:awareness', { roomId: this.roomId, state: Array.from(state) });
      }
    };
    this.awareness.on('update', this._onAwarenessUpdate);

    // 4. Listen for Socket awareness changes and apply to local awareness state
    this._onSocketEditorAwareness = (data: { state: ArrayBuffer | Uint8Array | number[]; clientId: string }) => {
      const stateData = new Uint8Array(data.state as Iterable<number>);
      awarenessProtocol.applyAwarenessUpdate(this.awareness, stateData, this);
    };
    this.socket.on('editor:awareness', this._onSocketEditorAwareness);

    // Join the specific editor socket room
    this.socket.emit('editor:join', { roomId: this.roomId });
    
    // Optional: Request sync for late joiners (though full P2P sync might need explicit sync steps in complex apps)
    // For this simple implementation, the backend would relay, but doesn't persist.
  }

  destroy() {
    this.doc.off('update', this._onUpdate);
    this.awareness.off('update', this._onAwarenessUpdate);
    this.socket.off('editor:update', this._onSocketEditorUpdate);
    this.socket.off('editor:awareness', this._onSocketEditorAwareness);
    this.awareness.destroy();
  }
}
