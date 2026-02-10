export interface Channel {
  id: string;
  type: "facebook" | "instagram";
  name: string;
  pageId: string;
  status: "connected" | "disconnected";
  lastSync?: string;
  messageCount: number;
  followers: number;
  growth: number;
  autoReply: boolean;
}
