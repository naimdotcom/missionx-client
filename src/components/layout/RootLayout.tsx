import { Outlet } from "@tanstack/react-router";
import { Toaster } from "../ui/sonner";

function RootComponent() {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />
      <Toaster />
      {/* <ScreenSizeIndicator /> */}
      {/* <TanStackRouterDevtools /> */}
    </div>
  );
}
export default RootComponent;
