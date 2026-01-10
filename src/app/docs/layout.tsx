import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { DocsSidebarMenu } from "@/components/DocsSidebarMenu";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white antialiased">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 border-r border-black/10 bg-white z-40">
        <div className="p-10 pb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-3 w-3 rounded-full bg-black group-hover:scale-125 transition-transform" />
            <span className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
              Mission Engine
            </span>
          </Link>
        </div>

        <DocsSidebarMenu />

        <div className="p-8 border-t border-black/5 text-[10px] font-black text-black/15 text-center uppercase tracking-[0.4em]">
          v1.4.0 Build 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-black/10 sticky top-0 bg-white/90 backdrop-blur-xl z-50">
          <Link
            href="/"
            className="font-black tracking-tighter uppercase text-xl"
          >
            Mission
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-black/20 hover:bg-black hover:text-white transition-none shadow-none rounded-none w-10 h-10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-white p-0 border-r border-black/10"
            >
              <div className="h-full flex flex-col bg-white">
                <div className="p-8 pb-4 border-b border-black/5">
                  <span className="text-xl font-black tracking-tighter uppercase text-black">
                    Mission Engine
                  </span>
                </div>
                <DocsSidebarMenu />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Content Body - Expanded for JSON/Code readability */}
        <main className="flex-1 w-full max-w-full px-8 md:px-16 lg:px-24 py-12 md:py-32">
          {/* Internal content wrapper with wide max-width for code blocks */}
          <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-1000">
            {children}
          </div>

          <div className="max-w-6xl mx-auto w-full">
            <Separator className="my-32 bg-black/10" />

            <footer className="flex flex-col md:flex-row justify-between items-center gap-10 py-12 mb-24">
              <div className="text-[10px] font-black uppercase tracking-[0.5em] text-black/10">
                © 2026 Mission Messaging Platform
              </div>
              <div className="flex gap-12">
                <a
                  href="#"
                  className="text-xs font-black uppercase tracking-widest hover:underline underline-offset-8 decoration-2 decoration-black/20"
                >
                  Github
                </a>
                <a
                  href="#"
                  className="text-xs font-black uppercase tracking-widest hover:underline underline-offset-8 decoration-2 decoration-black/20"
                >
                  Status
                </a>
                <a
                  href="#"
                  className="text-xs font-black uppercase tracking-widest hover:underline underline-offset-8 decoration-2 decoration-black/20"
                >
                  Legal
                </a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
