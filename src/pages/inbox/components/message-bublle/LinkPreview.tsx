import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Globe } from "lucide-react";

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url: string;
}

async function fetchOGData(url: string): Promise<OGData> {
  const res = await fetch(
    `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=false`,
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const json = await res.json();
  const d = json?.data;
  return {
    url,
    title: d?.title,
    description: d?.description,
    image: d?.image?.url ?? d?.logo?.url,
    siteName: d?.publisher ?? new URL(url).hostname.replace("www.", ""),
  };
}

const URL_REGEX =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/i;

interface LinkPreviewProps {
  text: string;
  isCustomer: boolean;
}

export function LinkPreview({ text, isCustomer }: LinkPreviewProps) {
  const match = text.match(URL_REGEX);
  const url = match?.[0];

  const { data, isLoading, isError } = useQuery<OGData>({
    queryKey: ["link-preview", url],
    queryFn: () => fetchOGData(url!),
    enabled: !!url,
    staleTime: 1000 * 60 * 60, // cache 1 hour
    retry: false,
  });

  if (!url || isLoading || isError || (!data?.title && !data?.description))
    return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group mt-2 flex gap-3 rounded-xl overflow-hidden border transition-colors",
        "hover:bg-black/5 dark:hover:bg-white/5",
        isCustomer
          ? "bg-white/60 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-700"
          : "bg-white/20 border-white/20",
      )}
    >
      {/* Accent bar */}
      <div
        className={cn(
          "w-1 shrink-0",
          isCustomer ? "bg-blue-400" : "bg-white/50",
        )}
      />

      {/* Content */}
      <div className="flex flex-1 min-w-0 gap-3 py-2.5 pr-3 items-start">
        <div className="flex-1 min-w-0">
          {/* Site name */}
          <div
            className={cn(
              "flex items-center gap-1 text-[10px] font-medium mb-0.5",
              isCustomer ? "text-blue-500 dark:text-blue-400" : "text-white/70",
            )}
          >
            <Globe className="h-3 w-3 shrink-0" />
            <span className="truncate">{data?.siteName}</span>
          </div>

          {/* Title */}
          {data?.title && (
            <p
              className={cn(
                "text-xs font-semibold leading-snug line-clamp-2",
                isCustomer ? "text-gray-800 dark:text-gray-100" : "text-white",
              )}
            >
              {data.title}
            </p>
          )}

          {/* Description */}
          {data?.description && (
            <p
              className={cn(
                "text-[11px] mt-0.5 line-clamp-2 leading-snug",
                isCustomer
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-white/70",
              )}
            >
              {data.description}
            </p>
          )}
        </div>

        {/* Thumbnail */}
        {data?.image && (
          <img
            src={data.image}
            alt={data.title ?? "preview"}
            className="h-14 w-14 rounded-lg object-cover shrink-0 bg-muted"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      {/* External link icon */}
      <div className="flex items-center pr-2">
        <ExternalLink
          className={cn(
            "h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity",
            isCustomer ? "text-gray-500" : "text-white",
          )}
        />
      </div>
    </a>
  );
}
