import { ChannelPlatform } from "../channels";

export interface ConversationTicketsParams {
  app_id: string;
  "channel-id"?: string;
  status?: "ONGOING" | "DONE" | "PENDING";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ConversationTicket {
  id: string;
  channel_id: string;
  platform: ChannelPlatform;
  customer_name: string;
  customer_profile_pic: string;
  customer_platform_id: string;
  status: "ONGOING" | "DONE" | "PENDING";
  last_message_text: string;
  last_message_time: string;
  unread_count: number;
  total_unseen_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationTickets {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  conversations: ConversationTicket[];
}
