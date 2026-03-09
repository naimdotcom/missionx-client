import { RequestOptions } from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadService } from "./media.service";
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
    }) => uploadService.fileUpload(payload.apiPayload, payload.options),
  });
}

export function useAllMedia(params?: MediaParams, options?: RequestOptions) {
  return useQuery({
    queryKey: ["media", params],
    queryFn: () => uploadService.getAllMedia(params, options),
  });
}

export function useDeleteMedia() {
  return useMutation({
    mutationFn: (payload: {
      apiPayload: DeleteMediaPayload;
      options?: RequestOptions;
    }) => uploadService.deleteMedia(payload.apiPayload, payload.options),
  });
}
