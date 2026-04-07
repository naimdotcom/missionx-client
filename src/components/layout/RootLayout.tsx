import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "../ui/sonner";

function RootComponent() {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />
      <Toaster />
      {/* <ScreenSizeIndicator /> */}
      {/* <TanStackRouterDevtools /> */}
      <TanStackDevtools />
    </div>
  );
}
export default RootComponent;
