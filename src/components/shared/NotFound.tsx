import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Compass, Home } from "lucide-react";

export function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_70%)]" />

      {/* Floating orbs */}
      <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-primary/5 blur-3xl" />
      <div
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        style={{ animation: "pulse 3s ease-in-out infinite 1s" }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        {/* Glitch-style 404 number */}
        <div className="relative mb-6 select-none">
          <h1
            className="text-[12rem] font-black leading-none tracking-tighter text-foreground/5 sm:text-[16rem]"
            aria-hidden="true"
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <span className="text-7xl font-black tracking-tighter text-foreground sm:text-8xl">
                4
              </span>
              {/* Animated compass icon as the "0" */}
              <span className="relative mx-1 inline-flex items-center justify-center sm:mx-2">
                <Compass
                  className="h-16 w-16 text-primary sm:h-20 sm:w-20"
                  strokeWidth={1.5}
                  style={{
                    animation: "spin 8s linear infinite",
                  }}
                />
              </span>
              <span className="text-7xl font-black tracking-tighter text-foreground sm:text-8xl">
                4
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-10 space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Lost in the void
          </h2>
          <p className="mx-auto max-w-md text-base text-muted-foreground sm:text-lg">
            The page you&apos;re looking for has drifted into unknown space.
            Let&apos;s navigate you back to familiar territory.
          </p>
        </div>

        {/* Decorative line */}
        <div className="mx-auto mb-10 flex w-48 items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <div className="h-1.5 w-1.5 rotate-45 rounded-sm bg-primary" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="default"
            size="lg"
            className="min-w-[160px] gap-2"
            onClick={() => router.navigate({ to: "/" })}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[160px] gap-2"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Error code caption */}
        <p className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
          Error Code: 404 &middot; Page Not Found
        </p>
      </div>
    </div>
  );
}
