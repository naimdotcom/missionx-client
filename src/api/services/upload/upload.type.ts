export interface FileUploadPayload {
  file: File;
  sub_type?: string;
  context_id?: string;
  context_type?: "app" | "user" | "org" | "conv" | "instagram" | "facebook";
}
