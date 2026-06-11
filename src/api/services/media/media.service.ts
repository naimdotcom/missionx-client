import { RequestOptions } from "@/api/core/api.types";
import { appClient } from "@/api/core/init";
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  DeleteMediaPayload,
  FileUploadPayload,
  FileUploadResponse,
  MediaParams,
  MediaResponse,
} from "./media.type";

export const mediaService = {
  fileUpload: (payload: FileUploadPayload, options?: RequestOptions) => {
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

    return appClient.upload<FileUploadResponse>(uploadUrl, formData, options);
  },

  /**
   * Two-step presigned upload:
   * 1. Get a presigned POST policy from the backend.
   * 2. POST the file directly to MinIO using that policy.
   * 3. Call /media/complete to register the DB record.
   *
   * Returns the same FileUploadResponse shape as fileUpload().
   */
  presignedUpload: async (
    payload: FileUploadPayload,
    options?: RequestOptions,
  ): Promise<FileUploadResponse> => {
    const queryParams = new URLSearchParams({
      filename: payload.file.name,
      context_type: payload.context_type ?? "app",
      ...(payload.context_id ? { context_id: payload.context_id } : {}),
      ...(payload.sub_type ? { sub_type: payload.sub_type } : {}),
      mime_type: payload.file.type || "application/octet-stream",
    });

    // Step 1: get presigned POST policy
    const presignUrl = `${API_ENDPOINTS.UPLOAD.UPLOAD_URL}?${queryParams.toString()}`;
    const policy = await appClient.post<{
      upload_url: string;
      fields: Record<string, string>;
      bucket: string;
      file_key: string;
    }>(presignUrl);

    // Step 2: POST directly to MinIO (no auth headers — policy covers it)
    const formData = new FormData();
    for (const [k, v] of Object.entries(policy.fields)) {
      formData.append(k, v);
    }
    formData.append("file", payload.file);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", policy.upload_url);
      if (options?.onUploadProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            options.onUploadProgress!(Math.round((e.loaded / e.total) * 100));
          }
        };
      }
      xhr.onload = () => {
        // MinIO returns 204 No Content on success
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`MinIO upload failed: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("MinIO upload network error"));
      xhr.send(formData);
    });

    // Step 3: register the media record
    const completeParams = new URLSearchParams({
      file_key: policy.file_key,
      bucket: policy.bucket,
      filename: payload.file.name,
      context_type: payload.context_type ?? "app",
      ...(payload.context_id ? { context_id: payload.context_id } : {}),
      ...(payload.sub_type ? { sub_type: payload.sub_type } : {}),
      mime_type: payload.file.type || "application/octet-stream",
    });

    return appClient.post<FileUploadResponse>(
      `${API_ENDPOINTS.UPLOAD.COMPLETE}?${completeParams.toString()}`,
    );
  },

  getAllMedia: (params?: MediaParams, options?: RequestOptions) => {
    return appClient.get<MediaResponse>(
      API_ENDPOINTS.UPLOAD.ALL_MEDIA,
      params,
      options,
    );
  },

  deleteMedia: (payload: DeleteMediaPayload, options?: RequestOptions) => {
    return appClient.delete(API_ENDPOINTS.UPLOAD.DELETE, payload, options);
  },
};
