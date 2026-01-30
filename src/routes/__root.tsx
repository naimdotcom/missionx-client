import { ScreenSizeIndicator } from "@/components/debug/screen-size-indicator";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import "../styles/globals.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />
      <ScreenSizeIndicator />
    </div>
  );
}
