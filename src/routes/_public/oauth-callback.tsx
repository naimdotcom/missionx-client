import { OAuthCallbackPage } from "@/pages/login/oauth-callback-page";
import { createFileRoute } from "@tanstack/react-router";

type OAuthCallbackSearch = {
  success?: boolean;
};
export const Route = createFileRoute("/_public/oauth-callback")({
  component: OAuthCallbackPage,
  validateSearch: (search: Record<string, unknown>): OAuthCallbackSearch => {
    return {
      success: search.success as boolean | undefined,
    };
  },
});
