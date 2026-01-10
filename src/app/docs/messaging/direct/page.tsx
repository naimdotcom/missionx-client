import type { Metadata } from "next";
import {
  MessageSquare,
  Terminal,
  Send,
  Image as ImageIcon,
  Layout,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Direct Messaging API | Developer Documentation",
  description:
    "Send proactive or reactive messages to customers via Meta APIs.",
};

export default function DirectMessagingPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Direct
          <br />
          Push API.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          Bypass the automated flow engine and send targeted messages directly
          to your customers. Supports multipart file uploads and rich
          interactive templates.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Sending Text & Buttons */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <Send className="h-10 w-10 text-black p-2 border-2 border-black rounded-lg" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Standard Messages
          </h2>
        </div>

        <div className="bg-zinc-50 border border-black/5 rounded-[50px] p-8 md:p-16 space-y-10">
          <div className="space-y-4 border-b border-black/10 pb-8">
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Endpoint: POST /channels/{"{platform}"}/{"{channel_id}"}/messages
            </h3>
            <p className="text-black/60 font-medium italic">
              Supported Platforms: instagram, facebook
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Request Pattern: Form-Data
              </h4>
              <p className="text-sm font-medium text-black/60 max-w-xl">
                We use <code>multipart/form-data</code> to allow seamless
                blending of text instructions and physical file uploads.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 font-mono text-sm overflow-x-auto">
              <div className="p-8 bg-black text-white rounded-3xl space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  cURL Example
                </h5>
                <pre className="text-xs leading-relaxed whitespace-pre-wrap">
                  {`curl -X POST "http://localhost:8006/api/v1/channels/instagram/7ca5c7/messages" \\
     -F "recipient_id=748291039" \\
     -F "text=Check this out!" \\
     -F 'buttons=[{"type":"web_url","title":"Visit","url":"https://ex.com"}]'`}
                </pre>
              </div>
              <div className="p-8 bg-white border border-black/10 rounded-3xl space-y-4 text-black">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-black/30">
                  Response
                </h5>
                <pre className="text-xs leading-relaxed">
                  {`{
  "success": true,
  "message_id": "mid.78291...",
  "status": "SENT"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Uploads */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <ImageIcon className="h-8 w-8" />
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Media Upload Specification
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "image_file",
              desc: "Supports JPG, PNG up to 8MB. Meta handles automatic optimization.",
            },
            {
              title: "video_file",
              desc: "Supports MP4 up to 15MB. Maximum duration: 25 seconds recommended.",
            },
            {
              title: "file_upload",
              desc: "Generic documents (PDF, Doc) handled as persistent attachments.",
            },
          ].map((m) => (
            <div
              key={m.title}
              className="p-8 border border-black/10 rounded-3xl space-y-3"
            >
              <code className="text-xs font-black bg-black text-white px-2 py-1 rounded inline-block">
                {m.title}
              </code>
              <p className="text-xs text-black/60 font-medium leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Carousels */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <Layout className="h-10 w-10 text-black p-2 border-2 border-black rounded-lg" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Rich Carousels
          </h2>
        </div>

        <div className="bg-black text-white rounded-[60px] p-8 md:p-16 shadow-2xl space-y-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-tight">
              Endpoint: POST /channels/facebook/{"{id}"}/carousel
            </h3>
            <p className="text-white/40 font-medium">
              Render professional product cards. Map directly to Meta's Generic
              Template.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[40px] font-mono text-xs leading-relaxed overflow-x-auto text-emerald-400">
            <pre>
              {`[
  {
    "title": "Smart Watch Series 2",
    "subtitle": "Active heart tracking | $199",
    "image_url": "https://img.cdn/watch.jpg",
    "buttons": [
      { "type": "web_url", "url": "https://shop.com/w2", "title": "Buy Now" }
    ]
  },
  {
    "title": "Wireless Earbuds",
    "subtitle": "Noise cancellation | $129",
    "image_url": "https://img.cdn/buds.jpg",
    "buttons": [
      { "type": "postback", "payload": "ADD_CART_BUDS", "title": "Add to Cart" }
    ]
  }
]`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
