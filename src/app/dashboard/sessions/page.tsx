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
  CardDescription,
  CardContent,
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
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  session_id: string;
  user_agent: string;
  ip_address: string;
  last_activity: string;
  is_current: boolean;
}

interface SessionsResponse {
  total: number;
  sessions: Session[];
}

export default function SessionsPage() {
  const { data, isLoading, refetch } = useGetAllSessionsQuery(
    {},
    {
      pollingInterval: 30000,
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

  const getDeviceIcon = (userAgent: string = ""): React.ReactNode => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobi") || ua.includes("iphone") || ua.includes("android"))
      return <Smartphone className="h-5 w-5" />;
    if (ua.includes("tablet") || ua.includes("ipad"))
      return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const formatRelativeTime = (dateString: string): string => {
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

  const sessionsData = data as SessionsResponse | undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Active Sessions
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Manage your active sessions and devices
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogoutAll}
          disabled={isLoggingOutAll || isLoading}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout All
        </Button>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">Your Sessions</CardTitle>
          <CardDescription>
            You're currently signed in to {sessionsData?.total || 0} device
            {sessionsData?.total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : sessionsData?.sessions && sessionsData.sessions.length > 0 ? (
            <div className="space-y-1 divide-y divide-neutral-200 dark:divide-neutral-800">
              {sessionsData.sessions.map((session: Session) => (
                <div
                  key={session.session_id}
                  className={cn(
                    "flex items-center justify-between py-4 px-1",
                    session.is_current &&
                      "bg-neutral-50 dark:bg-neutral-900/50 px-3 rounded-lg"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "p-2.5 rounded-lg",
                        session.is_current
                          ? "bg-neutral-900 dark:bg-neutral-50 text-white dark:text-black"
                          : "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50"
                      )}
                    >
                      {getDeviceIcon(session.user_agent)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-900 dark:text-neutral-50 truncate">
                          {session.user_agent.split("/")[0] ||
                            "Browser Session"}
                        </span>
                        {session.is_current && (
                          <span className="text-xs font-semibold bg-neutral-900 dark:bg-neutral-50 text-white dark:text-black px-2 py-1 rounded whitespace-nowrap">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5" />
                          {session.ip_address || "Unknown"}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
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
                      className="ml-2 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500 dark:text-neutral-400">
                No active sessions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-base">Two-Factor Auth</CardTitle>
            <CardDescription className="text-xs">
              Manage two-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Status
              </span>
              <span className="text-neutral-900 dark:text-neutral-50 font-medium">
                Managed by OAuth
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-base">Account Recovery</CardTitle>
            <CardDescription className="text-xs">
              Recovery options for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Email
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Verified
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
