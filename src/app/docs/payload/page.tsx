import type { Metadata } from "next";
import { Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "JSON Message Specification | Mission Engine Documentation",
  description:
    "The definitive contract for all message nodes in the Mission Engine. Every response from your integration must be an array of these node objects.",
};

export default function PayloadPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          JSON Message
          <br />
          Specification.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          The Mission Engine communicates through a strict, immutable JSON
          contract. Every response from your App Service must be an array of
          message nodes.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Basic Text Node */}
      <section id="types" className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-black text-xs">
              01
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Simple Text Node
            </h2>
          </div>
          <p className="text-black/60 font-medium leading-relaxed max-w-2xl">
            The fundamental unit of conversation. Used for standard messages,
            auto-replies, and system notifications.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-50 border border-black/5 rounded-3xl p-8 md:p-12">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-6 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-black" /> Payload
              Example
            </h4>
            <pre className="font-mono text-sm text-black leading-relaxed overflow-x-auto whitespace-pre">
              <code>
                {JSON.stringify(
                  [{ text: "Hello from the Engine! 🌍" }],
                  null,
                  2
                )}
              </code>
            </pre>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-black/10 rounded-2xl space-y-2">
              <h5 className="font-black text-xs uppercase tracking-widest">
                Property
              </h5>
              <code className="text-sm font-black">text</code>
            </div>
            <div className="p-6 border border-black/10 rounded-2xl space-y-2">
              <h5 className="font-black text-xs uppercase tracking-widest">
                Type
              </h5>
              <span className="text-sm font-medium">string</span>
            </div>
            <div className="p-6 border border-black/10 rounded-2xl space-y-2">
              <h5 className="font-black text-xs uppercase tracking-widest">
                Validation
              </h5>
              <span className="text-sm font-medium">Max 2000 characters</span>
            </div>
          </div>
        </div>
      </section>

      {/* Button Node */}
      <section className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-black text-xs">
              02
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Buttons & Templates
            </h2>
          </div>
          <p className="text-black/60 font-medium leading-relaxed max-w-2xl">
            Drive user interaction with structured buttons. Supports up to 3
            buttons per node.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-50 border border-black/5 rounded-3xl p-8 md:p-12">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mb-6 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-black" /> Payload
              Example
            </h4>
            <pre className="font-mono text-sm text-black leading-relaxed overflow-x-auto whitespace-pre">
              <code>
                {JSON.stringify(
                  [
                    {
                      text: "Please select an option:",
                      buttons: [
                        {
                          type: "postback",
                          title: "View Catalog",
                          payload: "VIEW_CATALOG",
                        },
                        {
                          type: "web_url",
                          title: "Visit Website",
                          url: "https://example.com",
                        },
                      ],
                    },
                  ],
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Carousel Node */}
      <section className="space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-black text-white flex items-center justify-center font-black text-xs">
              03
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Generic Carousel
            </h2>
          </div>
          <p className="text-black/60 font-medium leading-relaxed max-w-2xl">
            Horizontal scrolling cards for product catalogs or list selections.
            Max 10 cards.
          </p>
        </div>

        <div className="bg-black text-white rounded-[40px] p-8 md:p-16 shadow-2xl space-y-10">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Full View Specification
            </h4>
            <h3 className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              Maximum Payload Space
            </h3>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 md:p-10 border border-white/10 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed text-emerald-400">
              <code>
                {JSON.stringify(
                  [
                    {
                      attachment: {
                        type: "template",
                        payload: {
                          template_type: "generic",
                          elements: [
                            {
                              title: "Pro Subscription",
                              subtitle: "Access all features - $49/mo",
                              image_url:
                                "https://cdn.mission.com/assets/cards/pro.png",
                              buttons: [
                                {
                                  type: "postback",
                                  title: "Select Plan",
                                  payload: "CHOOSE_PRO",
                                },
                              ],
                            },
                            {
                              title: "Enterprise Plan",
                              subtitle: "Custom solutions for teams",
                              image_url:
                                "https://cdn.mission.com/assets/cards/enterprise.png",
                              buttons: [
                                {
                                  type: "postback",
                                  title: "Talk to Sales",
                                  payload: "CONTACT_SALES",
                                },
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <Separator className="bg-black/10" />

      {/* Validation Logic */}
      <section className="p-12 border-4 border-black rounded-[50px] space-y-8 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <AlertCircle className="h-12 w-12 text-black/10" />
        </div>
        <div className="space-y-4 relative z-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Validation Engine
          </h2>
          <p className="text-lg text-black/60 font-medium max-w-2xl leading-relaxed">
            Every payload is validated against our core schema before transport.
            If a node is missing required fields or has incorrect types, the
            engine will reject the entire array and log a{" "}
            <code>STRUCTURAL_ERROR</code>.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 pt-4 relative z-10">
          <div className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
            <CheckCircle2 className="h-4 w-4" /> Type Strictness
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
            <CheckCircle2 className="h-4 w-4" /> Node Integrity
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">
            <CheckCircle2 className="h-4 w-4" /> Semantic Lock
          </div>
        </div>
      </section>
    </div>
  );
}
