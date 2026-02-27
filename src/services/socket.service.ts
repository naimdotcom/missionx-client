import { env } from "@/lib/env";
import { io, Socket } from "socket.io-client";

// ─── Event Types ────────────────────────────────────────────────────────────

export type SocketEventType =
  | "message:new"
  | "message:read"
  | "ticket:updated"
  | "agent:typing";

export interface SocketNewMessagePayload {
  id: string;
  conversation_id: string;
  sender?: string;
  sender_id?: string;
  type?: string;
  content?: { text?: string };
  created_at: string;
  attendant?: { id?: string; name?: string };
}

// ─── Singleton Socket Service ────────────────────────────────────────────────

class SocketService {
  private socket: Socket | null = null;

  connect(token?: string): Socket {
    if (this.socket?.connected) return this.socket;

    this.socket = io(env.socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 16000,
      auth: token ? { token } : undefined,
    });

    this.socket.on("connect", () => {
      console.debug("[Socket] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.debug("[Socket] Disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /** Join a conversation room to receive its events. */
  joinConversation(conversationId: string): void {
    this.socket?.emit("conversation:join", { conversation_id: conversationId });
  }

  /** Leave a conversation room. */
  leaveConversation(conversationId: string): void {
    this.socket?.emit("conversation:leave", {
      conversation_id: conversationId,
    });
  }

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<T = unknown>(
    event: SocketEventType,
    handler: (data: T) => void,
  ): () => void {
    this.socket?.on(event, handler as (...args: unknown[]) => void);
    return () => {
      this.socket?.off(event, handler as (...args: unknown[]) => void);
    };
  }

  get instance(): Socket | null {
    return this.socket;
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
