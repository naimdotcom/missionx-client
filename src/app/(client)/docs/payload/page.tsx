import { Metadata } from "next";
import {
  Terminal,
  MousePointer2,
  Info,
  AlertCircle,
  CheckCircle2,
  Layers,
  MessageSquare,
  Image as ImageIcon,
  Video,
  BookOpen,
  Lightbulb,
  ShoppingBag,
  FileText,
  Music,
  Files,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "JSON Payload Specification | Developer Guide",
  description:
    "Comprehensive technical reference and cheatsheet for configuring Brainchat Flow Nodes.",
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
  icon: React.ElementType;
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

export default function PayloadPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="mb-20">
        <div className="mb-6 inline-block bg-black px-3 py-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
            Spec v1.1
          </span>
        </div>
        <h1 className="text-6xl font-black italic tracking-tighter text-black mb-6 uppercase">
          JSON Payload Library
        </h1>
        <p className="text-xl font-medium text-black/60 leading-relaxed max-w-3xl">
          Complete technical reference for Brainchat messaging nodes.
          Centralized documentation for platform compatibility and payload
          structures.
        </p>
      </header>

      <Separator className="mb-20 bg-black h-1" />

      <Section title="Introduction" icon={BookOpen}>
        <p className="text-lg font-medium leading-relaxed">
          The{" "}
          <code className="bg-black text-white px-2 py-0.5 font-mono text-sm">
            payload
          </code>{" "}
          field controls the message content. While Facebook Messenger supports
          almost all features, Instagram Direct has stricter limitations
          regarding file types.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          {[
            {
              icon: Terminal,
              title: "Validate",
              desc: "Ensure JSON syntax is correct before deployment.",
            },
            {
              icon: MousePointer2,
              title: "Test",
              desc: "Verify logic in the flow builder sandbox.",
            },
            {
              icon: Layers,
              title: "Optimize",
              desc: "Use high-speed content delivery for media assets.",
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

      <Section title="Compatibility Matrix" icon={Layers}>
        <div className="border-[6px] border-black overflow-hidden my-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white font-black uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Feature</th>
                <th className="px-6 py-4 text-center">Messenger</th>
                <th className="px-6 py-4 text-center">Instagram</th>
                <th className="px-6 py-4">Limits</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {[
                {
                  name: "Simple Text",
                  messenger: "YES",
                  instagram: "YES",
                  limit: "1000 CHARS",
                },
                {
                  name: "Buttons",
                  messenger: "YES",
                  instagram: "YES",
                  limit: "MAX 3",
                },
                {
                  name: "png, jpeg, gif",
                  messenger: "YES",
                  instagram: "YES",
                  limit: "up to 8MB",
                },
                {
                  name: "Videos",
                  messenger: "YES",
                  instagram: "YES",
                  limit: "mp4, mov and up to 25MB",
                },
                {
                  name: "Audio",
                  messenger: "YES",
                  instagram: "YES",
                  limit: "acc, m4a, wav, mp4",
                },
                {
                  name: "PDF",
                  messenger: "YES",
                  instagram: "NO",
                  limit: "up to 25MB",
                },
                {
                  name: "Carousels",
                  messenger: "YES",
                  instagram: "YES",
                  limit: "10 CARDS",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="font-bold hover:bg-black/5 transition-colors"
                >
                  <td className="px-6 py-4 uppercase tracking-tighter text-sm">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {row.messenger}
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {row.instagram}
                  </td>
                  <td className="px-6 py-4 text-[10px] font-black uppercase opacity-60">
                    {row.limit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip type="warning">
          Instagram Direct does not support PDF documents or generic file
          downloads. Sending these will result in delivery failure.
        </Tip>
      </Section>

      <Section title="Simple Text" icon={MessageSquare}>
        <p className="text-lg font-medium leading-relaxed">
          The most basic response type. Max 1000 characters recommended for
          optimal display.
        </p>
        <JSONBlock>
          {`{
  "text": "Discover our curated collection of premium tech products. Ready to explore?"
}`}
        </JSONBlock>
      </Section>

      <Section title="Interactive Buttons" icon={MousePointer2}>
        <p className="text-lg font-medium leading-relaxed">
          Standard interaction nodes. Works on both Instagram and Facebook.
        </p>
        <div className="border-2 border-black overflow-hidden my-8">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white font-black uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Required Field</th>
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
        <JSONBlock>
          {`{
  "text": "Welcome to TechHub! What would you like to do?",
  "buttons": [
    {
      "type": "postback",
      "title": "Show Products",
      "payload": "product_intro"
    },
    {
      "type": "web_url",
      "title": "Website",
      "url": "https://www.example.com"
    }
  ]
}`}
        </JSONBlock>
        <Tip type="tip">
          Always use postback buttons for app navigation (linking to other nodes
          using node_slug) and web_url for external links.
        </Tip>
      </Section>

      <Section title="Product Carousel" icon={ShoppingBag}>
        <p className="text-lg font-medium leading-relaxed">
          Horizontal scrollable list. Max 10 cards per carousel. 1.91:1 image
          ratio is strictly recommended.
        </p>
        <JSONBlock>
          {`{
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "generic",
      "elements": [
        {
          "title": "Mirrorless Camera",
          "subtitle": "Professional photography. 4K video capability.",
          "image_url": "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
          "buttons": [
            { "type": "web_url", "url": "https://example.com/camera", "title": "Visit Product" },
            { "type": "postback", "title": "Add to Cart", "payload": "cart_camera" }
          ]
        },
        {
          "title": "Wireless Speaker",
          "subtitle": "360-degree immersive sound. 30h battery.",
          "image_url": "https://images.pexels.com/photos/1738641/pexels-photo-1738641.jpeg",
          "buttons": [
            { "type": "web_url", "url": "https://example.com/speaker", "title": "Visit Product" },
            { "type": "postback", "title": "View Specs", "payload": "specs_speaker" }
          ]
        }
      ]
    }
  }
}`}
        </JSONBlock>
      </Section>

      <Section title="Rich Media & Attachments" icon={Files}>
        <p className="text-lg font-medium leading-relaxed mb-6">
          Standalone media delivery. Ensure high accessibility and optimized
          file sizes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="border-2 border-black p-6 space-y-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5" />
              <h4 className="font-black uppercase tracking-widest text-sm">
                Image
              </h4>
            </div>
            <p className="text-[10px] font-black uppercase opacity-60">
              JPG, PNG. Max 8MB.
            </p>
            <JSONBlock>
              {`{
  "attachment": {
    "type": "image",
    "payload": {
      "url": "https://your-server.com/image.jpg", 
      "is_reusable": true
    }
  }
}`}
            </JSONBlock>
          </div>
          <div className="border-2 border-black p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5" />
              <h4 className="font-black uppercase tracking-widest text-sm">
                Video
              </h4>
            </div>
            <p className="text-[10px] font-black uppercase opacity-60">
              MP4, MOV. Max 25MB.
            </p>
            <JSONBlock>
              {`{
  "attachment": {
    "type": "video",
    "payload": {
      "url": "https://your-server.com/video.mp4"
    }
  }
}`}
            </JSONBlock>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-2 border-black p-6 bg-black/5 space-y-4">
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5" />
              <h4 className="font-black uppercase tracking-widest text-sm">
                Audio
              </h4>
            </div>
            <Tip type="warning">Facebook Only. AAC, M4A, WAV.</Tip>
          </div>
          <div className="border-2 border-black p-6 bg-black/5 space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <h4 className="font-black uppercase tracking-widest text-sm">
                Files/PDF
              </h4>
            </div>
            <Tip type="warning">Facebook Only. PDF, ZIP, DOC.</Tip>
          </div>
        </div>
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

      <footer className="mt-40 pt-16 border-t-8 border-black flex flex-col items-center gap-8 text-center font-black uppercase tracking-[0.5em] text-black">
        <div className="h-4 w-40 bg-black" />
        <p className="text-xs">End of Specification</p>
      </footer>
    </div>
  );
}
