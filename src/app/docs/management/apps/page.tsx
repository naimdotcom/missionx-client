import type { Metadata } from "next";
import { Layers, Terminal, ShieldCheck, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Apps Management | Developer Documentation",
  description: "Manage Mission Applications via the apps_service API.",
};

export default function AppsManagementPage() {
  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="space-y-6">
        <h1 className="text-6xl font-black tracking-tighter uppercase leading-[0.85]">
          Apps
          <br />
          Management.
        </h1>
        <p className="text-xl text-black/60 font-medium tracking-tight max-w-3xl leading-relaxed">
          The <code>apps_service</code> acts as the orchestration layer for all
          mission-critical metadata. Use these endpoints to programmatically
          manage your application lifecycle.
        </p>
      </section>

      <Separator className="bg-black/10" />

      {/* Service Info */}
      <section className="bg-black text-white p-12 rounded-[40px] shadow-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Activity className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-black uppercase tracking-widest">
            Service: apps_service
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Base URL
            </h4>
            <code className="text-emerald-400 text-lg">
              http://localhost:8500/api/v1
            </code>
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
              Auth Level
            </h4>
            <p className="font-bold">JWT Bearer Required</p>
          </div>
        </div>
      </section>

      {/* Create App */}
      <section className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Layers className="h-8 w-8" />
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Create Application
            </h2>
          </div>
          <p className="text-lg text-black/60 font-medium max-w-2xl">
            Register a new application context. The user generating the request
            is automatically assigned as the owner.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-50 border border-black/5 rounded-[40px] p-8 md:p-12 space-y-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded">
                POST /apps
              </span>
            </div>
            <pre className="font-mono text-sm text-black/80 leading-relaxed overflow-x-auto">
              <code>{`{
  "name": "E-Commerce Assistant",
  "short_id": "shop_bot_01", // Optional: Unique slug
  "description": "Handles order tracking and common faqs",
  "config": {
    "theme": "dark",
    "retries": 3
  }
}`}</code>
            </pre>
          </div>

          <div className="p-8 border-2 border-black rounded-3xl space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
              Response Model
            </h4>
            <div className="font-mono text-sm">
              <p className="text-black font-bold">// 201 Created</p>
              <pre className="text-black/60 italic">
                {`{
  "id": "uuid",
  "name": "E-Commerce Assistant",
  "short_id": "shop_bot_01",
  "creator_id": "user_uuid",
  "created_at": "timestamp"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Role Management */}
      <section className="space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-8 w-8" />
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              RBAC & Permissions
            </h2>
          </div>
          <p className="text-lg text-black/60 font-medium max-w-2xl">
            Managing who can edit and view your apps. Support for Admin, Editor,
            and Viewer roles.
          </p>
        </div>

        <div className="bg-zinc-50 border border-black/5 rounded-[40px] p-8 md:p-12 space-y-8">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
              Assign Role
            </h4>
            <code className="text-sm font-black text-black bg-white px-4 py-2 rounded-lg border border-black/10 block mb-4">
              POST /apps/{`{app_id}`}/roles
            </code>
          </div>
          <pre className="font-mono text-sm text-black/80">
            <code>{`{
  "email": "developer@partner.com",
  "role": "editor" // [admin, moderator, editor, viewer]
}`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
