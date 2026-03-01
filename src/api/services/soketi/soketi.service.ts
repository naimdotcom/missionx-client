import { API_ENDPOINTS } from "@/api";
import { env } from "@/lib/env";
import Pusher, { Channel } from "pusher-js";
import { SoketiEventMap } from "./soketi.type";

// ─── Internal event emitter type ─────────────────────────────────────────────

type EventHandler<T> = (data: T) => void;
type AnyHandler = EventHandler<unknown>;

// All Pusher events the service bridges to the internal emitter.
// To support a new module, add its event name + payload to SoketiEventMap.
const BRIDGED_EVENTS = [
  "new_message",
  "message_read",
  "customer_updated",
  "new_comment",
  "feedback_received",
] as const satisfies ReadonlyArray<keyof SoketiEventMap>;

// ─── Service ──────────────────────────────────────────────────────────────────

class SoketiService {
  private pusher: Pusher | null = null;
  private channel: Channel | null = null;
  private currentAppId: string | null = null;

  // Internal typed listener registry — survives reconnections
  private listeners = new Map<string, Set<AnyHandler>>();

  // ── Connection ─────────────────────────────────────────────────────────────

  connect(appId: string): void {
    // Re-use existing connection if same app
    if (this.pusher && this.currentAppId === appId) return;

    this.disconnect();

    console.debug("[Soketi] Connecting with app:", appId);

    const authUrl = `${env.authUrl}${API_ENDPOINTS.AUTH.SOKETI}`;

    this.pusher = new Pusher(env.pusherAppKey ?? "", {
      cluster: "mt1", // required by pusher-js SDK type; safely ignored by Soketi
      wsHost: env.pusherHost,
      wsPath: "/soketi",
      enabledTransports: ["ws", "wss"],
      // Custom authorizer — mirrors axios withCredentials: true
      // Automatically sends all browser cookies (including httpOnly) to the auth endpoint
      authorizer: (channel) => ({
        authorize: (socketId, callback) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", authUrl, true);
          xhr.withCredentials = true; // ← sends browser cookies automatically
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded",
          );
          xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
              try {
                callback(null, JSON.parse(xhr.responseText));
              } catch {
                callback(new Error("[Soketi] Invalid auth response"), null);
              }
            } else {
              callback(
                new Error(`[Soketi] Auth failed with status ${xhr.status}`),
                null,
              );
            }
          };
          xhr.send(
            `socket_id=${encodeURIComponent(socketId)}&channel_name=${encodeURIComponent(channel.name)}`,
          );
        },
      }),
    });

    this.pusher.connection.bind("connected", () => {
      console.debug("[Soketi] Connection established");
    });
    this.pusher.connection.bind("error", (err: unknown) => {
      console.error("[Soketi] Connection error:", err);
    });
    this.pusher.connection.bind("disconnected", () => {
      console.debug("[Soketi] Disconnected");
    });

    this.channel = this.pusher.subscribe(`private-app-${appId}`);
    this.currentAppId = appId;

    this.channel.bind("pusher:subscription_succeeded", () => {
      console.debug("[Soketi] ✅ Subscribed to private-app-" + appId);
    });
    this.channel.bind("pusher:subscription_error", (err: unknown) => {
      console.error("[Soketi] ❌ Subscription failed:", err);
    });

    // Bridge all Pusher channel events → internal emitter
    // Any registered listener (from any module) receives the event automatically
    BRIDGED_EVENTS.forEach((event) => {
      this.channel?.bind(event, (data: unknown) => this.emit(event, data));
    });
  }

  // ── Typed pub/sub ─────────────────────────────────────────────────────────
  // Modules call `soketiService.on("new_message", handler)` and get full type inference.
  // Multiple modules can subscribe to the same event independently.

  on<K extends keyof SoketiEventMap>(
    event: K,
    handler: EventHandler<SoketiEventMap[K]>,
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const h = handler as AnyHandler;
    this.listeners.get(event)!.add(h);
    return () => this.listeners.get(event)?.delete(h);
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((h) => h(data));
  }

  // ── Teardown ──────────────────────────────────────────────────────────────

  /**
   * Fully tear down the WebSocket connection.
   * Listeners are kept — they re-activate on the next `connect()` call.
   * Call on app switch or logout.
   */
  disconnect(): void {
    if (this.channel && this.currentAppId) {
      this.channel.unbind_all();
      this.pusher?.unsubscribe(`private-app-${this.currentAppId}`);
    }
    if (this.pusher) {
      this.pusher.disconnect();
      this.pusher = null;
    }
    this.channel = null;
    this.currentAppId = null;
    console.debug("[Soketi] Disconnected");
  }

  /**
   * Full teardown including all listeners.
   * Call only on user logout to fully clean up state.
   */
  destroy(): void {
    this.disconnect();
    this.listeners.clear();
    console.debug("[Soketi] Destroyed");
  }

  get isConnected(): boolean {
    return this.pusher?.connection.state === "connected";
  }
}

export const soketiService = new SoketiService();
