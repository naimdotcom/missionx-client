import { useCreateApp } from "@/api/services/apps/apps.hook";
import type { CreateAppPayload } from "@/api/services/apps/apps.type";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAppDialog() {
  const [createOpen, setCreateOpen] = useState(false);
  const [formData, setFormData] = useState<CreateAppPayload>({
    name: "",
    description: "",
    short_id: "",
  });

  const createApp = useCreateApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("App name is required");
      return;
    }

    try {
      await createApp.mutateAsync(formData);
      toast.success("App created successfully");
      setCreateOpen(false);
      setFormData({ name: "", description: "", short_id: "" });
    } catch (error) {
      toast.error("Failed to create app");
      console.error(error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData({ name: "", description: "", short_id: "" });
    }
    setCreateOpen(newOpen);
  };

  return (
    <div>
      <Dialog open={createOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New App</DialogTitle>
              <DialogDescription>
                Create a new app to manage your workspace and users.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  App Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="My Awesome App"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_id">Short ID</Label>
                <Input
                  id="short_id"
                  placeholder="my-app"
                  value={formData.short_id}
                  onChange={(e) =>
                    setFormData({ ...formData, short_id: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  A unique identifier for your app (optional)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
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
                disabled={createApp.isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"secondary"}
                className="mb-2 md:mb-0"
                disabled={createApp.isPending}
              >
                {createApp.isPending ? "Creating..." : "Create App"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Button size="sm" variant="secondary" onClick={() => setCreateOpen(true)}>
        <Plus className="size-4" />
        Create App
      </Button>
    </div>
  );
}
