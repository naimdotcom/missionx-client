import { ChevronRight, Code2, Layers, Workflow } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const categories = [
    {
      title: "Technical Spec",
      description:
        "Detailed technical specifications for JSON payloads and flow logic.",
      items: [
        { title: "JSON Payload Spec", href: "/docs/payload", icon: Code2 },
      ],
    },
    {
      title: "Management API",
      description:
        "Guides for managing apps, flows, and templates via our management endpoints.",
      items: [
        {
          title: "Apps Management",
          href: "/docs/management/apps",
          icon: Layers,
        },
        {
          title: "Flows & Nodes",
          href: "/docs/management/flows",
          icon: Workflow,
        },
      ],
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="mb-24">
        <h1 className="text-8xl font-black italic tracking-tighter text-black mb-8 uppercase leading-[0.8]">
          Documentation
        </h1>
        <div className="h-4 w-40 bg-black mb-8" />
        <p className="text-2xl font-black italic tracking-tight text-black/60 max-w-2xl leading-tight">
          BUILD. MANAGE. SCALE.
          <br />
          THE COMPLETE GUIDE TO BRAINCHAT.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-32">
        {categories.map((category) => (
          <div key={category.title} className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-black/30 bg-black/5 inline-block px-4 py-1">
                {category.title}
              </h2>
              <p className="text-3xl font-black italic tracking-tighter text-black uppercase leading-none">
                {category.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {category.items.map((item) => (
                <Link key={item.title} href={item.href} className="group">
                  <div className="border-[6px] border-black p-10 bg-white transition-all group-hover:bg-black group-hover:text-white relative">
                    <div className="mb-10 h-16 w-16 bg-black flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                      <item.icon className="h-8 w-8 stroke-[3px]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-4xl font-black italic uppercase tracking-tighter flex items-center justify-between leading-none">
                        {item.title}
                        <ChevronRight className="h-10 w-10 transform group-hover:translate-x-4 transition-all stroke-[4px]" />
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
