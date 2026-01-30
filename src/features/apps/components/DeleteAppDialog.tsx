import { useDeleteApp } from "@/api/services/apps/apps.hook";
import type { App } from "@/api/services/apps/apps.type";
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
import { toast } from "sonner";

type DeleteAppDialogProps = {
  app: App | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAppDialog({
  app,
  open,
  onOpenChange,
}: DeleteAppDialogProps) {
  const deleteApp = useDeleteApp();

  const handleDelete = async () => {
    if (!app?.id) return;

    try {
      await deleteApp.mutateAsync(app.id);
      toast.success("App deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete app");
      console.error(error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{app?.name}</strong> and remove
            all associated data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteApp.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteApp.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteApp.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
