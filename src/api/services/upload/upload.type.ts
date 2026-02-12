export interface FileUploadPayload {
  file: File;
  app_id: string;
  metadata?: Record<string, any>;
}
