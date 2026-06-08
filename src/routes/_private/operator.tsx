import OperatorPage from "@/pages/operator/OperatorPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/operator")({
  component: OperatorPage,
});
