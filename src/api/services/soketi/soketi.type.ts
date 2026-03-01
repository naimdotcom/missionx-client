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
