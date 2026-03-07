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
    const queryParams = new URLSearchParams();
    formData.append("file", payload.file);
    if (payload.context_id) {
      queryParams.append("context_id", payload.context_id);
    }
    if (payload.context_type) {
      queryParams.append("context_type", payload.context_type);
    }

    const uploadUrl = `${API_ENDPOINTS.UPLOAD.FILE}?${queryParams.toString()}`;

    return this.upload(uploadUrl, formData, options);
  };
}

export const uploadService = new UploadService(env.appUrl || "");
