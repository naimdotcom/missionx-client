import { AppsPage } from "@/features/apps";
import { createFileRoute } from "@tanstack/react-router";

type AppSearchParams = {
  page?: number;
  name?: string;
  perPage?: number;
};
export const Route = createFileRoute("/_private/apps")({
  component: AppsPage,
  validateSearch: (search: Record<string, unknown>): AppSearchParams => {
    return {
      page: search.page ? Number(search.page) : undefined,
      perPage: search.perPage ? Number(search.perPage) : undefined,
      name: typeof search.name === "string" ? search.name : undefined,
    };
  },
});
