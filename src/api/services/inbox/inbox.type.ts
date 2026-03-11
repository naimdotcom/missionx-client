import { ChannelPlatform } from "../channels";

export interface ConversationTicketsParams {
  app_id: string;
  "channel-id"?: string;
  status?: "ONGOING" | "DONE" | "PENDING";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ConversationChannel {
  id?: string;
  platform?: ChannelPlatform;
  account_name?: string;
  instagram_username?: string | null;
  profile_pic_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface ConversationTicket {
  id?: string;
  channel_id?: string;
  platform?: ChannelPlatform;
  channel?: ConversationChannel;
  customer_name?: string;
  customer_profile_pic?: string;
  customer_platform_id?: string;
  status?: "ONGOING" | "DONE" | "PENDING";
  last_message_text?: string;
  last_message_time?: string;
  unread_count?: number;
  total_unseen_count?: number;
  created_at?: string;
  updated_at?: string;
  agent_last_read_at?: string;
  agent_last_message_mid?: string;
  customer_last_message_mid?: string;
  customer_last_read_at?: string;
  customer_unread_count?: number;
}

export interface ConversationTickets {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  conversations: ConversationTicket[];
}

export interface ConversationHistoryParams {
  page?: number;
  limit?: number;
  before_id?: string;
  before_time?: string;
}

export interface Conversation {
  id: string;
  mid?: string;
  type?: string;
  sender?: string;
  post_id?: string;
  sender_id?: string;
  sentiment?: string;
  is_hidden?: string;
  is_replied?: string;
  created_at?: string;
  reply_to_mid?: string;
  content_type?: string;
  conversation_id?: string;
  parent_comment_id?: string;
  replied_to_content?: ReplyToConversation;
  attendant?: { id: string; name: string };
  content?: { text?: string; attachments?: Array<ConversationAttachment> };
}

export interface ReplyToConversation {
  id?: string;
  sender_id?: string;
  created_at?: string;
  conversation_id?: string;
  content?: { text?: string; attachments?: Array<ConversationAttachment> };
}

export interface ConversationAttachment {
  type?: string;
  meta_url?: string;
  payload: { url?: string; sticker_id?: string; original_url?: string };
}

export interface ConversationHistory {
  items?: Conversation[];
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
  limit?: number;
  count?: number;
  has_older?: boolean;
  has_newer?: boolean;
  before_cursor?: string;
  after_cursor?: string;
}

export interface SendMessagePayload {
  conversation_id: string;
  message_type: "standard" | "message" | "comment";
  payload?: {
    text?: string;
    attachments?: {
      type: string;
      url: string;
      attachment_id: string;
      is_reusable?: boolean;
    }[];
  };
  // flow?: { flownode_id: string };
  // template: {
  //   type: "receipt";
  //   receipt: {
  //     recipient_name: string;
  //     order_number: string;
  //     currency: string;
  //     payment_method: string;
  //     elements: [
  //       {
  //         title: string;
  //         subtitle: string;
  //         quantity: number;
  //         price: number;
  //         currency: string;
  //         image_url: string;
  //       },
  //     ];
  //     summary: {
  //       subtotal: number;
  //       shipping_cost: number;
  //       total_tax: number;
  //       total_cost: number;
  //     };
  //     timestamp: string;
  //     order_url: string;
  //     address: {
  //       street_1: string;
  //       street_2: string;
  //       city: string;
  //       postal_code: string;
  //       state: string;
  //       country: string;
  //     };
  //     adjustments: [
  //       {
  //         name: string;
  //         amount: number;
  //       },
  //     ];
  //   };
  //   button: {
  //     text: string;
  //     buttons: [
  //       {
  //         type: "web_url";
  //         title: string;
  //         url: string;
  //         payload: string;
  //       },
  //     ];
  //   };
  //   carousel: {
  //     elements: [
  //       {
  //         title: string;
  //         subtitle: string;
  //         image_url: string;
  //         buttons: [
  //           {
  //             type: "web_url";
  //             title: string;
  //             url: string;
  //             payload: string;
  //           },
  //         ];
  //       },
  //     ];
  //   };
  //   quick_reply: {
  //     text: string;
  //     quick_replies: [
  //       {
  //         content_type: "text";
  //         title: string;
  //         payload: string;
  //         image_url: string;
  //       },
  //     ];
  //   };
  // };
  // feedback: {
  //   title: string;
  //   subtitle: string;
  //   button_title: string;
  //   feedback_screens: [
  //     {
  //       questions: [
  //         {
  //           id: string;
  //           type: "csat";
  //           title: string;
  //           score_label: "neg_pos";
  //           score_option: "five_stars";
  //           follow_up: {
  //             type: "free_form";
  //             placeholder: string;
  //           };
  //         },
  //       ];
  //     },
  //   ];
  //   business_privacy: {
  //     url: string;
  //   };
  //   expires_in_days: number;
  //   use_message_tag: boolean;
  // };
  reply_to_mid: string;
}

export interface MessageSendResponse {
  error?: string;
  platform?: string;
  success?: boolean;
  conversation_id?: string;
}
