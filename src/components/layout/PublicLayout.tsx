import { Outlet } from "@tanstack/react-router";

function PublicLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
