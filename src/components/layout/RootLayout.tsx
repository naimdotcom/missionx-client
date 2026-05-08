import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "../ui/sonner";

function RootComponent() {
  const isDevelopment = import.meta.env.ENVIRONMENT === "development";
  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden h-screen w-screen">
      <Outlet />
      <Toaster />
      {/* <ScreenSizeIndicator /> */}
      {isDevelopment && <TanStackDevtools />}
    </div>
  );
}
export default RootComponent;
