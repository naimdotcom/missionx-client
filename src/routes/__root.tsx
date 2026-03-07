import RootComponent from "@/components/layout/RootLayout";
import { NotFound } from "@/components/shared/NotFound";
import { createRootRoute } from "@tanstack/react-router";
import appCss from "../styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: () => <RootComponent />,
  notFoundComponent: NotFound,
});
