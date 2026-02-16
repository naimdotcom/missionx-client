import LoginPage from "@/pages/login/LoginPage";
import { createFileRoute } from "@tanstack/react-router";

type LoginSearchParams = {
  accessToken?: string;
  refreshToken?: string;
};

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
    return {
      accessToken: search.accessToken as string | undefined,
      refreshToken: search.refreshToken as string | undefined,
    };
  },
});
