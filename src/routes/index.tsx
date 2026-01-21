import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useAuthStore } from "~/stores/auth-store";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          MissionX CX Inbox
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Omnichannel customer communication platform
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          {isAuthenticated ? (
            <Link to="/inbox">
              <Button size="lg">Open Inbox</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="lg">Sign In</Button>
            </Link>
          )}
          <Button variant="outline" size="lg" disabled>
            Connect Facebook (Demo)
          </Button>
        </div>
      </div>
    </div>
  );
}
