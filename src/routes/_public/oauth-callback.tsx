import { OAuthCallbackPage } from "@/pages/login/OAuthCallbackPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/oauth-callback")({
  component: OAuthCallbackPage,
});
