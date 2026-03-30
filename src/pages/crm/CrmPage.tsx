import { ChannelPlatform } from "@/api";
import { useCustomers, useExportCustomers } from "@/api/services/crm/crm.hook";
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

type CrmFilterKey = (typeof FILTER_KEYS)[number];

type CrmQueryState = {
  page: number;
  perPage: number;
  q: string | null;
  platform: string | null;
  is_active: string | null;
  email: string | null;
  phone: string | null;
  platform_id: string | null;
};

const FILTER_KEYS = [
  "q",
  "platform",
  "is_active",
  "email",
  "phone",
  "platform_id",
] as const;

const TEXT_FILTER_KEYS = new Set<CrmFilterKey>([
  "q",
  "email",
  "phone",
  "platform_id",
]);

const toOptional = (value: string | null | undefined) => value || undefined;

const parseIsActive = (value: string | null | undefined) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const resolveUpdater = <T,>(updater: T | ((prev: T) => T), prev: T): T =>
  typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;

const isCrmFilterKey = (value: string): value is CrmFilterKey =>
  FILTER_KEYS.includes(value as CrmFilterKey);

const buildApiParams = (
  params: CrmQueryState,
  selectedAppId?: string,
): CustomerListParams => ({
  page: params.page,
  limit: params.perPage,
  q: toOptional(params.q),
  app_id: selectedAppId,
  platform: toOptional(params.platform) as ChannelPlatform | undefined,
  platform_id: toOptional(params.platform_id),
  email: toOptional(params.email),
  phone: toOptional(params.phone),
  is_active: parseIsActive(params.is_active),
});

const buildFilters = (params: CrmQueryState): Filter[] => {
  return FILTER_KEYS.flatMap((key) => {
    const value = params[key];
    if (value === null || value === undefined) {
      return [];
    }

    return [
      {
        id: key,
        field: key,
        operator: TEXT_FILTER_KEYS.has(key) ? "contains" : "is",
        values: [value],
      } as Filter,
    ];
  });
};

const buildParamsFromFilters = (filters: Filter[]) => {
  const nextParams: Record<"page" | CrmFilterKey, string | number | null> = {
    page: 1,
    q: null,
    platform: null,
    is_active: null,
    email: null,
    phone: null,
    platform_id: null,
  };

  filters.forEach((filter) => {
    if (!isCrmFilterKey(filter.field)) {
      return;
    }

    // Keep empty string values so text filters stay open in the UI.
    nextParams[filter.field] = (filter.values[0] as string) ?? "";
  });

  return nextParams;
};

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

function CrmHeader({ onAddCustomer }: { onAddCustomer: () => void }) {
  return (
    <div className="flex flex-col gap-4 border-b bg-card px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
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

      <div className="flex w-full items-center gap-2 md:w-auto">
        <Button size="sm" className="w-full md:w-auto" onClick={onAddCustomer}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
    </div>
  );
}

export default function CrmPage() {
  const { selectedApp } = useAuthStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const apiParams = buildApiParams(params as CrmQueryState, selectedApp?.id);

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
      const nextOrder = resolveUpdater(updater, columnOrder);
      setColumnOrder(nextOrder);
    },
    onColumnVisibilityChange: (updater) => {
      const nextVisibility = resolveUpdater(updater, columnVisibility);
      setColumnVisibility(nextVisibility);
    },
  });

  const addedFilters = useMemo(
    () => buildFilters(params as CrmQueryState),
    [params],
  );

  const handleFiltersChange = (newFilters: Filter[]) => {
    setParams(buildParamsFromFilters(newFilters) as Partial<typeof params>);
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
      <CrmHeader onAddCustomer={() => setIsCreateOpen(true)} />

      <div className="flex flex-col gap-3 border-b bg-muted/40 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:flex-1">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers by name, email, or phone..."
              className="h-8 w-full border-muted-foreground/20 bg-background pl-9 text-sm shadow-sm transition-colors focus-visible:ring-1"
              value={params.q || ""}
              onChange={(e) =>
                setParams({ q: e.target.value || null, page: 1 })
              }
            />
          </div>

          <Filters
            size="sm"
            filters={addedFilters}
            fields={filterFields}
            onChange={handleFiltersChange}
          />
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          <ExportButton />

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          <DataGridColumnVisibility
            table={table}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 flex-1 text-muted-foreground hover:text-foreground sm:flex-none"
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
              </Button>
            }
          />
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <DataGridContainer className="flex flex-1 flex-col overflow-hidden border-0 bg-background">
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
            <div className="border-t bg-background px-4 py-3">
              <DataGridPagination />
            </div>
          </DataGrid>
        </DataGridContainer>
      </div>

      <CustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}

function ExportButton() {
  const exportCustomers = useExportCustomers();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 flex-1 sm:flex-none">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>Export as CSV</DropdownMenuItem>
        <DropdownMenuItem>Export as JSON</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
