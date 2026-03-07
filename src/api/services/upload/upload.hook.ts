import { useMutation } from "@tanstack/react-query";
import { uploadService } from "./upload.service";
import { FileUploadPayload } from "./upload.type";

export function useFileUpload() {
  return useMutation({
    mutationFn: (payload: FileUploadPayload) =>
      uploadService.fileUpload(payload),
  });
}
