import { App } from "@/api/services/apps/apps.type";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, Trash } from "lucide-react";
import { DataGridColumnHeader } from "~/components/reui/data-grid/data-grid-column-header";

interface GetAppsColumnsProps {
  onEdit: (app: App) => void;
  onDelete: (app: App) => void;
}

export function getAppsColumns({
  onEdit,
  onDelete,
}: GetAppsColumnsProps): ColumnDef<App>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="App Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium truncate">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground truncate max-w-xs">
          {row.original.description || "No description provided"}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => (
        <div className="text-sm whitespace-nowrap">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "PPP")
            : "N/A"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const app = row.original;
        return (
          <div className="flex justify-end gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(app)}>
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Edit</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(app)}
            >
              <Trash className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];
}
