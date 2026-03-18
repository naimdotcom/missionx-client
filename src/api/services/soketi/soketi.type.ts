import { Message } from "../inbox/inbox.type";

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

export interface SoketiNewCommentPayload {
  comment_id: string;
  post_id: string;
  conversation_id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export interface SokетiFeedbackReceivedPayload {
  feedback_id: string;
  conversation_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface SoketiNewMessagePayload {
  message: Message;
  channel?: {
    id: string;
    platform: string;
    platform_page_id: string;
    is_active: boolean;
  };
  conversation?: { id?: string; status?: string; external_id?: string };
  customer?: {
    platform_id?: string;
    display_name?: string;
    profile_pic_url?: string;
  };
}

// ─── Typed Event Map ──────────────────────────────────────────────────────────
// Add new event types here — the service and hooks get full type inference automatically.

export interface SoketiEventMap {
  new_message: SoketiNewMessagePayload;
  message_read: SoketiMessageReadPayload;
  customer_updated: SoketiCustomerUpdatedPayload;
  new_comment: SoketiNewCommentPayload;
  feedback_received: SokетiFeedbackReceivedPayload;
}
