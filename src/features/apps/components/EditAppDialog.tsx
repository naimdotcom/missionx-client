import { useUpdateApp } from "@/api/services/apps/apps.hook";
import type { App, CreateAppPayload } from "@/api/services/apps/apps.type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type EditAppDialogProps = {
  app: App | null;
};

export function EditAppDialog({ app }: EditAppDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateAppPayload>>({
    name: "",
    description: "",
    short_id: "",
  });

  const updateApp = useUpdateApp();

  useEffect(() => {
    if (app && open) {
      setFormData({
        name: app.name || "",
        description: app.description || "",
        short_id: app.short_id || "",
      });
    }
  }, [app, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!app?.id) return;

    if (!formData.name?.trim()) {
      toast.error("App name is required");
      return;
    }

    try {
      await updateApp.mutateAsync({ id: app.id, payload: formData });
      toast.success("App updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update app");
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit App</DialogTitle>
              <DialogDescription>
                Update your app information and settings.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">
                  App Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  placeholder="My Awesome App"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-short_id">Short ID</Label>
                <Input
                  id="edit-short_id"
                  placeholder="my-app"
                  value={formData.short_id}
                  onChange={(e) =>
                    setFormData({ ...formData, short_id: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe what this app does..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
                disabled={updateApp.isPending}
              >
                Cancel
              </Button>
              <Button
                variant={"secondary"}
                type="submit"
                disabled={updateApp.isPending}
              >
                {updateApp.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        <Edit className="size-4" />
      </Button>
    </div>
  );
}
