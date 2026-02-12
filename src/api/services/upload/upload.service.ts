import { RequestOptions } from "@/api/core/api.types";
import { BaseAPIService } from "@/api/core/base.service";
import { API_ENDPOINTS } from "@/api/endpoints";
import { env } from "@/lib/env";
import { FileUploadPayload } from "./upload.type";

export class UploadService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  fileUpload = (payload: FileUploadPayload, options?: RequestOptions) => {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("app_id", payload.app_id);
    if (payload.metadata) {
      Object.entries(payload.metadata).forEach(([key, value]) => {
        formData.append(`metadata[${key}]`, JSON.stringify(value));
      });
    }

    return this.upload(API_ENDPOINTS.UPLOAD.FILE, formData, options);
  };
}

export const uploadService = new UploadService(env.appUrl || "");
