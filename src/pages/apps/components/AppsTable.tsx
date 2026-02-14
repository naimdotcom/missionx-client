import { useListApps } from "@/api/services/apps/apps.hook";
import { App } from "@/api/services/apps/apps.type";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { useSearch } from "@tanstack/react-router";
import { Column, ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { AppDetailsSheet } from "./AppDetailsSheet";
import { DeleteAppDialog } from "./DeleteAppDialog";
import { EditAppDialog } from "./EditAppDialog";

type AppSearch = {
  page?: number;
  name?: string;
  perPage?: number;
};

export function AppsTable() {
  const searchParams = useSearch({ from: "/_private/apps" }) as AppSearch;

  const name = searchParams.name;
  const page = searchParams.page || 1;
  const perPage = searchParams.perPage || 10;

  const { data, isLoading } = useListApps({
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
        size: 250,
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
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: true,
        filterFn: "includesString",
      },
      {
        id: "description",
        accessorKey: "description",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }: { column: Column<App, unknown> }) => (
          <DataTableColumnHeader column={column} label="Description" />
        ),
        cell: ({ row }) => (
          <div className="text-sm max-w-xs truncate table-cell">
            {row.original.description || "-"}
          </div>
        ),
      },
      {
        id: "short_id",
        accessorKey: "short_id",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }: { column: Column<App, unknown> }) => (
          <DataTableColumnHeader column={column} label="Short ID" />
        ),
        cell: ({ cell }) => {
          const shortID = cell.getValue<App["short_id"]>();
          return (
            <div className="text-sm max-w-xs truncate table-cell">
              {shortID}
            </div>
          );
        },
      },
      {
        id: "user_role",
        accessorKey: "user_role",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }: { column: Column<App, unknown> }) => (
          <DataTableColumnHeader column={column} label="Role" />
        ),
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="text-sm max-w-xs truncate table-cell capitalize"
          >
            {row.original.user_role?.toLowerCase().replace("_", " ")}
          </Badge>
        ),
      },
      {
        id: "created_at",
        enableHiding: false,
        enableSorting: false,
        accessorKey: "created_at",
        header: ({ column }: { column: Column<App, unknown> }) => (
          <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ row }) => (
          <span className="text-sm max-w-xs truncate table-cell">
            {row.original.created_at
              ? format(new Date(row.original.created_at), "MMM d, yyyy")
              : "-"}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        accessorKey: "actions",
        header: ({ column }: { column: Column<App, unknown> }) => (
          <DataTableColumnHeader column={column} label="" />
        ),
        cell: ({ row }) => <AppActionsDropdown app={row.original} />,
      },
    ],
    [],
  );

  const table = useDataTable({
    data: apps,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id ?? "",
    debounceMs: 400,
    enableAdvancedFilter: false,
    initialState: {
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        description: true,
        short_id: true,
        user_role: true,
        created_at: true,
      },
    },
  });

  if (isLoading) {
    return <DataTableSkeleton columnCount={10} />;
  }

  return (
    <div className="data-table-container">
      <DataTable table={table.table} className="py-1 font-normal group">
        <DataTableToolbar table={table.table} />
      </DataTable>
    </div>
  );
}

function AppActionsDropdown({ app }: { app: App }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditAppDialog
        app={app}
        isOpen={openEdit}
        onCancel={() => setOpenEdit(false)}
      />
      <DeleteAppDialog
        app={app}
        isOpen={openDelete}
        onCancel={() => setOpenDelete(false)}
      />
    </div>
  );
}
