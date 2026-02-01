import { useCreateApp } from "@/api/services/apps/apps.hook";

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
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAppDialog() {
  const [createOpen, setCreateOpen] = useState(false);
  const createApp = useCreateApp();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      short_id: "",
    },
    onSubmit: async (values) => {
      if (!values.value.name?.trim()) {
        toast.error("App name is required");
        return;
      }

      try {
        await createApp.mutateAsync(values.value);
        toast.success("App created successfully");
        setCreateOpen(false);
      } catch (error) {
        toast.error("Failed to create app");
        console.error(error);
      }
    },
  });

  return (
    <div>
      <Dialog
        open={createOpen}
        onOpenChange={(newOpen) => {
          setCreateOpen(newOpen);
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
              <DialogTitle>Create New App</DialogTitle>
              <DialogDescription>
                Create a new app to manage your workspace and users.
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
                    <Label htmlFor="name">
                      App Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
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
                    <Label htmlFor="short_id">Short ID</Label>
                    <Input
                      id="short_id"
                      name={field.name}
                      placeholder="my-app"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    <p className="text-xs text-muted-foreground">
                      A unique identifier for your app (optional)
                    </p>
                  </div>
                )}
              />

              <form.Field
                name="description"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
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
                disabled={createApp.isPending}
                onClick={() => setCreateOpen(false)}
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
