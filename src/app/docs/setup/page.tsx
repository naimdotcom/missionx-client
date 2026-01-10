import type { Metadata } from "next";
import { Settings2, Terminal, ShieldCheck, Cpu, Key } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Environment Setup | Mission Engine Documentation",
  description:
    "Technical configuration requirements for the Mission Engine. Networking, authentication, and platform connectivity.",
};

export default function SetupPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Environment
          <br />
          Setup.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          Ensure your infrastructure is correctly configured to communicate with
          the Mission Engine.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Networking Section */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center">
            <Cpu className="h-5 w-5" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Network Topology
          </h2>
        </div>

        <div className="space-y-10">
          <div className="bg-zinc-50 border border-black/5 rounded-[40px] p-8 md:p-16 space-y-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                Inbound Firewall Rules
              </h3>
              <p className="text-lg text-black/60 font-medium leading-relaxed max-w-2xl">
                The Engine calls your App Service from a set of static IP
                ranges. Please ensure your firewall allows HTTPS traffic (port
                443) from the following CIDR blocks.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-black text-white rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Production (US-EAST)
                </h4>
                <div className="font-mono text-sm space-y-2">
                  <p>34.22.11.0 / 24</p>
                  <p>52.88.99.12 / 32</p>
                </div>
              </div>
              <div className="p-8 bg-black text-white rounded-3xl space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Staging (Global)
                </h4>
                <div className="font-mono text-sm space-y-2">
                  <p>18.122.4.0 / 28</p>
                  <p>44.192.1.0 / 24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center">
            <Key className="h-5 w-5" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Service Identity
          </h2>
        </div>

        <div className="space-y-10">
          <p className="text-lg text-black/60 font-medium leading-relaxed max-w-2xl">
            Every request from the Engine includes a bearer token. You must
            validate this token against your environment variables to ensure the
            request is official.
          </p>

          <div className="border-[4px] border-black rounded-[50px] p-8 md:p-16 space-y-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <ShieldCheck className="h-48 w-48" />
            </div>
            <div className="space-y-2 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                Header Specification
              </h4>
              <div className="bg-zinc-100 p-8 rounded-2xl font-mono text-sm border border-black/5 overflow-x-auto">
                <pre className="text-black leading-relaxed">
                  {`GET /app-service/v1/flow HTTP/1.1\nHost: yourservice.com\nAuthorization: Bearer mission_at_sk_live_v82m1...`}
                </pre>
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-2">
              Learn how to rotate keys in the Developer Console.
            </p>
          </div>
        </div>
      </section>

      <Separator className="bg-black/10" />

      {/* Integration Checklist */}
      <section className="space-y-12 py-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 text-center">
          Final Checklist
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            "SSL/TLS Enabled (v1.3)",
            "Firewall IPs Allowlisted",
            "Bearer Token Validated",
            "Response Latency < 5s",
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 border-2 border-dashed border-black/20 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 group hover:border-black/100 hover:bg-black hover:text-white transition-all"
            >
              <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-black text-[10px] group-hover:bg-white group-hover:text-black">
                {i + 1}
              </div>
              <span className="text-xs font-black uppercase tracking-widest leading-snug">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
