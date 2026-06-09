import { Sparkles } from "lucide-react";
import Markdown from "react-markdown";

export function AssistantBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-4" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground">
        <Markdown
          components={{
            h1: ({ children }) => (
              <h1 className="mb-1 mt-2 text-base font-bold first:mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-1 mt-2 text-sm font-bold first:mt-0">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-0.5 mt-1.5 text-sm font-semibold first:mt-0">{children}</h3>
            ),
            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
            ul: ({ children }) => (
              <ul className="mb-1.5 ml-4 list-disc space-y-0.5 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-1.5 ml-4 list-decimal space-y-0.5 last:mb-0">{children}</ol>
            ),
            li: ({ children }) => <li>{children}</li>,
            code: ({ children, className }) => {
              const isBlock = className?.startsWith("language-");
              return isBlock ? (
                <code className="block w-full overflow-x-auto rounded-md bg-background/60 px-3 py-2 font-mono text-xs">
                  {children}
                </code>
              ) : (
                <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-xs">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="mb-1.5 overflow-x-auto rounded-md bg-background/60 p-0 last:mb-0">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            hr: () => <hr className="my-2 border-border" />,
          }}
        >
          {text}
        </Markdown>
      </div>
    </div>
  );
}
