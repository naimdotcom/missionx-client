import { API_ENDPOINTS } from "@/api";
import { env } from "@/lib/env";
import Pusher, { Channel } from "pusher-js";

class SoketiService {
  private pusher: Pusher | null = null;
  private channel: Channel | null = null;
  private currentAppId: string | null = null;

  connect(appId: string): Channel {
    // Re-use existing connection if same app
    if (this.pusher && this.channel && this.currentAppId === appId) {
      return this.channel;
    }

    // Disconnect previous connection if switching apps
    this.disconnect();

    console.debug("[Soketi] Connecting with app:", appId);

    const authUrl = `${env.authUrl}${API_ENDPOINTS.AUTH.SOKETI}`;

    this.pusher = new Pusher(env.pusherAppKey ?? "", {
      cluster: "mt1", // required by pusher-js SDK type; safely ignored by Soketi
      wsHost: env.pusherHost,
      // wsPort: 443,
      // wssPort: 443,
      wsPath: "/soketi",
      // forceTLS: true,
      // disableStats: true,
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

    return this.channel;
  }

  on<T>(event: string, handler: (data: T) => void): () => void {
    this.channel?.bind(event, handler);
    return () => this.channel?.unbind(event, handler);
  }

  /**
   * Unbind all user event handlers without closing the WebSocket.
   * Use this in component cleanup so the connection stays alive for the session.
   */
  unbindEvents(): void {
    [
      "new_message",
      "message_read",
      "customer_updated",
      "new_comment",
      "feedback_received",
    ].forEach((event) => this.channel?.unbind(event));
  }

  /** Fully tear down the connection — call only on logout or app switch. */
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
  }

  get isConnected(): boolean {
    return this.pusher?.connection.state === "connected";
  }
}

export const soketiService = new SoketiService();
