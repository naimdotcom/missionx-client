import Pusher, { Channel } from "pusher-js";

// ─── Soketi Event Payloads ────────────────────────────────────────────────────

export interface SoketiMessage {
  id: string;
  conversation_id: string;
  sender_id?: string;
  recipient_id?: string;
  message_type?: string;
  direction?: "inbound" | "outbound";
  sender_type?: string;
  content?: { text?: string };
  created_at: string;
  is_echo?: boolean;
  display_label?: string;
}

export interface SoketiNewMessagePayload {
  message: SoketiMessage;
  channel: {
    id: string;
    platform: string;
    platform_page_id: string;
  };
  conversation: {
    id: string;
    status: string;
    customer_name: string;
    customer_profile_pic: string;
    customer_platform_id: string;
  };
  customer: {
    platform_id: string;
    display_name: string;
    profile_pic_url: string;
    fetch_status: string;
  };
  app_id: string;
}

export interface SoketiMessageReadPayload {
  conversation_id: string;
  user_type: "agent" | "customer";
  user_id: string;
  unseen_count: number;
  timestamp: string;
}

export interface SoketiCustomerUpdatedPayload {
  type: string;
  customer_platform_id: string;
  customer_name: string;
  customer_profile_pic: string;
  username: string | null;
  platform: "facebook" | "instagram";
  channel_id: string;
  conversation_id: string;
  status: string;
  last_message_time: string;
  unread_count: number;
}

// ─── Soketi Service ───────────────────────────────────────────────────────────

// Config values — cluster is required by pusher-js types but ignored by Soketi
const SOKETI_APP_KEY = "mission_key";
const SOKETI_AUTH_ENDPOINT =
  "https://auth.brainchat.cloud/api/auth/soketi/auth";

class SoketiService {
  private pusher: Pusher | null = null;
  private channel: Channel | null = null;
  private currentAppId: string | null = null;

  connect(appId: string, accessToken: string): Channel {
    // Re-use existing connection if same app
    if (this.pusher && this.channel && this.currentAppId === appId) {
      return this.channel;
    }

    // Disconnect previous connection if switching apps
    this.disconnect();

    console.debug("[Soketi] Connecting with app:", appId);

    this.pusher = new Pusher(SOKETI_APP_KEY, {
      cluster: "mt1", // required by pusher-js SDK type; safely ignored by Soketi
      wsHost: "staging.brainchat.cloud",
      wsPort: 443,
      wssPort: 443,
      wsPath: "/soketi",
      forceTLS: true,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      authEndpoint: SOKETI_AUTH_ENDPOINT,
      auth: {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        // Send cookies (httpOnly) to the auth endpoint automatically
        params: {},
      },
    });

    // Pusher-js doesn't expose withCredentials natively; patch the transport
    // so the auth XHR includes cookies (needed when token is httpOnly)
    (this.pusher as any).config.auth = {
      ...((this.pusher as any).config.auth ?? {}),
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
    (this.pusher as any).config.authTransport = "ajax";
    (this.pusher as any).config.auth.withCredentials = true;

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
