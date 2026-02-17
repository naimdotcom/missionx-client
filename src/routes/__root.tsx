import RootComponent from "@/components/layout/RootLayout";
import { NotFound } from "@/components/shared/NotFound";
import { createRootRoute } from "@tanstack/react-router";
import "../styles/globals.css";

export const Route = createRootRoute({
  component: () => <RootComponent />,
  notFoundComponent: NotFound,
});
