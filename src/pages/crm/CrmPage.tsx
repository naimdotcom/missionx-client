import { Customer } from "@/api/index.ts";
import { useCustomers, useUpdateAppField } from "@/api/services/crm/crm.hook";
import {
  DataTableActionBar,
  type ActionBarAction,
} from "@/components/reui/data-grid/data-table-action-bar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useAuthStore } from "@/stores/auth-store";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
  useDataGrid,
} from "~/components/reui/data-grid/data-grid";
import { DataGridTableDnd } from "~/components/reui/data-grid/data-grid-table-dnd";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { CustomerModal } from "./components/CustomerModal";
import { CustomerSegmentsSidebar } from "./components/CustomerSegmentsSidebar";
import {
  buildApiParams,
  type CrmFilter,
  type CrmQueryState,
  QUERY_STATE_PARSERS,
  SEARCH_DEBOUNCE_MS,
} from "./const";
import { crmColumns } from "./crm-columns";

// ─── Bulk actions ─────────────────────────────────────────────────────────────

const crmActions: ActionBarAction<Customer>[] = [
  {
    id: "export",
    label: "Export selected to CSV",
    icon: Download,
    separatorBefore: true,
    onClick: (rows) => {
      const csv = rows
        .map((r) => Object.values(r.original).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "selected-customers.csv";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
];

// ─── Sort options ─────────────────────────────────────────────────────────────

type SortOption = "newest" | "oldest" | "priority" | "unread";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Priority", value: "priority" },
  { label: "Unread first", value: "unread" },
];

// ─── Custom pagination footer ─────────────────────────────────────────────────

function CustomersPaginationFooter() {
  const { table, recordCount, isLoading } = useDataGrid();
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  const from = recordCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);

  const VISIBLE_PAGES = 5;
  const groupStart = Math.floor(pageIndex / VISIBLE_PAGES) * VISIBLE_PAGES;
  const groupEnd = Math.min(groupStart + VISIBLE_PAGES, pageCount);
  const pageNumbers = Array.from(
    { length: groupEnd - groupStart },
    (_, i) => groupStart + i,
  );

  return (
    <div className="flex shrink-0 items-center justify-between border-t bg-background px-4 py-2.5">
      <span className="text-xs text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-44" />
        ) : (
          `Showing ${from}–${to} of ${recordCount} customers`
        )}
      </span>

      {!isLoading && pageCount > 1 && (
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {groupStart > 0 && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-xs text-muted-foreground"
              onClick={() => table.setPageIndex(groupStart - 1)}
            >
              …
            </Button>
          )}

          {pageNumbers.map((p) => (
            <Button
              key={p}
              variant={p === pageIndex ? "outline" : "ghost"}
              size="icon-sm"
              className={cn(
                "h-7 w-7 text-xs",
                p !== pageIndex && "text-muted-foreground",
              )}
              onClick={() => table.setPageIndex(p)}
            >
              {p + 1}
            </Button>
          ))}

          {groupEnd < pageCount && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-xs text-muted-foreground"
              onClick={() => table.setPageIndex(groupEnd)}
            >
              …
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

// Columns whose position and size are never persisted to the backend.
const FIXED_COLUMN_IDS = new Set(["select", "customer", "actions"]);

export default function CrmPage() {
  const { selectedApp } = useAuthStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>("newest");

  const [params, setParams] = useQueryStates(QUERY_STATE_PARSERS);

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    void setParams({ q: value || null, page: 1 });
  }, SEARCH_DEBOUNCE_MS);

  const query = params as CrmQueryState;
  const apiParams = buildApiParams(query, selectedApp?.id);

  const updateAppFieldMutate = useUpdateAppField();
  const customersQuery = useCustomers(apiParams);
  const totalCount = customersQuery.data?.customers.length ?? 0;

  // ── Column sizing persistence ─────────────────────────────────────────────

  // Seed initial widths from backend app_fields so the table matches what
  // the user last set, even after a page refresh.
  const defaultSizing = useMemo(() => {
    const sizing: Record<string, number> = {};
    customersQuery.data?.app_fields.fields?.forEach((field) => {
      const key = field.key || field.name || "";
      if (key && field.width) sizing[key] = field.width;
    });
    return sizing;
  }, [customersQuery.data?.app_fields.fields]);

  const [localColumnSizing, setLocalColumnSizing] = useState<
    Record<string, number>
  >({});

  // Local sizing wins over backend defaults so in-progress drags feel instant.
  const columnSizing = useMemo(
    () => ({ ...defaultSizing, ...localColumnSizing }),
    [defaultSizing, localColumnSizing],
  );

  // Debounced so we don't hammer the API on every pixel of a drag.
  const debouncedResizeUpdate = useDebouncedCallback(
    (key: string, width: number) => {
      if (!key || !selectedApp?.id) return;
      updateAppFieldMutate.mutate(
        {
          action: "update",
          app_id: selectedApp.id,
          payload: { field: { key, width: Math.round(width) } },
        },
        { onSuccess: () => customersQuery.refetch() },
      );
    },
    500,
  );

  const { table } = useDataTable({
    columns: crmColumns,
    data: customersQuery.data?.customers ?? [],
    pageCount: -1,
    manualSorting: false,
    initialState: {
      pagination: { pageIndex: params.page - 1, pageSize: params.perPage },
    },
    state: { columnSizing },
    columnResizeMode: "onChange",
    onColumnSizingChange: (update) => {
      // Capture prev BEFORE the update so the diff is correct.
      const prevSizing = columnSizing;
      const nextSizing =
        typeof update === "function" ? update(prevSizing) : update;
      setLocalColumnSizing(nextSizing);

      // Diff old vs new to find which column was resized.
      // Avoids relying on columnSizingInfo.isResizingColumn which is a
      // scheduled React setState and may not have landed yet when this fires.
      const changedId = Object.keys(nextSizing).find(
        (key) => nextSizing[key] !== prevSizing[key],
      );
      if (changedId && nextSizing[changedId]) {
        debouncedResizeUpdate(changedId, nextSizing[changedId]);
      }
    },
  });

  // ── Column drag-and-drop order persistence ───────────────────────────────

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    // Prevent moving pinned/identity columns.
    if (
      FIXED_COLUMN_IDS.has(String(active.id)) ||
      FIXED_COLUMN_IDS.has(String(over.id))
    ) return;

    const currentOrder =
      table.getState().columnOrder.length > 0
        ? table.getState().columnOrder
        : table.getAllLeafColumns().map((col) => col.id);

    const oldIndex = currentOrder.indexOf(active.id as string);
    const newIndex = currentOrder.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    // Update table state immediately so the drag feels responsive.
    table.setColumnOrder(arrayMove(currentOrder, oldIndex, newIndex));

    // Persist the new position to the backend.
    const movedKey = active.id as string;
    const targetKey = over.id as string;
    const isMovingLeft = newIndex < oldIndex;

    if (selectedApp?.id) {
      updateAppFieldMutate.mutate({
        action: "move",
        app_id: selectedApp.id,
        payload: {
          move_key: movedKey,
          before_key: isMovingLeft ? targetKey : undefined,
          after_key: isMovingLeft ? undefined : targetKey,
        },
      });
    }
  };

  // ── Filters / export ──────────────────────────────────────────────────────

  const activeFiltersObj = params.filters || { condition: "and", items: [] };

  const clearAllFilters = () => {
    void setParams({ page: 1, filters: null, segment_id: null });
  };

  const handleExport = () => {
    const selected = table.getSelectedRowModel().rows;
    const rows = selected.length > 0 ? selected : table.getRowModel().rows;
    const csv = rows
      .map((r) => Object.values(r.original).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Users className="size-10 text-muted-foreground/30" />
      <p className="mt-4 text-sm font-medium text-foreground">
        No customers found
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Try adjusting your search or filters
      </p>
    </div>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex h-13 shrink-0 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2.5">
          <Users className="size-4 shrink-0 text-muted-foreground" />
          <h1 className="text-sm font-semibold text-foreground">Customers</h1>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-secondary-foreground">
            {customersQuery.isLoading ? "—" : totalCount}
          </span>
        </div>

        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-3.5" />
          Add customer
        </Button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Always-visible segments sidebar */}
        <CustomerSegmentsSidebar
          selectedAppId={selectedApp?.id}
          activeSegmentId={params.segment_id || null}
          onSelectSegment={(segmentId) => {
            void setParams({ segment_id: segmentId, page: 1 });
          }}
        />

        {/* Main content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* ── Toolbar ──────────────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2 border-b bg-background px-4 py-2.5">
            <div className="relative max-w-85 flex-1">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers…"
                className="h-8 w-full pl-8 text-sm"
                defaultValue={params.q || ""}
                onChange={(e) => debouncedSetSearchQuery(e.target.value)}
              />
            </div>

            <AdvancedFilters
              filters={activeFiltersObj.items}
              filterMode={activeFiltersObj.condition}
              selectedAppId={selectedApp?.id}
              onApply={(newFilters, mode) => {
                void setParams({
                  filters: {
                    condition: mode,
                    items: newFilters as CrmFilter[],
                  },
                  page: 1,
                });
              }}
              onClear={clearAllFilters}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="size-3.5" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                {SORT_OPTIONS.map(({ label, value }) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => setActiveSort(value)}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        "size-3.5",
                        activeSort === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              onClick={handleExport}
            >
              <Download className="size-3.5" />
              Export
            </Button>
          </div>

          {/* ── Table ────────────────────────────────────────────────────── */}
          <DataGridContainer className="flex flex-1 flex-col overflow-hidden border-0 bg-background">
            <DataGrid
              table={table}
              isLoading={
                customersQuery.isLoading || customersQuery.isRefetching
              }
              loadingMode="skeleton"
              recordCount={totalCount}
              emptyMessage={emptyState}
              tableLayout={{
                rowBorder: true,
                stripped: false,
                headerSticky: true,
                columnsResizable: true,
                columnsDraggable: true,
              }}
              tableClassNames={{
                bodyRow: "group/row",
              }}
            >
              <div className="flex-1 overflow-auto">
                <DataGridTableDnd handleDragEnd={handleDragEnd} />
              </div>

              <CustomersPaginationFooter />
            </DataGrid>
          </DataGridContainer>

          <DataTableActionBar table={table} actions={crmActions} />
        </div>
      </div>

      <CustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
