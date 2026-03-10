import { Outlet } from "@tanstack/react-router";
import { ScreenSizeIndicator } from "../debug/screen-size-indicator";
import { GooeyToaster } from "../ui/goey-toaster";

function RootComponent() {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />

      <ScreenSizeIndicator />
      <GooeyToaster position="top-center" />
      {/* <TanStackRouterDevtools /> */}
    </div>
  );
}
export default RootComponent;
