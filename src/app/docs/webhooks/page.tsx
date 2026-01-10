import type { Metadata } from "next";
import { Share2, Lock, Activity, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Webhook Architecture | Mission Engine Documentation",
  description:
    "The technical deep-dive into the Mission Engine webhook layer. Security, normalization, and asynchronous event dispatching.",
};

export default function WebhookPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Webhook
          <br />
          Architecture.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          The Mission Webhook layer handles massive concurrency and
          high-fidelity platform normalization.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Security Deep Dive */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Security Protocols
          </h2>
        </div>

        <div className="space-y-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              01. Signature Verification
            </h3>
            <p className="text-lg text-black/60 font-medium leading-relaxed max-w-2xl">
              Every request from Meta or external platforms is verified using
              SHA-256 HMAC signatures. We calculate the hash using your secret
              keys stored in our secure vault.
            </p>
            <div className="bg-zinc-50 border border-black/10 rounded-[40px] p-8 md:p-12 font-mono text-sm overflow-x-auto">
              <p className="text-black/40 mb-4 tracking-widest uppercase font-black text-[10px]">
                Verification Code (Python Reference)
              </p>
              <pre className="text-black">
                {`def verify_signature(payload: bytes, signature: str, secret: str):
    expected = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)`}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              02. Token Exchange
            </h3>
            <p className="text-lg text-black/60 font-medium leading-relaxed max-w-2xl">
              Verification challenges are automatically responded to by the
              engine. The verify_token in your dashboard must match the
              configuration on the provider platform.
            </p>
          </div>
        </div>
      </section>

      <Separator className="bg-black/10" />

      {/* Lifecycle Flow */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            The Lifecycle
          </h2>
        </div>

        <div className="space-y-8">
          {[
            {
              title: "Ingestion",
              desc: "Incoming JSON is parsed and immediately verified for signature accuracy.",
            },
            {
              title: "Normalization",
              desc: "Different platform types (IG Messaging, FB Postbacks) are distilled into a universal internal event schema.",
            },
            {
              title: "Context Injection",
              desc: "The engine hydrates the event with the full Conversation history and User profile metadata.",
            },
            {
              title: "Dispatch",
              desc: "Events are pushed into a high-availability queue for the execution engine to process asynchronously. A 200 OK is returned to the provider instantly.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="group p-8 border border-black/5 rounded-3xl hover:border-black/20 transition-all bg-white relative"
            >
              <div className="flex items-center gap-6">
                <span className="text-5xl font-black text-black/5 group-hover:text-black/10 transition-colors">
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h4 className="font-black text-xl uppercase tracking-tighter">
                    {step.title}
                  </h4>
                  <p className="text-black/60 font-medium leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-24 bg-black text-white rounded-[60px] flex flex-col items-center justify-center text-center px-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 relative z-10">
          High Availability Webhooks.
        </h2>
        <p className="text-white/40 font-medium max-w-xl mb-10 relative z-10">
          Engineered for sub-50ms latency in ingestion and 99.99% uptime for
          conversational continuity across global regions.
        </p>
        <button className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform relative z-10">
          Check Global Status
        </button>
      </footer>
    </div>
  );
}
