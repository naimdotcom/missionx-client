import { Outlet } from "@tanstack/react-router";
import { ScreenSizeIndicator } from "../debug/screen-size-indicator";

function RootComponent() {
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />
      <ScreenSizeIndicator />
      {/* <TanStackRouterDevtools /> */}
    </div>
  );
}
export default RootComponent;
