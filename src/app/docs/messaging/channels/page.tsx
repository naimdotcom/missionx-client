import type { Metadata } from "next";
import { Settings2, Terminal, Facebook, Instagram, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Channel Configuration | Developer Documentation",
  description:
    "Connect Meta Assets (Pages, Instagram Accounts) to the Mission Engine.",
};

export default function ChannelConfigPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Channel
          <br />
          Connectivity.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          The <code>webhook-service</code> manages real-time platform handles.
          Use these endpoints to map Meta Page IDs and Tokens to your Mission
          Apps.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Service Info */}
      <section className="bg-black text-white p-12 rounded-[40px] shadow-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Share2 className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-black uppercase tracking-widest">
            Service: webhook-service
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Base URL
            </h4>
            <code className="text-blue-400 text-lg">
              http://localhost:8006/api/v1
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Auth Level
            </h4>
            <p className="font-bold">JWT + Platform Verification</p>
          </div>
        </div>
      </section>

      {/* Channel CRUD */}
      <section className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Settings2 className="h-8 w-8" />
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Register Channel
            </h2>
          </div>
          <p className="text-lg text-black/60 font-medium max-w-2xl leading-relaxed">
            A channel links a specific Meta Page (Instagram or Facebook) to a
            Mission App. Once registered, the engine will handle all incoming
            webhooks for that page.
          </p>
        </div>

        <div className="bg-zinc-50 border border-black/5 rounded-[40px] p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded">
              POST /channels
            </span>
          </div>

          <div className="grid gap-12">
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram Context
              </h4>
              <pre className="font-mono text-xs text-black/80 bg-white p-6 rounded-2xl border border-black/5 leading-relaxed">
                {`{
  "app_id": "uuid",
  "name": "Global Support Instagram",
  "platform": "instagram",
  "page_id": "17841401234567890", // Meta IGSID
  "page_access_token": "EAAGm...", // Meta Secret
  "verify_token": "my_secret_token"
}`}
              </pre>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Facebook className="h-4 w-4" /> Facebook Context
              </h4>
              <pre className="font-mono text-xs text-black/80 bg-white p-6 rounded-2xl border border-black/5 leading-relaxed">
                {`{
  "app_id": "uuid",
  "name": "Brand Main Page",
  "platform": "facebook",
  "page_id": "10020304050607", // Meta Page ID
  "page_access_token": "EAAGm...",
  "verify_token": "my_secret_token"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Validation Checklist */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="p-10 border-4 border-black rounded-[40px] space-y-4 bg-zinc-50">
          <h3 className="text-xl font-black uppercase tracking-tighter">
            Meta App Review
          </h3>
          <p className="text-sm text-black/60 font-medium leading-relaxed">
            Ensure your Meta App has <code>instagram_manage_messages</code> and{" "}
            <code>pages_messaging</code> permissions approved for production
            use.
          </p>
        </div>
        <div className="p-10 border border-black/10 rounded-[40px] space-y-4">
          <h3 className="text-xl font-black uppercase tracking-tighter">
            Webhooks URL
          </h3>
          <p className="text-sm text-black/60 font-medium leading-relaxed">
            Point your Meta Webhooks to:
            <br />
            <code className="text-xs font-bold block mt-2">
              https://api.mission.com/v1/webhook
            </code>
          </p>
        </div>
      </section>
    </div>
  );
}
