import { useMutation } from "@tanstack/react-query";
import { RequestOptions } from "../../core/api.types";
import { uploadService } from "./upload.service";
import { FileUploadPayload } from "./upload.type";

export function useFileUpload() {
  return useMutation({
    mutationFn: (apiPayload: {
      payload: FileUploadPayload;
      options?: RequestOptions;
    }) => uploadService.fileUpload(apiPayload.payload, apiPayload.options),
  });
}
