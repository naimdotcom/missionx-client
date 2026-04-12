import { AppUser } from "@/api/services/apps/apps.type";
import {
  DataGrid,
  DataGridContainer,
} from "@/components/reui/data-grid/data-grid";
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import { useAuthStore } from "@/stores/auth-store";
import { Plus, Trash2, UserCog } from "lucide-react";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header";
import {
  useListAppUsers,
  useDeleteAppRole,
} from "@/api/services/apps/apps.hook";
import { toast } from "sonner";
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table";

const userSkeleton = (
  <div className="flex items-center gap-3">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-4 w-24" />
  </div>
);

export default function UserManagement() {
  const { selectedApp } = useAuthStore();
  const selectedAppId = selectedApp?.id;

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch,
  } = useListAppUsers(selectedAppId ?? "");

  const deleteRoleMutation = useDeleteAppRole();

  const handleDeleteRole = useMemo(
    () => async (email: string) => {
      if (!selectedAppId || !email) return;

      try {
        await deleteRoleMutation.mutateAsync({ id: selectedAppId, email });
        toast.success("User role removed successfully");
        refetch();
      } catch {
        toast.error("Failed to remove user role");
      }
    },
    [selectedAppId, deleteRoleMutation, refetch],
  );

  const columns = useMemo<ColumnDef<AppUser>[]>(() => {
    const emailColumn: ColumnDef<AppUser> = {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Email" />
      ),
      enableSorting: true,
      enableHiding: false,
      enableResizing: true,
      size: 280,
      meta: { skeleton: userSkeleton },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <UserCog className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium line-clamp-1">
              {user.email || "N/A"}
            </span>
          </div>
        );
      },
    };

    const userIdColumn: ColumnDef<AppUser> = {
      id: "user_id",
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="User ID" />
      ),
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      size: 200,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground font-mono line-clamp-1">
          {row.original.user_id || "N/A"}
        </span>
      ),
    };

    const roleColumn: ColumnDef<AppUser> = {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Role" />
      ),
      enableSorting: true,
      enableHiding: false,
      enableResizing: true,
      size: 150,
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {row.original.role || "No role"}
        </span>
      ),
    };

    const actionsColumn: ColumnDef<AppUser> = {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 100,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => user.email && handleDeleteRole(user.email)}
              disabled={!user.email || deleteRoleMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    };

    return [emailColumn, userIdColumn, roleColumn, actionsColumn];
  }, [handleDeleteRole, deleteRoleMutation]);

  const { table } = useDataTable({
    columns,
    data: usersData?.users || [],
    pageCount: -1,
    manualSorting: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Organization Users</h3>
          <p className="text-sm text-muted-foreground">
            Manage users and their roles within your organization
          </p>
        </div>
        <Button size="sm">
          <Plus className="size-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataGridContainer className="flex flex-1 flex-col overflow-hidden border bg-background">
        <DataGrid
          table={table}
          isLoading={isLoadingUsers}
          loadingMode="skeleton"
          recordCount={usersData?.users?.length || 0}
          tableLayout={{
            rowBorder: true,
            stripped: false,
            headerSticky: true,
            headerBackground: true,
          }}
          emptyMessage={
            <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
              No users found for this app
            </div>
          }
        >
          <div className="flex-1 overflow-auto">
            <DataGridTable />
          </div>
          <div className="border-t bg-background px-4 py-3">
            <DataGridPagination />
          </div>
        </DataGrid>
      </DataGridContainer>
    </div>
  );
}
