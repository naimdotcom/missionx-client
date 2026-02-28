import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const URL_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

function linkifyText(text: string, isCustomer: boolean) {
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  const matches = [...text.matchAll(URL_REGEX)];

  if (matches.length === 0) {
    return text;
  }

  for (const match of matches) {
    const url = match[0];
    const index = match.index!;

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    parts.push(
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "underline inline-flex items-center gap-0.5 break-all",
          isCustomer
            ? "text-primary hover:text-primary/80"
            : "text-primary-foreground/90 hover:text-primary-foreground",
        )}
      >
        {url.length > 50 ? `${url.slice(0, 50)}...` : url}
        <ExternalLink className="h-3 w-3 inline shrink-0" />
      </a>,
    );

    lastIndex = index + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
export default linkifyText;
