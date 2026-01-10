import type { Metadata } from "next";
import { Cpu, MoveRight, Layers, Fingerprint, Code2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "App Service Flow | Mission Engine Documentation",
  description:
    "Learn how to build and connect your App Service to the Mission Engine for dynamic, AI-driven conversational logic.",
};

export default function AppServicePage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          App Service
          <br />
          Integration.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          The App Service Flow allows you to inject custom business logic and AI
          processing directly into the conversational path.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Synchronous Hand-off */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center font-black uppercase text-xs">
            Req
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Synchronous Hand-off
          </h2>
        </div>

        <div className="space-y-10">
          <p className="text-lg font-medium text-black/60 leading-relaxed max-w-2xl">
            Whenever the Engine encounters an intent that requires dynamic
            processing, it sends a POST request to your service endpoint.
          </p>

          <div className="bg-zinc-50 border border-black/5 rounded-[40px] p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                Request Payload Detail
              </h4>
              <p className="text-sm font-bold text-black border-l-2 border-black pl-4">
                Method: POST
              </p>
            </div>
            <pre className="font-mono text-sm leading-relaxed text-black overflow-x-auto whitespace-pre">
              <code>
                {JSON.stringify(
                  {
                    app_id: "uuid_string",
                    customer: {
                      id: "platform_psid",
                      first_name: "Jane",
                      last_name: "Doe",
                    },
                    message: {
                      text: "Can you help me with my reservation?",
                      timestamp: 1736340356,
                      metadata: {
                        source: "instagram_direct",
                      },
                    },
                  },
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Response Contract */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center font-black uppercase text-xs">
            Res
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Response Contract
          </h2>
        </div>

        <div className="space-y-10">
          <p className="text-lg font-medium text-black/60 leading-relaxed max-w-2xl">
            Your service MUST respond with a JSON Array. Each object in the
            array represents a message node that the Engine will deliver to the
            end-user.
          </p>

          <div className="bg-black text-white rounded-[40px] p-8 md:p-16 shadow-2xl space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] uppercase font-black tracking-widest text-white/50 animate-pulse">
                Live Spec
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase underline decoration-white/20 underline-offset-8">
                Expected Response Body
              </h3>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 md:p-12 rounded-2xl font-mono text-sm overflow-x-auto">
              <pre className="text-emerald-400">
                <code>
                  {`[\n  { "text": "I'm checking your reservation details now..." },\n  { "type": "typing", "duration": 1500 },\n  { "text": "Confirmed! You're booked for tomorrow at 7 PM." }\n]`}
                </code>
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-6">
              <div className="p-8 border border-white/10 rounded-3xl space-y-4 bg-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">
                  Status Code
                </h4>
                <p className="text-xl font-bold">200 OK</p>
                <p className="text-sm text-white/40 font-medium">
                  Non-200 responses are treated as system failures and logged
                  accordingly.
                </p>
              </div>
              <div className="p-8 border border-white/10 rounded-3xl space-y-4 bg-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">
                  Timeout Limit
                </h4>
                <p className="text-xl font-bold">5000ms</p>
                <p className="text-sm text-white/40 font-medium">
                  Connections are dropped after 5 seconds to prevent
                  conversational hang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-black/10" />

      {/* Logic Patterns */}
      <section className="space-y-12 py-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
          Logic Patterns
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Stateful Hooks",
              desc: "Store user preferences in your own database using the provided customer ID as the primary key.",
            },
            {
              title: "AI Integration",
              desc: "Forward message text to LLMs (OpenAI, Gemini) and map their output back to our JSON node spec.",
            },
            {
              title: "Transaction Logic",
              desc: "Perform secure API calls to your payment or inventory systems before confirming to the user.",
            },
          ].map((pattern, i) => (
            <div key={i} className="space-y-4">
              <div className="h-12 w-12 border-2 border-black rounded-2xl flex items-center justify-center">
                <Code2 className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter">
                {pattern.title}
              </h4>
              <p className="text-sm text-black/60 font-medium leading-relaxed">
                {pattern.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
