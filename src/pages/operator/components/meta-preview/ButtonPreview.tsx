import { ExternalLink } from "lucide-react";

interface MetaButton {
  type: "postback" | "web_url";
  title: string;
  payload?: string;
  url?: string;
}

interface ButtonPreviewProps {
  text: string;
  buttons: MetaButton[];
}

export function ButtonPreview({ text, buttons }: ButtonPreviewProps) {
  const btns = buttons.slice(0, 3);

  return (
    <div className="max-w-xs overflow-hidden rounded-2xl rounded-tl-sm border border-border bg-white shadow-sm dark:bg-gray-900">
      <div className="px-3.5 py-2.5 text-sm leading-relaxed text-gray-800 dark:text-gray-100">
        {text}
      </div>
      <div className="divide-y divide-border border-t border-border">
        {btns.map((btn, i) => (
          <div
            key={i}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-center text-sm font-medium text-primary"
          >
            {btn.type === "web_url" && <ExternalLink className="size-3.5 shrink-0" />}
            <span className="truncate">{btn.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
