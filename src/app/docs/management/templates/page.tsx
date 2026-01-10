import type { Metadata } from "next";
import { Database, Terminal, FileCode, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Message Templates | Developer Documentation",
  description: "Atomic message components for your Mission flows.",
};

export default function TemplatesManagementPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Message
          <br />
          Templates.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          Templates allow you to define content independently of conversation
          logic. Use slugs to reference these reusable UI components across
          different flows.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* CRUD Table */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <Database className="h-8 w-8" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Schema & Types
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              type: "text",
              desc: "Standard string-based messages. Max 2000 chars.",
            },
            {
              type: "button",
              desc: "Text prompt with up to 3 interactive buttons.",
            },
            {
              type: "image",
              desc: "Media attachment via public URL or file upload.",
            },
            { type: "generic", desc: "Full generic carousel template spec." },
          ].map((t) => (
            <div
              key={t.type}
              className="p-8 border border-black/10 rounded-3xl space-y-3 hover:bg-zinc-50 transition-colors"
            >
              <h4 className="text-sm font-black uppercase tracking-widest">
                {t.type}
              </h4>
              <p className="text-sm text-black/60 font-medium">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-black uppercase tracking-tighter">
            Store Template
          </h3>
          <p className="text-black/60 font-medium">
            Register a content block that can be shared across nodes.
          </p>
        </div>

        <div className="bg-zinc-50 border border-black/5 rounded-[40px] p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40">
            <Terminal className="h-4 w-4" /> Endpoint: POST /apps/{"{app_id}"}
            /templates
          </div>
          <pre className="font-mono text-sm leading-relaxed text-black/80 overflow-x-auto">
            {`{
  "slug": "promo_summer_2026",
  "name": "Summer Promotion Hook",
  "template_type": "text",
  "payload": {
    "text": "Get 20% off all mirroring cameras today! Use code: SUMMER26"
  },
  "is_active": true
}`}
          </pre>
        </div>
      </section>

      {/* Logic for Variable Injection */}
      <section className="p-12 border-4 border-black rounded-[50px] space-y-8 bg-zinc-50">
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Variable Injection (Coming Soon)
          </h2>
          <p className="text-lg text-black/60 font-medium leading-relaxed max-w-2xl">
            Soon you will be able to use liquid-style syntax in your templates.
            Variables like <code>{`{{user.first_name}}`}</code> will be
            automatically hydrated by the customer-service profile data during
            flow execution.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
            Status: Under Development
          </div>
        </div>
      </section>
    </div>
  );
}
