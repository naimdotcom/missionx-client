import { useListApps } from "@/api/services/apps/apps.hook";
import { App } from "@/api/services/apps/apps.type";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { Column, ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";
import { DEFAULT_PAGE_SIZE } from "../const";
import { AppDetailsSheet } from "./AppDetailsSheet";
import { DeleteAppDialog } from "./DeleteAppDialog";
import { EditAppDialog } from "./EditAppDialog";

export function AppsTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [perPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
  );

  const { data } = useListApps({
    page: String(page),
    query: name ?? undefined,
    page_size: String(perPage),
  });

  const apps = data?.apps || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / perPage);

  const columns = useMemo<ColumnDef<App>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }: { column: Column<App, unknown> }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ cell }) => <AppDetailsSheet app={cell.row.original} />,
        meta: {
          label: "Name",
          variant: "text",
          placeholder: "Search by name...",
        },
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includesString",
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="hidden sm:block text-sm max-w-xs truncate">
            {row.original.description || "-"}
          </div>
        ),
      },
      {
        id: "short_id",
        accessorKey: "short_id",
        header: "Short ID",
        cell: ({ row }) => (
          <span className="hidden md:inline font-mono text-xs">
            {row.original.short_id}
          </span>
        ),
      },
      {
        id: "user_role",
        accessorKey: "user_role",
        header: "Role",
        cell: ({ row }) => (
          <span className="hidden lg:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
            {row.original.user_role?.toLowerCase().replace("_", " ")}
          </span>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => (
          <span className="hidden lg:block text-muted-foreground text-xs">
            {row.original.created_at
              ? format(new Date(row.original.created_at), "MMM d, yyyy")
              : "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <EditAppDialog app={row.original} />
            <DeleteAppDialog app={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useDataTable({
    data: apps,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id ?? "",
    shallow: false,
    scroll: false,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table.table} className="flex-1 overflow-hidden">
        <DataTableToolbar table={table.table} />
      </DataTable>
    </div>
  );
}
