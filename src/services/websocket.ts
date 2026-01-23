// WebSocket service for real-time message delivery

import { useAuthStore } from "~/stores/auth-store";
import { UnifiedMessage } from "~/types/message";

const WS_URL = (import.meta as any).env?.VITE_WS_URL || "ws://localhost:3001";

export type WebSocketEventType =
  | "message:new"
  | "message:read"
  | "ticket:updated"
  | "agent:typing";

export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  data: T;
}

export type WebSocketMessageHandler = (message: UnifiedMessage) => void;
export type WebSocketEventHandler = (event: WebSocketEvent) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers = new Set<WebSocketMessageHandler>();
  private eventHandlers = new Map<
    WebSocketEventType,
    Set<WebSocketEventHandler>
  >();
  private isIntentionallyClosed = false;

  connect(): void {
    const user = useAuthStore.getState().user;
    if (!user) {
      console.warn("Cannot connect WebSocket: user not authenticated");
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(`${WS_URL}?userId=${user.id}`);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const wsEvent: WebSocketEvent = JSON.parse(event.data);
        this.handleEvent(wsEvent);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");
      if (!this.isIntentionallyClosed) {
        this.attemptReconnect();
      }
    };
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(
        `Reconnecting WebSocket in ${delay}ms (attempt ${this.reconnectAttempts})`,
      );
      setTimeout(() => this.connect(), delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  private handleEvent(event: WebSocketEvent): void {
    // Handle message:new events with message handlers
    if (event.type === "message:new") {
      this.messageHandlers.forEach((handler) =>
        handler(event.data as UnifiedMessage),
      );
    }

    // Handle all events with type-specific handlers
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }
  }

  // Subscribe to new messages
  onMessage(handler: WebSocketMessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  // Subscribe to specific event types
  on(
    eventType: WebSocketEventType,
    handler: WebSocketEventHandler,
  ): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);

    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  // Send a message through WebSocket
  send(event: WebSocketEvent): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn("WebSocket is not connected. Cannot send message.");
    }
  }

  // Send typing indicator
  sendTyping(ticketId: string, isTyping: boolean): void {
    this.send({
      type: "agent:typing",
      data: { ticketId, isTyping },
    });
  }
}

export const wsService = new WebSocketService();
