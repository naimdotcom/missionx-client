import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "../ui/sonner";

function RootComponent() {
  const isDevelopment = import.meta.env.ENVIRONMENT === "development";
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Outlet />
      <Toaster />
      {/* <ScreenSizeIndicator /> */}
      {isDevelopment && <TanStackDevtools />}
    </div>
  );
}
export default RootComponent;
