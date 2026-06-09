import { ExternalLink } from "lucide-react";

interface MetaButton {
  type: "postback" | "web_url";
  title: string;
  payload?: string;
  url?: string;
}

interface GenericElement {
  title: string;
  subtitle?: string;
  image_url?: string;
  default_action?: { type: string; url?: string };
  buttons?: MetaButton[];
}

interface GenericPreviewProps {
  elements: GenericElement[];
}

export function GenericPreview({ elements }: GenericPreviewProps) {
  const cards = elements.slice(0, 10);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {cards.map((el, i) => (
        <div
          key={i}
          className="flex w-44 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-gray-900"
        >
          {el.image_url && (
            <div className="h-24 w-full overflow-hidden bg-muted">
              <img
                src={el.image_url}
                alt={el.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col px-3 pt-2 pb-1">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
              {el.title}
            </p>
            {el.subtitle && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {el.subtitle}
              </p>
            )}
          </div>
          {el.buttons && el.buttons.length > 0 && (
            <div className="divide-y divide-border border-t border-border">
              {el.buttons.slice(0, 3).map((btn, bi) => (
                <div
                  key={bi}
                  className="flex items-center justify-center gap-1 px-3 py-2 text-center text-xs font-medium text-primary"
                >
                  {btn.type === "web_url" && (
                    <ExternalLink className="size-3 shrink-0" />
                  )}
                  <span className="truncate">{btn.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
