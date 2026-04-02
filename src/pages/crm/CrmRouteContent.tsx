import { Outlet, useMatches } from "@tanstack/react-router";
import CrmPage from "./CrmPage";

export default function CrmRouteContent() {
  const matches = useMatches();
  const isCustomerDetailRoute = matches.some(
    (match) => match.routeId === "/_private/crm/$customerId",
  );

  if (isCustomerDetailRoute) {
    return <Outlet />;
  }

  return <CrmPage />;
}
