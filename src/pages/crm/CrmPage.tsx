import { ChannelPlatform } from "@/api";
import { useCustomers } from "@/api/services/crm/crm.hook";
import type { CustomerListParams } from "@/api/services/crm/crm.types";
import { useDataTable } from "@/hooks/use-data-table";
import { useAuthStore } from "@/stores/auth-store";
import { useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DataTable } from "~/components/data-table/data-table";
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar";
import { Button } from "~/components/ui/button";
import { CustomerModal } from "./components/CustomerModal";
import { crmColumns } from "./crm-columns";

export default function CrmPage() {
  const { selectedApp } = useAuthStore();
  const search: Record<string, unknown> = useSearch({ strict: false });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Build params from URL search
  const params: CustomerListParams = {
    page: search.page ? Number(search.page) : 1,
    limit: search.perPage ? Number(search.perPage) : 10,
    q: (search.q as string) || undefined,
    app_id: selectedApp?.id,
    platform: (search.platform as ChannelPlatform) || undefined,
    is_active:
      search.is_active !== undefined ? search.is_active === "true" : undefined,
  };

  const { data, isLoading } = useCustomers(params);

  const customers = data ?? [];

  const { table } = useDataTable({
    columns: crmColumns,
    data: customers,
    pageCount: -1,
    initialState: {
      pagination: {
        pageIndex: params.page ? params.page - 1 : 0,
        pageSize: params.limit ?? 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">Manage your CRM customers</p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
        <DataTableSkeleton columnCount={crmColumns.length} rowCount={10} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your CRM customers</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>

      <CustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
