import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import type { ExtendedColumnSort } from "@/components/types/data-table";

const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;
const PAGE_SIZE_DEFAULT = 10;

interface UseDataTableProps<TData>
  extends
    Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
      | "onPaginationChange"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  debounceMs?: number;
  throttleMs?: number;
  enableAdvancedFilter?: boolean;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    enableAdvancedFilter = false,
    ...tableProps
  } = props;

  // Navigation
  const navigate = useNavigate() as any;
  // Using generic search for flexibility
  const search: any = useSearch({ strict: false });

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  // Pagination state initialized from URL or defaults
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: search.page
      ? Number(search.page) - 1
      : (initialState?.pagination?.pageIndex ?? 0),
    pageSize: search.perPage
      ? Number(search.perPage)
      : (initialState?.pagination?.pageSize ?? PAGE_SIZE_DEFAULT),
  });

  const [sorting, setSorting] = React.useState<SortingState>(
    initialState?.sorting ?? [],
  );

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );

  // Update URL function
  const updateUrl = React.useCallback(
    (newParams: Record<string, unknown>) => {
      void navigate({
        search: (prev: any) => {
          const next = { ...prev, ...newParams };
          // Remove undefined or null values to keep URL clean
          Object.keys(next).forEach(
            (key) =>
              (next[key] === undefined ||
                next[key] === null ||
                next[key] === "") &&
              delete next[key],
          );
          return next;
        },
      });
    },
    [navigate],
  );

  // Debounced navigation for inputs
  const debouncedUpdateUrl = useDebouncedCallback(updateUrl, debounceMs);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      setPagination(newPagination);

      // Pagination changes are immediate
      updateUrl({
        page: newPagination.pageIndex + 1,
        perPage: newPagination.pageSize,
      });
    },
    [pagination, updateUrl],
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;
      setSorting(newSorting);
    },
    [sorting],
  );

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      const newFilters =
        typeof updaterOrValue === "function"
          ? updaterOrValue(columnFilters)
          : updaterOrValue;

      setColumnFilters(newFilters);

      // Convert filters to object
      const filterObj = newFilters.reduce<Record<string, unknown>>((acc, f) => {
        acc[f.id] = Array.isArray(f.value) ? f.value[0] : f.value;
        return acc;
      }, {});

      // Handle removed filters properly by setting them to undefined in the update
      columnFilters.forEach((f) => {
        if (!newFilters.some((nf) => nf.id === f.id)) {
          filterObj[f.id] = undefined;
        }
      });

      // Reset to page 1 on filter change
      // Use debounce for filters to prevent rapid URL updates on typing
      debouncedUpdateUrl({
        ...filterObj,
        page: 1,
      });
    },
    [columnFilters, debouncedUpdateUrl],
  );

  // Sync from URL changes (back button support)
  React.useEffect(() => {
    setPagination({
      pageIndex: search.page ? Number(search.page) - 1 : 0,
      pageSize: search.perPage ? Number(search.perPage) : PAGE_SIZE_DEFAULT,
    });
  }, [search.page, search.perPage]);

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return React.useMemo(
    () => ({ table, debounceMs, throttleMs }),
    [table, debounceMs, throttleMs],
  );
}
