import { useListMyApps } from "@/api/services/apps/apps.hook";
import type { App, Apps } from "@/api/services/apps/apps.type";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AppDetailsSheet } from "./components/AppDetailsSheet";
import { AppFilters } from "./components/AppFilters";
import { AppsGrid } from "./components/AppsGrid";
import { CreateAppDialog } from "./components/CreateAppDialog";
import { DeleteAppDialog } from "./components/DeleteAppDialog";
import { EditAppDialog } from "./components/EditAppDialog";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./const";

function AppsPage() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);

  const { data } = useListMyApps({
    page,
    page_size: DEFAULT_PAGE_SIZE,
  });

  const appsData = data as Apps | undefined;
  const apps = appsData?.apps || [];
  const total = appsData?.total || 0;

  // Client-side search filtering
  const filteredApps = useMemo(() => {
    if (!apps.length) return [];
    if (!searchQuery.trim()) return apps;

    const query = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.name?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query) ||
        app.short_id?.toLowerCase().includes(query),
    );
  }, [apps, searchQuery]);

  const handleEdit = (app: App) => {
    setSelectedApp(app);
    setEditDialogOpen(true);
  };

  const handleDelete = (app: App) => {
    setSelectedApp(app);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (app: App) => {
    setSelectedApp(app);
    setDetailsSheetOpen(true);
  };

  const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b px-4 md:px-6 py-4 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Apps</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Manage your applications and workspaces
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="size-4 mr-2" />
            Create App
          </Button>
        </div>

        <div className="mt-4">
          <AppFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        <AppsGrid
          apps={filteredApps}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Pagination */}
      {filteredApps.length > 0 && totalPages > 1 && (
        <div className="border-t px-4 md:px-6 py-3 md:py-4 shrink-0 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-xs md:text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Dialogs & Sheets */}
      <CreateAppDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditAppDialog
        app={selectedApp}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteAppDialog
        app={selectedApp}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />

      <AppDetailsSheet
        app={selectedApp}
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
      />
    </div>
  );
}

export default AppsPage;
