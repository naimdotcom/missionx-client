interface QuickReply {
  content_type: string;
  title?: string;
  payload?: string;
  image_url?: string;
}

interface QuickReplyPreviewProps {
  text: string;
  quick_replies: QuickReply[];
}

export function QuickReplyPreview({ text, quick_replies }: QuickReplyPreviewProps) {
  const chips = quick_replies.slice(0, 13);

  return (
    <div className="flex max-w-xs flex-col gap-2">
      <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 shadow-sm dark:bg-gray-900 dark:text-gray-100">
        {text}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((qr, i) => (
          <span
            key={i}
            className="rounded-full border border-primary/50 px-3 py-1 text-xs text-primary"
            title={qr.payload}
          >
            {qr.title || qr.content_type}
          </span>
        ))}
      </div>
    </div>
  );
}
