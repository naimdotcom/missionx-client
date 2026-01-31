import { useUpdateApp } from "@/api/services/apps/apps.hook";
import type { App } from "@/api/services/apps/apps.type";
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
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

type EditAppDialogProps = {
  app: App | null;
  isOpen?: boolean;
  onCancel?: () => void;
};

export function EditAppDialog({ app, isOpen, onCancel }: EditAppDialogProps) {
  const updateApp = useUpdateApp();

  const form = useForm({
    defaultValues: {
      name: app?.name || "",
      short_id: app?.short_id || "",
      description: app?.description || "",
    },
    onSubmit: async (values) => {
      if (!app?.id) return;

      if (!values.value.name?.trim()) {
        toast.error("App name is required");
        return;
      }

      try {
        await updateApp.mutateAsync({ id: app.id, payload: values.value });
        toast.success("App updated successfully");
        onCancel?.();
      } catch (error) {
        toast.error("Failed to update app");
        console.error(error);
      }
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        if (!newOpen) onCancel?.();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
            <DialogDescription>
              Update your app information and settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value?.trim() ? "App name is required" : undefined,
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-name">
                    App Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    name={field.name}
                    placeholder="My Awesome App"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="short_id"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-short_id">Short ID</Label>
                  <Input
                    id="edit-short_id"
                    name={field.name}
                    placeholder="my-app"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name={field.name}
                    placeholder="Describe what this app does..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={3}
                  />
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onCancel?.();
              }}
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
  );
}
