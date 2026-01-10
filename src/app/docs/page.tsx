import type { Metadata } from "next";
import Link from "next/link";
import { MoveRight, ShieldCheck, Zap, Layers, Cpu, Server } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Mission Engine Documentation | Developer Portal",
  description:
    "The technical blueprint for the Mission Multi-Platform Messaging Engine.",
};

export default function DocsPage() {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="space-y-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm">
            Core Version 1.4.0
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase">
            The Mission
            <br />
            Blueprint.
          </h1>
          <p className="text-2xl md:text-3xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
            A distributed architecture for real-time conversational automation
            and high-fidelity messaging.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/docs/management/apps"
            className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl"
          >
            Management APIs <MoveRight className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/messaging/direct"
            className="px-10 py-5 border-4 border-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-black hover:text-white transition-all shadow-lg"
          >
            Messaging APIs
          </Link>
        </div>
      </section>

      <Separator className="bg-black/10" />

      {/* Dual Service Architecture */}
      <section className="space-y-16">
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">
            Architecture
          </h2>
          <h3 className="text-4xl font-black uppercase tracking-tighter max-w-xl leading-tight">
            Decoupled Orchestration & Messaging.
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-10 bg-zinc-50 rounded-[40px] border border-black/5 space-y-6">
            <div className="flex items-center gap-4">
              <Cpu className="h-8 w-8 text-black" />
              <h4 className="text-2xl font-black uppercase tracking-tighter">
                Management Plane (8500)
              </h4>
            </div>
            <p className="text-black/60 font-medium leading-relaxed">
              The <code>apps_service</code> manages long-term state. It handles
              Apps registration, Flow definitions, Role-based access, and
              Message templates.
            </p>
            <ul className="space-y-2 text-sm font-bold text-black uppercase tracking-widest text-[10px]">
              <li>• JSON Graph Logic</li>
              <li>• RBAC Controls</li>
              <li>• Template Sanitization</li>
            </ul>
          </div>

          <div className="p-10 bg-black text-white rounded-[40px] shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <Server className="h-8 w-8 text-white" />
              <h4 className="text-2xl font-black uppercase tracking-tighter">
                Execution Plane (8006)
              </h4>
            </div>
            <p className="text-white/40 font-medium leading-relaxed">
              The <code>webhook-service</code> handles the heat. It manages
              real-time platform tokens, webhook ingestion, signature
              verification, and multi-media delivery.
            </p>
            <ul className="space-y-2 text-sm font-bold text-white/40 uppercase tracking-widest text-[10px]">
              <li>• HMAC Ingestion</li>
              <li>• Multi-part Media Push</li>
              <li>• High-concurrency Delivery</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="space-y-12 py-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 border-b border-black/10 pb-4">
          Core Principles
        </h2>
        <div className="grid md:grid-cols-3 gap-16">
          {[
            {
              title: "Immutable IDs",
              content:
                "UUIDs are used across services to ensure referential integrity for Channels, Apps, and Threads.",
            },
            {
              title: "Async First",
              content:
                "Platform push is handled asynchronously to maintain sub-50ms ingestion latency.",
            },
            {
              title: "Payload Strictness",
              content:
                "Every outbound message is validated against our JSON spec before it leaves our perimeter.",
            },
          ].map((principle, i) => (
            <div key={i} className="space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {principle.title}
              </h3>
              <p className="text-sm text-black/60 leading-relaxed font-medium">
                {principle.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-black/10" />

      {/* Final Section */}
      <section className="py-24 text-center space-y-12 bg-zinc-50 rounded-[80px] border border-black/5 px-8">
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
            Professional
            <br />
            Integration.
          </h2>
          <p className="text-xl text-black/60 font-medium max-w-xl mx-auto tracking-tight">
            Follow our technical guides to connect your infrastructure.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link
            href="/docs/management/apps"
            className="text-xs font-black uppercase tracking-[0.2em] border-b-4 border-black pb-2 hover:border-black/20 transition-all"
          >
            Go to Management API
          </Link>
          <Link
            href="/docs/messaging/direct"
            className="text-xs font-black uppercase tracking-[0.2em] border-b-4 border-black pb-2 hover:border-black/20 transition-all"
          >
            Go to Messaging API
          </Link>
        </div>
      </section>
    </div>
  );
}
