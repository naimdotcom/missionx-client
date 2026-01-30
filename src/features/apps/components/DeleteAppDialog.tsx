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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DeleteAppDialogProps = {
  app: App | null;
};

export function DeleteAppDialog({ app }: DeleteAppDialogProps) {
  const deleteApp = useDeleteApp();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (!app?.id) return;

    try {
      await deleteApp.mutateAsync(app.id);
      toast.success("App deleted successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete app");
      console.error(error);
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{app?.name}</strong> and
              remove all associated data. This action cannot be undone.
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
      <Button size="sm" variant="link" onClick={() => setOpen(true)}>
        <Trash2 className="size-4 text-red-500" />
      </Button>
    </div>
  );
}
