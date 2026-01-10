import { Metadata } from "next";
import {
  Terminal,
  MousePointer2,
  Info,
  AlertCircle,
  CheckCircle2,
  Layers,
  Workflow,
  MessageSquare,
  Image as ImageIcon,
  Video,
  BookOpen,
  Lightbulb,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "JSON Payload Spec | Developer Guide",
  description:
    "Comprehensive guide for configuring Flow Nodes and JSON payloads in Brainchat messaging flows.",
};

const JSONBlock = ({ children }: { children: string }) => (
  <div className="relative group border-2 border-black bg-white my-8 overflow-hidden">
    <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 selection:bg-white selection:text-black">
      JSON
    </div>
    <div className="p-6 overflow-x-auto whitespace-pre font-mono text-xs md:text-sm text-black leading-relaxed selection:bg-black selection:text-white">
      {children.trim()}
    </div>
  </div>
);

const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <section
    className="mb-24 scroll-mt-24"
    id={title.toLowerCase().replace(/\s+/g, "-")}
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="p-2.5 bg-black text-white">
        <Icon className="h-5 w-5 stroke-[2.5px]" />
      </div>
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">
        {title}
      </h2>
    </div>
    <div className="space-y-6 text-black/80">{children}</div>
  </section>
);

const Tip = ({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success" | "tip";
}) => {
  const icons = {
    info: <Info className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5" />,
    tip: <Lightbulb className="h-5 w-5" />,
  };

  return (
    <div className="flex gap-5 p-6 border-2 border-black bg-white my-8">
      <div className="shrink-0 pt-0.5 text-black">{icons[type]}</div>
      <div className="text-sm font-bold leading-relaxed text-black italic">
        {children}
      </div>
    </div>
  );
};

export default function PayloadLibraryPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="mb-20">
        <div className="mb-6 inline-block bg-black px-3 py-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
            Spec v1.0
          </span>
        </div>
        <h1 className="text-6xl font-black italic tracking-tighter text-black mb-6 uppercase">
          JSON Payload Library
        </h1>
        <p className="text-xl font-medium text-black/60 leading-relaxed max-w-3xl">
          Complete technical reference for Brainchat messaging nodes.
          High-contrast examples for rapid development.
        </p>
      </header>

      <Separator className="mb-20 bg-black h-1" />

      <Section title="Introduction" icon={BookOpen}>
        <p className="text-lg font-medium leading-relaxed">
          The{" "}
          <span className="bg-black text-white px-2 py-0.5 font-mono text-sm">
            payload
          </span>{" "}
          field is the core configuration for every node. It defines the
          structure and interaction capabilities of the message sent to the
          user.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          {[
            {
              icon: Terminal,
              title: "Validate",
              desc: "Always lint your JSON before deployment.",
            },
            {
              icon: MousePointer2,
              title: "Test",
              desc: "Verify node logic in sandbox mode.",
            },
            {
              icon: Layers,
              title: "Optimize",
              desc: "Use high-speed media delivery endpoints.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border-2 border-black p-6 hover:bg-black hover:text-white transition-all group cursor-default"
            >
              <item.icon className="h-6 w-6 mb-4 stroke-[2.5px]" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">
                {item.title}
              </h3>
              <p className="text-xs font-bold leading-relaxed opacity-60 group-hover:opacity-100">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Simple Text" icon={MessageSquare}>
        <p className="text-lg font-medium leading-relaxed">
          Minimalist text-only message delivery. Used for notifications and
          status updates.
        </p>
        <JSONBlock>
          {`{
  "text": "Your order has been confirmed and is being prepared."
}`}
        </JSONBlock>
      </Section>

      <Section title="Buttons" icon={MousePointer2}>
        <p className="text-lg font-medium leading-relaxed">
          Interactive choice nodes. Each button triggers a specific flow action
          or external URL.
        </p>

        <div className="border-2 border-black overflow-hidden my-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white font-black uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Required</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              <tr className="font-bold">
                <td className="px-6 py-5 font-mono text-xs uppercase tracking-tighter">
                  postback
                </td>
                <td className="px-6 py-5">Jump to Node Slug</td>
                <td className="px-6 py-5 font-mono text-[10px]">payload</td>
              </tr>
              <tr className="font-bold">
                <td className="px-6 py-5 font-mono text-xs uppercase tracking-tighter">
                  web_url
                </td>
                <td className="px-6 py-5">Open Browser</td>
                <td className="px-6 py-5 font-mono text-[10px]">url</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Tip type="tip">
          The{" "}
          <span className="underline decoration-2 underline-offset-4">
            payload
          </span>{" "}
          value must match an existing <span className="italic">node_slug</span>{" "}
          in your flow configuration.
        </Tip>

        <JSONBlock>
          {`{
  "text": "How can we help you today?",
  "buttons": [
    {
      "type": "postback",
      "title": "View Catalog",
      "payload": "catalog_start"
    },
    {
      "type": "web_url",
      "url": "https://brainchat.ai/help",
      "title": "Help Center"
    }
  ]
}`}
        </JSONBlock>
      </Section>

      <Section title="Carousel" icon={ShoppingBag}>
        <p className="text-lg font-medium leading-relaxed">
          Horizontal multi-card delivery. Ideal for product displays and menu
          options.
        </p>
        <JSONBlock>
          {`{
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
        {
          "title": "Premium Headset",
          "subtitle": "Noise-cancelling, 40h battery.",
          "image_url": "https://example.com/item1.jpg",
          "buttons": [{ "type": "postback", "title": "Add to Cart", "payload": "cart_1" }]
        },
        {
          "title": "Wireless Mouse",
          "subtitle": "Ergonomic, 16k DPI.",
          "image_url": "https://example.com/item2.jpg",
          "buttons": [{ "type": "postback", "title": "Learn More", "payload": "mouse_info" }]
        }
      ]
    }
  }
}`}
        </JSONBlock>
      </Section>

      <Section title="Checklist" icon={CheckCircle2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          {[
            "Strict JSON Syntax Validation",
            "HTTPS Public Image Assets",
            "Matched Postback Slugs",
            "Concise Mobile-First Text",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 border-2 border-black font-black uppercase tracking-widest text-xs italic"
            >
              <CheckCircle2 className="h-5 w-5" />
              {item}
            </div>
          ))}
        </div>
      </Section>

      <footer className="mt-40 pt-16 border-t-4 border-black text-center font-black uppercase tracking-[0.5em] text-black">
        <p className="text-xs">End of Specification</p>
      </footer>
    </div>
  );
}
