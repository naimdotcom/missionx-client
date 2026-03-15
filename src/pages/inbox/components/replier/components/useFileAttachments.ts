import { useFileUpload } from "@/api/services/media/media.hook";
import { useAuthStore } from "@/stores/auth-store";
import { useCallback, useEffect, useState } from "react";

export type UploadStatus = "pending" | "uploading" | "uploaded" | "failed";

export interface AttachmentUpload {
  id: string;
  file: File;
  previewUrl?: string;
  status: UploadStatus;
  progress: number;
  uploadedUrl?: string;
  attachmentId?: string;
  error?: string;
}

export function useFileAttachments(selectedTicketId?: string) {
  const [attachments, setAttachments] = useState<AttachmentUpload[]>([]);
  const { selectedApp } = useAuthStore();
  const fileUploadMutation = useFileUpload();

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => {
        if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAttachment = useCallback(
    (id: string, updates: Partial<AttachmentUpload>) => {
      setAttachments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      );
    },
    [],
  );

  const uploadFile = useCallback(
    async (attachment: AttachmentUpload) => {
      if (!selectedApp?.id) return;

      updateAttachment(attachment.id, { status: "uploading", progress: 0 });

      try {
        const result = await fileUploadMutation.mutateAsync({
          apiPayload: {
            context_type: "conv",
            file: attachment.file,
            context_id: selectedTicketId,
          },
          options: {
            onUploadProgress: (progressEvent: ProgressEvent) => {
              const progress = progressEvent.total
                ? Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                  )
                : 0;
              updateAttachment(attachment.id, { progress });
            },
          },
        });

        updateAttachment(attachment.id, {
          progress: 100,
          attachmentId: result?.id,
          uploadedUrl: result?.public_url,
          status: "uploaded",
        });
      } catch (error) {
        console.error("Upload failed:", error);
        updateAttachment(attachment.id, {
          status: "failed",
          error: "Upload failed. Click to retry.",
        });
      }
    },
    [fileUploadMutation, selectedApp?.id, selectedTicketId, updateAttachment],
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const newAttachments: AttachmentUpload[] = files.map((file) => ({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        status: "pending" as UploadStatus,
        progress: 0,
      }));

      setAttachments((prev) => [...prev, ...newAttachments]);
      newAttachments.forEach((a) => uploadFile(a));
    },
    [uploadFile],
  );

  const retryUpload = useCallback(
    (id: string) => {
      const attachment = attachments.find((a) => a.id === id);
      if (attachment) uploadFile(attachment);
    },
    [attachments, uploadFile],
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    attachments.forEach((a) => {
      if (a.previewUrl) URL.revokeObjectURL(a.previewUrl);
    });
    setAttachments([]);
  }, [attachments]);

  const hasUploading = attachments.some(
    (a) => a.status === "uploading" || a.status === "pending",
  );

  const uploaded = attachments.filter((a) => a.status === "uploaded");

  return {
    attachments,
    addFiles,
    retryUpload,
    removeAttachment,
    clearAll,
    hasUploading,
    uploaded,
  };
}
