// Login page with dummy authentication

import LoginPage from "@/features/login/LoginPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});
