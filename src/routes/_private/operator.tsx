import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SessionSidebar } from "@/pages/operator/components/SessionSidebar";

function OperatorLayout() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <SessionSidebar />
      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/_private/operator")({
  component: OperatorLayout,
});
