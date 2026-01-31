import { ScreenSizeIndicator } from "@/components/debug/screen-size-indicator";
import { createRootRoute, Outlet, useRouter } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../styles/globals.css";

export const Route = createRootRoute({
  component: () => (
    <>
      <RootComponent />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
  notFoundComponent: () => {
    const router = useRouter();
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen gap-4">
        <h1 className="text-2xl font-bold">404 - Not Found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <a
          onClick={() => router.history.back()}
          className="text-primary hover:underline"
        >
          Go back home
        </a>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />
      <ScreenSizeIndicator />
    </div>
  );
}
