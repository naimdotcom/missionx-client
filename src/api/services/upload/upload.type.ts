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
