import { useCustomers } from "@/api/services/crm/crm.hook";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useAuthStore } from "@/stores/auth-store";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Plus, Search, Settings2, UserCircle } from "lucide-react";
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
import { Filter, Filters } from "~/components/reui/filters";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { CustomerModal } from "./components/CustomerModal";
import {
  buildApiParams,
  buildFilters,
  buildParamsFromFilters,
  CrmQueryState,
  EMPTY_FILTER_PARAMS,
  FILTER_FIELDS,
  normalizeFilterMode,
  QUERY_STATE_PARSERS,
  resolveUpdater,
  SEARCH_DEBOUNCE_MS,
  type FilterMode,
} from "./const";
import { getCrmColumns } from "./crm-columns";

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
    page: parseAsInteger.withDefault(QUERY_STATE_PARSERS.page),
    perPage: parseAsInteger.withDefault(QUERY_STATE_PARSERS.perPage),
    filterMode: parseAsString.withDefault(QUERY_STATE_PARSERS.filterMode),
    q: parseAsString,
    platform: parseAsString,
    is_active: parseAsString,
    email: parseAsString,
    phone: parseAsString,
    platform_id: parseAsString,
  });

  const [columnOrder, setColumnOrder] = useQueryState(
    "order",
    parseAsJson<string[]>((val) => val as string[]).withDefault([]),
  );

  const [columnVisibility, setColumnVisibility] = useQueryState(
    "visibility",
    parseAsJson<Record<string, boolean>>(
      (val) => val as Record<string, boolean>,
    ).withDefault({}),
  );

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    void setParams({ q: value || null, page: 1 });
  }, SEARCH_DEBOUNCE_MS);

  const query = params as CrmQueryState;
  const apiParams = buildApiParams(query, selectedApp?.id);

  const { data: customers, isLoading } = useCustomers(apiParams);
  const columns = useMemo(() => getCrmColumns(customers ?? []), [customers]);

  const { table } = useDataTable({
    columns,
    data: customers ?? [],
    pageCount: -1,
    manualSorting: false,
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

  const addedFilters = useMemo(() => buildFilters(query), [query]);
  const filterMode = normalizeFilterMode(query.filterMode);
  const activeFilterCount = addedFilters.length;

  const handleFiltersChange = (newFilters: Filter[]) => {
    const nextParams = buildParamsFromFilters(newFilters) as Partial<
      typeof params
    >;
    setParams(nextParams);
  };

  const handleFilterModeChange = (nextMode: FilterMode) => {
    setParams({ filterMode: nextMode, page: 1 });
  };

  const clearAllFilters = () => {
    setParams({ page: 1, ...EMPTY_FILTER_PARAMS });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const currentOrder =
        table.getState().columnOrder.length > 0
          ? table.getState().columnOrder
          : table.getAllLeafColumns().map((column) => column.id);

      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const nextOrder = arrayMove(currentOrder, oldIndex, newIndex);

      // Update table state immediately so DnD feels responsive.
      table.setColumnOrder(nextOrder);

      // Persist order in URL state.
      setColumnOrder(nextOrder);
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
              defaultValue={params.q || ""}
              onChange={(e) => {
                const value = e.target.value;
                debouncedSetSearchQuery(value);
              }}
            />
          </div>

          <Filters
            size="sm"
            filters={addedFilters}
            fields={FILTER_FIELDS}
            onChange={handleFiltersChange}
          />

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-md border bg-background p-1">
                <Button
                  size="sm"
                  variant={filterMode === "and" ? "default" : "ghost"}
                  className="h-7 px-3"
                  onClick={() => handleFilterModeChange("and")}
                >
                  AND
                </Button>
                <Button
                  size="sm"
                  variant={filterMode === "or" ? "default" : "ghost"}
                  className="h-7 px-3"
                  onClick={() => handleFilterModeChange("or")}
                >
                  OR
                </Button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-muted-foreground"
                disabled={activeFilterCount === 0}
                onClick={clearAllFilters}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto sm:justify-end">
          {/* <ExportButton
            onExport={handleExport}
            isExporting={exportCustomers.isPending}
          /> */}

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
              columnsResizable: true,
              columnsDraggable: true,
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
