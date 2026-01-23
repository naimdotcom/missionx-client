// Attachment uploader with drag & drop support

import { Paperclip } from "lucide-react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { ChannelNormalizer } from "~/services/channel-normalizer";
import { ChannelType } from "~/types/message";

interface AttachmentUploaderProps {
  onUpload: (file: File) => Promise<void>;
  channelType: ChannelType;
}

export const AttachmentUploader = ({
  onUpload,
  channelType,
}: AttachmentUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const constraints = ChannelNormalizer.getChannelConstraints(channelType);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (file.size > constraints.maxFileSize) {
        alert(
          `File "${file.name}" is too large. Maximum size is ${formatFileSize(constraints.maxFileSize)}.`,
        );
        continue;
      }

      // Validate MIME type
      if (!constraints.allowedMimeTypes.includes(file.type)) {
        alert(
          `File "${file.name}" type is not supported for ${channelType.replace("_", " ")}.`,
        );
        continue;
      }

      try {
        await onUpload(file);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => inputRef.current?.click()}
        title="Attach file"
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={constraints.allowedMimeTypes.join(",")}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </>
  );
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
