import { ChannelPlatform } from "../channels";

export type Customers = {
  app_fields: APPField;
  customers: Customer[];
};

export type APPField = {
  app_id?: string;
  created_at?: string;
  updated_at?: string;
  fields: Array<{
    key?: string;
    locked?: boolean;
    name?: string;
    position?: number;
    required?: boolean;
    source?: string;
    type?: string;
    visible?: boolean;
    width?: number;
  }>;
};

export type Customer = {
  id: string | undefined;
  app_id: string | undefined;
  platform_id: string | undefined;
  platform: string | undefined;
  username: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  profile_pic_url: string | undefined;
  locale: string | undefined;
  timezone: number | undefined;
  gender: string | undefined;
  custom_metadata:
    | { id?: string; name?: string; profile_pic?: string }
    | undefined;
  attributes: Record<string, unknown> | undefined;
  tags: string[] | undefined;
  source: string | undefined;
  notes: string | undefined;
  assigned_to: string | undefined;
  lifetime_value: number | undefined;
  is_active: boolean | undefined;
  is_blocked: boolean | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;
  last_interaction_at: string | undefined;
  last_seen_at: string | undefined;
};

export type CustomerCreate = {
  app_id: string | undefined;
  platform_id: string | undefined;
  platform: string | undefined;
  username: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  profile_pic_url: string | undefined;
  locale: string | undefined;
  timezone: number | undefined;
  gender: string | undefined;
  custom_metadata: Record<string, unknown> | undefined;
  attributes: Record<string, unknown> | undefined;
  tags: string[] | undefined;
  source: string | undefined;
  notes: string | undefined;
  assigned_to: string | undefined;
  lifetime_value: number | undefined;
  is_active: boolean | undefined;
  is_blocked: boolean | undefined;
};

export type CustomerUpdate = {
  username: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  first_name: string | undefined;
  last_name: string | undefined;
  profile_pic_url: string | undefined;
  custom_metadata: Record<string, unknown> | undefined;
  attributes: Record<string, unknown> | undefined;
  tags: string[] | undefined;
  source: string | undefined;
  notes: string | undefined;
  assigned_to: string | undefined;
  lifetime_value: number | undefined;
  is_active: boolean | undefined;
  is_blocked: boolean | undefined;
};

export type CustomerListParams = {
  page: number | undefined;
  limit: number | undefined;
  app_id: string | undefined;
  q?: string | undefined;
  platform?: ChannelPlatform;
  platform_id?: string | undefined;
  username?: string | undefined;
  email?: string | undefined;
  phone?: string | undefined;
  is_active?: boolean | undefined;
  filters?: string | undefined;
};

export type CustomerQueryParams = {
  page: number | undefined;
  limit: number | undefined;
  app_id: string | undefined;
  page_id: string | undefined;
  platform_id: string | undefined;
  platform: string | undefined;
  username: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  tags: string | undefined;
  has_attribute: string | undefined;
  attribute_filter: string | undefined;
  source: string | undefined;
  is_active: boolean | undefined;
  is_blocked: boolean | undefined;
  assigned_to: string | undefined;
  q: string | undefined;
  sort_by: string | undefined;
  sort_order: string | undefined;
  date_from: string | undefined;
  date_to: string | undefined;
  filters: string | undefined;
};

export type TagUpdateRequest = {
  add: string[] | undefined;
  remove: string[] | undefined;
};

export type NotesUpdateRequest = {
  notes: string | undefined;
};

export type AttributeUpdate = {
  key: string | undefined;
  value: unknown | undefined;
};

export type BulkAttributeUpdateRequest = {
  attributes: Record<string, unknown> | undefined;
};

export type ExportRequest = {
  app_id: string | undefined;
  format: "csv" | "json" | undefined;
  filters: Record<string, unknown> | undefined;
  columns?: string[] | undefined;
  fields: string[] | undefined;
};

export type IdentifyCustomerRequest = {
  access_token: string | undefined;
  platform_id: string | undefined;
  platform: string | undefined;
  app_id: string | undefined;
};

// Segments

export type SegmentFilter = {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "in"
    | "not_in";
  value: any;
};

export type SegmentResponse = {
  id: string;
  app_id: string;
  name: string;
  description: string | undefined;
  filters: SegmentFilter[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SegmentCreate = {
  name: string;
  description?: string;
  filters: SegmentFilter[];
  is_active?: boolean;
};

export type SegmentUpdate = Partial<SegmentCreate>;

export type SegmentListParams = {
  page?: number;
  limit?: number;
  q?: string;
  is_active?: boolean;
};

export interface InboxCustomerPayload {
  customer_id: string;
  app_id: string;
  page?: string;
  limit?: string;
}
