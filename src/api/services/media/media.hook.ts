import { RequestOptions } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fileUpload, getAllMedia, deleteMedia } from "./media.service";
import {
  DeleteMediaPayload,
  FileUploadPayload,
  MediaParams,
} from "./media.type";

export function useFileUpload() {
  return useMutation({
    mutationFn: (payload: {
      apiPayload: FileUploadPayload;
      options?: RequestOptions;
    }) => fileUpload(payload.apiPayload, payload.options),
  });
}

export function useAllMedia(params?: MediaParams, options?: RequestOptions) {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => getAllMedia(params, options),
  });
}

export function useDeleteMedia() {
  return useMutation({
    mutationFn: (payload: {
      apiPayload: DeleteMediaPayload;
      options?: RequestOptions;
    }) => deleteMedia(payload.apiPayload, payload.options),
  });
}
