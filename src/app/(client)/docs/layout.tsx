import Link from "next/link";
import { DocsSidebarMenu } from "@/components/DocsSidebarMenu";
import { ChevronRight, Home } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r-4 border-black bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center px-8 border-b-4 border-black">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="h-8 w-8 bg-black flex items-center justify-center border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
                <Home className="h-5 w-5 text-white group-hover:text-black" />
              </div>
              <span className="text-lg font-black uppercase tracking-tighter italic">
                Brainchat
              </span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pb-48 scrollbar-hide">
            <DocsSidebarMenu />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 relative">
        <div className="mx-auto max-w-5xl px-8 py-12 md:px-16 md:py-16 lg:px-24">
          <nav className="mb-20 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-black">
            <Link
              href="/"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 stroke-[3px]" />
            <Link
              href="/docs"
              className="hover:underline decoration-2 underline-offset-4"
            >
              Documentation
            </Link>
            <ChevronRight className="h-4 w-4 stroke-[3px]" />
            <span className="opacity-40 italic">Developer Guide</span>
          </nav>
          <div className="relative">{children}</div>
        </div>
      </main>
    </div>
  );
}
