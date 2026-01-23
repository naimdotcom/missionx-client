// Omni-replier component - the heart of the agent experience

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useSendMessage } from "~/hooks/use-messages";
import { useUpload } from "~/hooks/use-upload";
import { ChannelType } from "~/types/message";
// import { AttachmentUploader } from "./attachment-uploader";
import { ChannelContext } from "./channel-context";
import { RichTextInput } from "./rich-text-input";

interface OmniReplierProps {
  ticketId: string;
  channelType: ChannelType;
}

export const OmniReplier = ({ ticketId, channelType }: OmniReplierProps) => {
  const [text, setText] = useState("");
  const { uploads, removeUpload, clearUploads } = useUpload();
  const sendMessage = useSendMessage();

  const handleSend = async () => {
    if (!text.trim() && uploads.length === 0) return;

    try {
      await sendMessage.mutateAsync({
        ticketId,
        text: text.trim(),
        attachments: uploads.filter((att) => att.status === "uploaded"),
      });

      // Clear after successful send
      setText("");
      clearUploads();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4 space-y-3">
      {/* Channel-specific context banner */}
      <ChannelContext channelType={channelType} currentLength={text.length} />

      {/* Attachment preview */}
      {uploads.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {uploads.map((attachment) => (
            <div
              key={attachment.id}
              className="relative w-20 h-20 rounded-md border bg-muted overflow-hidden"
            >
              {attachment.type === "image" && attachment.previewUrl && (
                <img
                  src={attachment.previewUrl}
                  alt={attachment.fileName}
                  className="w-full h-full object-cover"
                />
              )}
              {attachment.status === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs">
                    {attachment.uploadProgress}%
                  </span>
                </div>
              )}
              <button
                onClick={() => removeUpload(attachment.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-2">
        <RichTextInput
          value={text}
          onChange={setText}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          channelType={channelType}
        />

        {/* <AttachmentUploader onUpload={startUpload} channelType={channelType} /> */}

        <Button
          onClick={handleSend}
          disabled={
            (!text.trim() && uploads.length === 0) || sendMessage.isPending
          }
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Keyboard shortcut hint */}
      <p className="text-xs text-muted-foreground">
        Press <kbd className="px-1 rounded bg-muted">Ctrl</kbd> +{" "}
        <kbd className="px-1 rounded bg-muted">Enter</kbd> to send
      </p>
    </div>
  );
};
