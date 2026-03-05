import { useCreateApp } from "@/api/services/apps/apps.hook";
import { TextareaField, TextField } from "@/components/form/FormField";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAppDialog() {
  const createApp = useCreateApp();
  const [createOpen, setCreateOpen] = useState(false);

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
                  <TextField
                    field={field}
                    label="App Name"
                    placeholder="ABC App"
                    description="The name of your app"
                  />
                )}
              />

              {/* <form.Field
                name="short_id"
                children={(field) => (
                  <TextField
                    field={field}
                    label="Short ID"
                    placeholder="abc-app"
                    description="A unique identifier for your app (optional)"
                  />
                )}
              /> */}

              <form.Field
                name="description"
                children={(field) => (
                  <TextareaField
                    field={field}
                    label="Description"
                    placeholder="Describe your app..."
                  />
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
