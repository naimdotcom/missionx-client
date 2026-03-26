import { ChannelPlatform } from "@/api";
import { useCustomers } from "@/api/services/crm/crm.hook";
import type { CustomerListParams } from "@/api/services/crm/crm.types";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useAuthStore } from "@/stores/auth-store";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Download, Plus, Search, Settings2, UserCircle } from "lucide-react";
import {
  parseAsInteger,
  parseAsJson,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
} from "~/components/reui/data-grid/data-grid";
import { DataGridColumnVisibility } from "~/components/reui/data-grid/data-grid-column-visibility";
import { DataGridPagination } from "~/components/reui/data-grid/data-grid-pagination";
import { DataGridTableDnd } from "~/components/reui/data-grid/data-grid-table-dnd";
import { Filter, FilterFieldsConfig, Filters } from "~/components/reui/filters";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import { CustomerModal } from "./components/CustomerModal";
import { crmColumns } from "./crm-columns";

const filterFields: FilterFieldsConfig = [
  {
    key: "q",
    label: "Search",
    type: "text",
    placeholder: "Search name, username...",
  },
  {
    key: "platform",
    label: "Platform",
    type: "select",
    options: [
      { label: "Instagram", value: "instagram" },
      { label: "Facebook", value: "facebook" },
    ],
  },
  {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    placeholder: "Filter by email...",
  },
  {
    key: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Filter by phone...",
  },
  {
    key: "platform_id",
    label: "Platform ID",
    type: "text",
    placeholder: "Filter by platform ID...",
  },
];

export default function CrmPage() {
  const { selectedApp } = useAuthStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // nuqs search params management
  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    q: parseAsString,
    platform: parseAsString,
    is_active: parseAsString,
    email: parseAsString,
    phone: parseAsString,
    platform_id: parseAsString,
  });

  const [columnOrder, setColumnOrder] = useQueryState(
    "order",
    parseAsJson<string[]>((val) => val as string[]).withDefault(
      crmColumns.map((c) => c.id!),
    ),
  );

  const [columnVisibility, setColumnVisibility] = useQueryState(
    "visibility",
    parseAsJson<Record<string, boolean>>(
      (val) => val as Record<string, boolean>,
    ).withDefault({}),
  );

  // Build API params
  const apiParams: CustomerListParams = {
    page: params.page,
    limit: params.perPage,
    q: params.q || undefined,
    app_id: selectedApp?.id,
    platform: (params.platform as ChannelPlatform) || undefined,
    platform_id: params.platform_id || undefined,
    email: params.email || undefined,
    phone: params.phone || undefined,
    is_active:
      params.is_active === "true"
        ? true
        : params.is_active === "false"
          ? false
          : undefined,
  };

  const { data: customers, isLoading } = useCustomers(apiParams);

  const { table } = useDataTable({
    columns: crmColumns,
    data: customers ?? [],
    pageCount: -1,
    initialState: {
      pagination: {
        pageIndex: params.page - 1,
        pageSize: params.perPage,
      },
      columnOrder,
      columnVisibility,
    },
    onColumnOrderChange: (updater) => {
      const nextOrder =
        typeof updater === "function" ? updater(columnOrder) : updater;
      setColumnOrder(nextOrder);
    },
    onColumnVisibilityChange: (updater) => {
      const nextVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      setColumnVisibility(nextVisibility);
    },
  });

  // Map URL params to REUI Filters
  const reuiFilters: Filter[] = useMemo(() => {
    return filterFields
      .map((f) => f as { key: string; type: string }) // bypass group types since we are using flat config
      .filter((field) => {
        const value = params[field.key as keyof typeof params];
        return value !== null && value !== undefined;
      })
      .map((field) => ({
        id: field.key,
        field: field.key,
        operator: field.type === "text" ? "contains" : "is",
        values: [params[field.key as keyof typeof params]],
      }));
  }, [params]);

  const handleFiltersChange = (newFilters: Filter[]) => {
    const nextParams: Record<string, string | number | null> = { page: 1 };

    // Reset all filter fields
    filterFields.forEach((f) => {
      const field = f as { key: string };
      if (field.key) nextParams[field.key] = null;
    });

    // Set updated values
    newFilters.forEach((f) => {
      // Allow empty strings for text types to enable the input to stay open
      nextParams[f.field] = (f.values[0] as string) ?? "";
    });

    setParams(nextParams as Partial<typeof params>);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] overflow-hidden">
      {/* Header matching ChannelsPage style */}
      <div className="flex flex-col gap-4 border-b bg-card px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <UserCircle className="size-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Customers</h1>
            <p className="text-xs text-muted-foreground">
              Manage your customer relationships
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Toolbar Area */}
      {/* {showAdvancedFilters && ( */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-9 bg-background h-8"
              value={params.q || ""}
              onChange={(e) =>
                setParams({ ...params, q: e.target.value || null, page: 1 })
              }
            />
          </div>
          <Filters
            size="sm"
            filters={reuiFilters}
            fields={filterFields}
            onChange={handleFiltersChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <Separator orientation="vertical" className="h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DataGridColumnVisibility
            table={table}
            trigger={
              <Button variant="ghost" size="sm" className="h-8">
                <Settings2 className="mr-2 h-4 w-4 text-muted-foreground" />
                Columns
              </Button>
            }
          />
        </div>
      </div>
      {/* )} */}

      {/* Main Grid Area with Fixed Scrolling and Pagination */}
      <div className="flex flex-col overflow-hidden ">
        <DataGridContainer className="flex flex-1 flex-col overflow-hidden bg-background border-0">
          <DataGrid
            table={table}
            isLoading={isLoading}
            loadingMode="skeleton"
            recordCount={customers?.length || 0}
            tableLayout={{
              rowBorder: true,
              stripped: false,
              headerSticky: true,
            }}
          >
            <div className="flex-1 overflow-auto">
              <DataGridTableDnd handleDragEnd={handleDragEnd} />
            </div>
            <div className="border-t px-4 py-3 bg-background">
              <DataGridPagination />
            </div>
          </DataGrid>
        </DataGridContainer>
      </div>

      <CustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
