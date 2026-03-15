import CrmPage from "@/pages/crm/CrmPage";
import { createFileRoute } from "@tanstack/react-router";

type CrmSearch = {
  page?: number;
  perPage?: number;
  q?: string;
  platform?: string;
  is_active?: string;
};

export const Route = createFileRoute("/_private/crm")({
  component: CrmPage,
  validateSearch: (search: Record<string, unknown>): CrmSearch => {
    return {
      page: search.page ? Number(search.page) : undefined,
      perPage: search.perPage ? Number(search.perPage) : undefined,
      q: search.q as string | undefined,
      platform: search.platform as string | undefined,
      is_active: search.is_active as string | undefined,
    };
  },
});
