import type { App } from "@/api/services/apps/apps.type";
import { Empty } from "@/components/ui/empty";
import { AppCard } from "./AppCard";

type AppsGridProps = {
  apps: App[];
  onEdit: (app: App) => void;
  onDelete: (app: App) => void;
  onViewDetails: (app: App) => void;
};

export function AppsGrid({
  apps,
  onEdit,
  onDelete,
  onViewDetails,
}: AppsGridProps) {
  if (!apps.length) {
    return (
      <Empty>
        <div className="text-center">
          <h3 className="text-lg font-semibold">No apps found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Get started by creating your first app
          </p>
        </div>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {apps.map((app) => (
        <AppCard
          key={app.id}
          app={app}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
