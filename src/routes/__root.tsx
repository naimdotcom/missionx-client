import { createRootRoute, Outlet } from "@tanstack/react-router";
import "../styles/globals.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="overflow-hidden h-screen w-screen grid grid-rows-[auto_1fr]">
      <Outlet />
    </div>
  );
}
