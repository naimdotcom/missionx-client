import { Customer } from "@/api/index.ts";
import { useCustomers, useUpdateAppField } from "@/api/services/crm/crm.hook";
import {
  DataTableActionBar,
  type ActionBarAction,
} from "@/components/reui/data-grid/data-table-action-bar";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useAuthStore } from "@/stores/auth-store";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Download,
  Plus,
  Search,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import { useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
} from "~/components/reui/data-grid/data-grid";
import { DataGridPagination } from "~/components/reui/data-grid/data-grid-pagination";
import { DataGridTableDnd } from "~/components/reui/data-grid/data-grid-table-dnd";
import { AdvancedFilters } from "./components/AdvancedFilters";
import { CustomerModal } from "./components/CustomerModal";
import { SegmentsList } from "./components/SegmentsList";
import {
  buildApiParams,
  CrmQueryState,
  QUERY_STATE_PARSERS,
  SEARCH_DEBOUNCE_MS,
  type CrmFilter,
} from "./const";
import { fixedCrmColumns } from "./crm-columns.tsx";

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
      a.download = "selected-rows.csv";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
];

export default function CrmPage() {
  const { selectedApp } = useAuthStore();
  const [isSegmentsCollapsed, setIsSegmentsCollapsed] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // nuqs search params management
  const [params, setParams] = useQueryStates(QUERY_STATE_PARSERS);

  // const [columnOrder, setColumnOrder] = useQueryState(
  //   "order",
  //   parseAsJson<string[]>((val) => val as string[]).withDefault([]),
  // );

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => {
    void setParams({ q: value || null, page: 1 });
  }, SEARCH_DEBOUNCE_MS);

  const query = params as CrmQueryState;
  const apiParams = buildApiParams(query, selectedApp?.id);

  const updateAppFieldMutate = useUpdateAppField();
  const customersQuery = useCustomers(apiParams);

  const dynamicColumns = useMemo(
    () =>
      customersQuery?.data?.app_fields.fields
        .filter((field) => field.visible)
        .map((field) => ({
          size: field.width,
          id: field.key || field.name || "",
          accessorKey: field.key || field.name || "",
          header: field.name || (field.key || "").replace(/_/g, " "),
        })) ?? [],
    [customersQuery],
  );

  const [localColumnSizing, setLocalColumnSizing] = useState<
    Record<string, number>
  >({});

  const defaultSizing = useMemo(() => {
    const sizing: Record<string, number> = {};
    customersQuery.data?.app_fields.fields?.forEach((field) => {
      const key = field.key || field.name || "";
      if (key && field.width) {
        sizing[key] = field.width;
      }
    });
    return sizing;
  }, [customersQuery.data?.app_fields.fields]);

  const columnSizing = useMemo(
    () => ({
      ...defaultSizing,
      ...localColumnSizing,
    }),
    [defaultSizing, localColumnSizing],
  );

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
    columns: [...fixedCrmColumns, ...dynamicColumns],
    data: customersQuery?.data?.customers ?? [],
    pageCount: -1,
    manualSorting: false,
    initialState: {
      pagination: { pageIndex: params.page - 1, pageSize: params.perPage },
    },
    state: { columnSizing },
    columnResizeMode: "onChange",
    // onColumnOrderChange: (updater) => {
    //   const nextOrder = resolveUpdater(updater, columnOrder);
    //   setColumnOrder(nextOrder);
    // },
    onColumnSizingChange: (update) => {
      const columnSize =
        typeof update === "function" ? update(columnSizing) : update;
      setLocalColumnSizing(columnSize);

      const columnId = table.getState().columnSizingInfo?.isResizingColumn;
      if (typeof columnId === "string" && columnSize[columnId]) {
        debouncedResizeUpdate(columnId, columnSize[columnId]);
      }
    },
  });

  const activeFiltersObj = params.filters || { condition: "and", items: [] };

  const clearAllFilters = () => {
    setParams({ page: 1, filters: null, segment_id: null });
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

      // Persist order to backend.
      const movedKey = active.id as string;
      const targetKey = over.id as string;
      const isMovingLeft = newIndex < oldIndex;

      updateAppFieldMutate.mutate({
        action: "move",
        app_id: selectedApp!.id,
        payload: {
          move_key: movedKey,
          before_key: isMovingLeft ? targetKey : undefined,
          after_key: isMovingLeft ? undefined : targetKey,
        },
      });
    }
  };

  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden">
      <div className="flex flex-col gap-3 border-b bg-muted/40 px-4 py-3 sm:px-6 sm:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:flex-1">
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
            selectedAppId={selectedApp?.id}
            onApply={(newFilters, mode) => {
              setParams({
                filters: { condition: mode, items: newFilters as CrmFilter[] },
                page: 1,
              });
            }}
            onClear={clearAllFilters}
          />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:w-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground"
            onClick={() => setIsSegmentsCollapsed((prev) => !prev)}
            title={
              isSegmentsCollapsed
                ? "Show segments panel"
                : "Hide segments panel"
            }
          >
            {isSegmentsCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="size-4" /> Add Customer
          </Button>
        </div>
      </div>

      <div
        className={`grid min-h-0 overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out ${
          isSegmentsCollapsed
            ? "grid-cols-[0px_minmax(0,1fr)]"
            : "grid-cols-[300px_minmax(0,1fr)]"
        }`}
      >
        <div className="overflow-hidden">
          <SegmentsList
            selectedAppId={selectedApp?.id}
            activeSegmentId={params.segment_id || null}
            onSelectSegment={(segmentId) => {
              setParams({
                segment_id: segmentId,
                page: 1,
              });
            }}
          />
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden">
          <DataGridContainer className="flex flex-1 flex-col overflow-hidden border-0 bg-background">
            <DataGrid
              table={table}
              isLoading={
                customersQuery.isLoading || customersQuery.isRefetching
              }
              loadingMode="skeleton"
              recordCount={customersQuery.data?.customers.length || 0}
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
      </div>

      <CustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
