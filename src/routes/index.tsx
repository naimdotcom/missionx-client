import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/auth-store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/inbox" });
    }
  },
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-2">
          MissionX
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Customer Experience Platform
        </p>
        <a
          href="/_auth/login"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Sign In
        </a>
      </div>
    </div>
  );
}
