import { useCustomers } from "@/api/services/crm/crm.hook";
import {
  DataTableActionBar,
  type ActionBarAction,
} from "@/components/reui/data-grid/data-table-action-bar";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useAuthStore } from "@/stores/auth-store";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Archive,
  Plus,
  Search,
  Settings2,
  Trash2,
  UserCircle,
} from "lucide-react";
import { parseAsJson, useQueryState, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
} from "~/components/reui/data-grid/data-grid";
import { DataGridColumnVisibility } from "~/components/reui/data-grid/data-grid-column-visibility";
import { DataGridPagination } from "~/components/reui/data-grid/data-grid-pagination";
import { DataGridTableDnd } from "~/components/reui/data-grid/data-grid-table-dnd";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { CustomerModal } from "./components/CustomerModal";
import {
  buildApiParams,
  CrmQueryState,
  QUERY_STATE_PARSERS,
  resolveUpdater,
  SEARCH_DEBOUNCE_MS,
  type CrmFilter,
} from "./const";
import { fixedCrmColumns } from "./crm-columns.tsx";

const crmActions: ActionBarAction<any>[] = [
  {
    id: "delete",
    label: "Delete selected rows",
    icon: Trash2,
    variant: "destructive",
    separatorBefore: true,
    onClick: (rows) => {
      const ids = rows.map((r) => r.original.id);
      console.log("Deleting:", ids);
    },
  },
  {
    id: "archive",
    label: "Archive selected rows",
    icon: Archive,
    onClick: (rows) => {
      console.log(
        "Archiving:",
        rows.map((r) => r.original),
      );
    },
    disabled: (rows) => rows.some((r) => r.original.status === "archived"),
  },
  // {
  //   id: "export",
  //   label: "Export selected to CSV",
  //   icon: Download,
  //   separatorBefore: true,
  //   onClick: (rows) => {
  //     const csv = rows
  //       .map((r) => Object.values(r.original).join(","))
  //       .join("\n");
  //     const blob = new Blob([csv], { type: "text/csv" });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "selected-rows.csv";
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   },
  // },
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
  const [params, setParams] = useQueryStates(QUERY_STATE_PARSERS);

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
  const dynamicColumns = useMemo(
    () =>
      customers?.app_fields.fields
        .filter((field) => field.visible)
        .map((field) => ({
          id: field.key || field.name || "",
          accessorKey: field.key || field.name || "",
          header: field.name || (field.key || "").replace(/_/g, " "),
        })) ?? [],
    [customers],
  );

  const { table } = useDataTable({
    columns: [...fixedCrmColumns, ...dynamicColumns],
    data: customers?.customers ?? [],
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
    columnResizeMode: "onChange",
    onColumnOrderChange: (updater) => {
      const nextOrder = resolveUpdater(updater, columnOrder);
      setColumnOrder(nextOrder);
    },
    onColumnVisibilityChange: (updater) => {
      const nextVisibility = resolveUpdater(updater, columnVisibility);
      setColumnVisibility(nextVisibility);
    },
  });

  const activeFiltersObj = params.filters || { condition: "and", items: [] };

  const clearAllFilters = () => {
    setParams({ page: 1, filters: null });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const fixedColumnIds = new Set(["select", "customer"]);
      if (
        fixedColumnIds.has(String(active.id)) ||
        fixedColumnIds.has(String(over.id))
      ) {
        return;
      }

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

          <AdvancedFilters
            filters={activeFiltersObj.items}
            filterMode={activeFiltersObj.condition}
            onApply={(newFilters, mode) => {
              setParams({
                filters: {
                  condition: mode,
                  items: newFilters as CrmFilter[],
                },
                page: 1,
              });
            }}
            onClear={clearAllFilters}
          />
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
            recordCount={customers?.customers.length || 0}
            tableLayout={{
              rowBorder: true,
              stripped: false,
              headerSticky: true,
              columnsResizable: true,
              columnsPinnable: true,
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
        <DataTableActionBar table={table} actions={crmActions} />
      </div>

      <CustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
