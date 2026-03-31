import { useDeleteApp, useListMyApps } from "@/api/services/apps/apps.hook";
import { App } from "@/api/services/apps/apps.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTable } from "@/hooks/use-data-table";
import { Plus, RefreshCw } from "lucide-react";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useMemo, useState } from "react";
import {
  DataGrid,
  DataGridContainer,
} from "~/components/reui/data-grid/data-grid";
import { DataGridPagination } from "~/components/reui/data-grid/data-grid-pagination";
import { DataGridTable } from "~/components/reui/data-grid/data-grid-table";
import { CreateAppModal } from "./CreateAppModal";
import { getAppsColumns } from "./apps-columns";

export function AppsSettings() {
  const [paginationSearchParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    page_size: parseAsInteger.withDefault(10),
  });

  const { data, isLoading, refetch, isFetching } = useListMyApps({
    page: paginationSearchParams.page,
    page_size: paginationSearchParams.page_size,
  });

  const deleteApp = useDeleteApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const [appToDelete, setAppToDelete] = useState<App | null>(null);

  const confirmDelete = () => {
    if (appToDelete) {
      deleteApp.mutate(appToDelete.id, {
        onSettled: () => setAppToDelete(null),
      });
    }
  };

  const handleEdit = (app: App) => {
    setEditingApp(app);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (app: App) => {
    setAppToDelete(app);
  };

  const columns = useMemo(
    () => getAppsColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [],
  );

  const dataTable = useDataTable({
    data: data?.apps || [],
    columns,
    pageCount: data?.total
      ? Math.ceil(data.total / paginationSearchParams.page_size)
      : 1,
    rowCount: data?.total || 0,
    getRowId: (row) => row.id,
    manualPagination: true,
  });

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Apps</h3>
          <p className="text-sm text-muted-foreground">Manage your apps.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            onClick={() => {
              setEditingApp(null);
              setIsCreateModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create App
          </Button>
        </div>
      </div>

      <div className="w-full border rounded-lg flex flex-col overflow-hidden min-h-[300px] md:h-[500px]">
        {isLoading ? (
          <div className="p-4 space-y-4 flex-1 overflow-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <DataGridContainer className="flex flex-1 flex-col overflow-hidden border-0 bg-background">
            <DataGrid
              table={dataTable.table}
              isLoading={isLoading}
              recordCount={data?.total || 0}
            >
              <div className="flex-1 overflow-auto min-w-0">
                <DataGridTable />
              </div>
              <div className="border-t p-2 shrink-0">
                <DataGridPagination />
              </div>
            </DataGrid>
          </DataGridContainer>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateAppModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          initialData={editingApp}
        />
      )}

      <AlertDialog
        open={!!appToDelete}
        onOpenChange={(open) => !open && setAppToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the app
              "{appToDelete?.name}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteApp.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteApp.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteApp.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
