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

export const fileUpload = (
  payload: FileUploadPayload,
  options?: RequestOptions,
) => {
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
};

export const getAllMedia = (params?: MediaParams, options?: RequestOptions) => {
  return appClient.get<MediaResponse>(
    API_ENDPOINTS.UPLOAD.ALL_MEDIA,
    params,
    options,
  );
};

export const deleteMedia = (
  payload: DeleteMediaPayload,
  options?: RequestOptions,
) => {
  return appClient.delete(API_ENDPOINTS.UPLOAD.DELETE, payload, options);
};
