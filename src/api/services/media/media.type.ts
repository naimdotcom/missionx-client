export interface FileUploadPayload {
  file: File;
  sub_type?: string;
  context_id?: string;
  context_type?: "app" | "user" | "org" | "conv" | "instagram" | "facebook";
}

export interface FileUploadResponse {
  id?: string;
  owner_type?: string;
  owner_id?: string;
  app_id?: string;
  name?: string;
  file_size?: number;
  media_type?: string;
  mime_type?: string;
  public_url?: string;
  file_path?: string;
  file_key?: string;
  bucket?: string;
  platform_meta?: null;
  created_at?: string;
  attendant?: { id?: string; name?: string };
  metadata?: { compression?: { status?: string } };
}

export interface Media {
  id?: string;
  owner_type?: string;
  owner_id?: string;
  app_id?: string;
  name?: string;
  file_size?: number;
  media_type?: string;
  mime_type?: string;
  public_url?: string;
  file_path?: string;
  file_key?: string;
  bucket?: string;
  attendant?: {
    id?: string;
    name?: string;
  };
  metadata?: {
    compression?: {
      ratio?: string;
      status?: string;
      processed_at?: string;
      original_size?: number;
      optimized_size?: number;
      savings_percent?: number;
    };
  };
  platform_meta?: {
    meta_attachments?: [
      {
        platform?: string;
        created_at?: string;
        platform_id?: string;
        attachment_id?: string;
      },
    ];
  };
  created_at?: string;
}

export interface MediaResponse {
  items: Array<Media>;
  pagination: { page?: number; limit?: number; total?: number; pages?: number };
  filters: {
    context_type?: string;
    context_id?: string;
    media_type?: string;
    mime_type?: string;
    search?: string;
  };
}

export interface MediaParams {
  context_type?:
    | "app"
    | "user"
    | "org"
    | "conv"
    | "instagram"
    | "facebook"
    | "whatsapp"
    | "telegram";
  context_id?: string;
  media_id?: string;
  filepath?: string;
  media_type?: string;
  mime_type?: string;
  search?: string;
  page?: number;
  limit?: number;
  app_id?: string;
}

export interface DeleteMediaPayload {
  media_id: string;
  filepath: string;
}
