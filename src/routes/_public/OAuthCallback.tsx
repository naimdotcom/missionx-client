import { OAuthCallbackPage } from "@/pages/login/OAuthCallbackPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/OAuthCallback")({
  component: OAuthCallbackPage,
});
