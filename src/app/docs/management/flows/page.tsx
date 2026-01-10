import type { Metadata } from "next";
import { Workflow, Terminal, GitBranch, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Flows & Nodes | Developer Documentation",
  description:
    "Building conversational logic via the apps_service Flow Engine.",
};

export default function FlowsManagementPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Flows &<br />
          Graph Nodes.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          The Flow Engine represents conversation as a Directed Acyclic Graph
          (DAG). Each node contains a message payload and the logic to determine
          the next jump.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Flow Creation */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <Share2 className="h-10 w-10 text-black p-2 border-2 border-black rounded-lg" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            1. Initialize Flow
          </h2>
        </div>

        <div className="bg-zinc-50 border border-black/5 rounded-[50px] p-8 md:p-16 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Endpoint: POST /apps/{"{app_id}"}/flows
            </h3>
            <p className="text-black/60 font-medium">
              Create a container for your conversational graph.
            </p>
          </div>
          <div className="bg-black text-emerald-400 p-8 rounded-3xl font-mono text-sm overflow-x-auto">
            <pre>
              {`{
  "name": "Onboarding Experience",
  "slug": "user_onboarding",
  "is_active": true
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Node Creation with Migration Examples */}
      <section className="space-y-16">
        <div className="flex items-center gap-4">
          <GitBranch className="h-10 w-10 text-black p-2 border-2 border-black rounded-lg" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            2. Appending Nodes
          </h2>
        </div>

        <div className="space-y-12">
          <p className="text-lg text-black/60 font-medium max-w-2xl leading-relaxed">
            Nodes are the atomic units of a flow. They define what the user sees
            and how the system evaluates the response.
          </p>

          <div className="grid gap-12">
            {/* Type: Button Match */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded">
                Logic Pattern: button_match
              </div>
              <div className="p-10 border border-black/10 rounded-[40px] bg-white space-y-8">
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest leading-relaxed italic">
                  // Example: Welcome prompt that waits for specific button IDs
                </p>
                <div className="bg-zinc-50 p-8 rounded-2xl border border-black/5 font-mono text-sm">
                  <pre className="text-black">
                    {`{
  "node_slug": "welcome_step",
  "payload": {
    "text": "Welcome to TechHub! How can we help?",
    "buttons": [
      { "type": "postback", "title": "🛍️ Products", "payload": "product_intro" },
      { "type": "postback", "title": "📞 Support", "payload": "contact_us" }
    ]
  },
  "next_logic": {
    "type": "button_match" // Engine will automatically route based on button payload
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Type: Chained Nodes */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded">
                Logic Pattern: next_node_slug
              </div>
              <div className="p-10 border border-black/10 rounded-[40px] bg-white space-y-8">
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest leading-relaxed italic">
                  // Example: Chaining multiple messages together (Auto-send)
                </p>
                <div className="bg-zinc-50 p-8 rounded-2xl border border-black/5 font-mono text-sm">
                  <pre className="text-black">
                    {`{
  "node_slug": "product_intro",
  "payload": {
    "text": "✨ Discover our curated collection... Ready to explore? 🚀"
  },
  "next_logic": {
    "next_node_slug": "products_carousel" // Engine moves to this node instantly
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Type: Dynamic Variables */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded">
                Feature: Variable Injection
              </div>
              <div className="p-10 border border-black/10 rounded-[40px] bg-white space-y-8">
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest leading-relaxed italic">
                  // Example: Personalizing messages using customer-service data
                </p>
                <div className="bg-zinc-50 p-8 rounded-2xl border border-black/5 font-mono text-sm">
                  <pre className="text-black">
                    {`{
  "node_slug": "personalized_welcome",
  "payload": {
    "text": "Hi {{first_name}}! 👋 Welcome back to TechHub. We've missed you!"
  },
  "next_logic": { "type": "wait_for_user" }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Type: Media Payload */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded">
                Media: Image Attachment
              </div>
              <div className="p-10 border border-black/10 rounded-[40px] bg-white space-y-8">
                <p className="text-sm font-bold text-black/40 uppercase tracking-widest leading-relaxed italic">
                  // Example: Sending a visual asset via public URL
                </p>
                <div className="bg-zinc-50 p-8 rounded-2xl border border-black/5 font-mono text-sm">
                  <pre className="text-black">
                    {`{
  "node_slug": "catalog_image",
  "payload": {
    "attachment": {
      "type": "image",
      "payload": {
        "url": "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
        "is_reusable": true
      }
    }
  },
  "next_logic": { "next_node_slug": "welcome_step" }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Carousel Example from Migration */}
      <section className="bg-black text-white rounded-[60px] p-8 md:p-20 space-y-12">
        <div className="space-y-4">
          <h3 className="text-4xl font-black uppercase tracking-tighter">
            Generic Carousel Spec
          </h3>
          <p className="text-white/40 font-medium">
            The most complex node type, used for products and list selections.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[40px] font-mono text-xs md:text-sm overflow-x-auto leading-relaxed">
          <pre className="text-emerald-400">
            {`{
  "node_slug": "products_carousel",
  "payload": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "📷 Mirrorless Camera",
            "subtitle": "Professional photography. 4K video.",
            "image_url": "https://images.pexels.com/...",
            "buttons": [
              { "type": "web_url", "url": "https://ex.com", "title": "Visit" },
              { "type": "postback", "title": "Add Cart", "payload": "cart_camera" }
            ]
          },
          {
            "title": "⌚ Smart Watch Pro",
            "subtitle": "Health and style combined.",
            "image_url": "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
            "buttons": [
              { "type": "postback", "title": "Check Price", "payload": "price_watch" }
            ]
          }
          // Max 10 elements supported by Meta
        ]
      }
    }
  },
  "next_logic": { "type": "wait_for_user" }
}`}
          </pre>
        </div>
      </section>

      {/* Sidenote: Shorthand Support */}
      <section className="p-12 border-4 border-black rounded-[50px] space-y-8 bg-zinc-50">
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Shorthand vs Full Spec
          </h2>
          <p className="text-lg text-black/60 font-medium leading-relaxed max-w-2xl">
            Our engine provides a shorthand for button templates. Instead of the
            full Meta <code>attachment</code> structure, you can simply provide
            <code>{`{ "text": "...", "buttons": [...] }`}</code>. The engine
            will automatically wrap this into a Meta Button Template.
          </p>
        </div>
      </section>
    </div>
  );
}
