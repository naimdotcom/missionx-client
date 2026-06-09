import { TextPreview } from "./TextPreview";
import { QuickReplyPreview } from "./QuickReplyPreview";
import { ButtonPreview } from "./ButtonPreview";
import { GenericPreview } from "./GenericPreview";
import { MediaPreview } from "./MediaPreview";

type AnyPayload = Record<string, unknown>;

function renderSingle(payload: AnyPayload) {
  // Quick reply
  if (Array.isArray(payload.quick_replies)) {
    return (
      <QuickReplyPreview
        text={String(payload.text ?? "")}
        quick_replies={payload.quick_replies as Parameters<typeof QuickReplyPreview>[0]["quick_replies"]}
      />
    );
  }

  // Attachment-based templates
  const attachment = payload.attachment as AnyPayload | undefined;
  if (attachment && typeof attachment === "object") {
    const attachPayload = attachment.payload as AnyPayload | undefined;

    if (attachPayload) {
      const templateType = attachPayload.template_type;
      if (templateType === "button") {
        return (
          <ButtonPreview
            text={String(attachPayload.text ?? "")}
            buttons={(attachPayload.buttons as Parameters<typeof ButtonPreview>[0]["buttons"]) ?? []}
          />
        );
      }
      if (templateType === "generic") {
        return (
          <GenericPreview
            elements={(attachPayload.elements as Parameters<typeof GenericPreview>[0]["elements"]) ?? []}
          />
        );
      }
    }

    // Direct attachment (image/video/file)
    const attachType = String(attachment.type ?? "");
    const mediaPayload = attachment.payload as AnyPayload | undefined;
    const url = String(mediaPayload?.url ?? attachment.url ?? "");
    if (["image", "video", "file"].includes(attachType) && url) {
      return <MediaPreview type={attachType} url={url} />;
    }
  }

  // Plain text fallback
  if (payload.text) {
    return <TextPreview text={String(payload.text)} />;
  }

  return null;
}

interface MetaMessagePreviewProps {
  payload?: AnyPayload | null;
  payloads?: AnyPayload[] | null;
}

export function MetaMessagePreview({ payload, payloads }: MetaMessagePreviewProps) {
  if (payloads && payloads.length > 0) {
    return (
      <div className="flex flex-col gap-1.5">
        {payloads.map((p, i) => (
          <div key={i}>{renderSingle(p)}</div>
        ))}
      </div>
    );
  }

  if (payload) {
    return <>{renderSingle(payload)}</>;
  }

  return null;
}
