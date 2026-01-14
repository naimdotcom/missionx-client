"use client";

import {
  useGetAllSessionsQuery,
  useRevokeSessionMutation,
  useLogoutAllMutation,
} from "@/store/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  LogOut,
  XCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SessionsPage() {
  const { data, isLoading, refetch } = useGetAllSessionsQuery(
    {},
    {
      pollingInterval: 30000, // Refresh every 30 seconds
    }
  );
  const [revokeSession, { isLoading: isRevoking }] = useRevokeSessionMutation();
  const [logoutAll, { isLoading: isLoggingOutAll }] = useLogoutAllMutation();

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to revoke session:", error);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAll({}).unwrap();
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to logout all sessions:", error);
    }
  };

  const getDeviceIcon = (userAgent: string = "") => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("android"))
      return <Smartphone className="size-5" />;
    if (ua.includes("tablet") || ua.includes("ipad"))
      return <Tablet className="size-5" />;
    return <Monitor className="size-5" />;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
            Security & Sessions
          </h1>
          <p className="text-zinc-500 mt-1">
            Manage your active sessions and devices where you're logged in.
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogoutAll}
          disabled={isLoggingOutAll || isLoading}
          className="bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40"
        >
          <LogOut className="size-4 mr-2" />
          Logout all devices
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldCheck className="size-5 text-emerald-500" />
              <CardTitle className="text-lg font-medium text-zinc-100">
                Active Sessions
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-500">
              You're currently signed in to {data?.total || 0} devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full bg-zinc-800" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {data?.sessions.map((session: any) => (
                  <div
                    key={session.session_id}
                    className={cn(
                      "flex items-center justify-between p-6 transition-colors hover:bg-zinc-800/30",
                      session.is_current && "bg-emerald-500/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "size-12 rounded-full flex items-center justify-center border",
                          session.is_current
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        )}
                      >
                        {getDeviceIcon(session.user_agent)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-100">
                            {session.user_agent.split("/")[0] ||
                              "Browser Session"}
                          </span>
                          {session.is_current && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                              Current Device
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <div className="flex items-center gap-1">
                            <Globe className="size-3" />
                            {session.ip_address || "Unknown IP"}
                          </div>
                          <Separator
                            orientation="vertical"
                            className="h-3 bg-zinc-700"
                          />
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            Last active{" "}
                            {formatRelativeTime(session.last_activity)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(session.session_id)}
                        disabled={isRevoking}
                        className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <XCircle className="size-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-100">
                Multi-Factor Authentication
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Added layer of security for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="size-4" />
                  Managed by Google/Facebook
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-zinc-800"
                  disabled
                >
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-zinc-100">
                Account Recovery
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Ensure you have access to your primary email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 truncate max-w-[150px]">
                  Verified Email
                </span>
                <span className="text-xs font-medium text-zinc-300">
                  Enabled
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
