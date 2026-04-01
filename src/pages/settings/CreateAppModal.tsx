import { useCreateApp, useUpdateApp } from "@/api/services/apps/apps.hook";
import { App } from "@/api/services/apps/apps.type";
import { TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";

interface CreateAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: App | null;
}

export function CreateAppModal({
  open,
  onOpenChange,
  initialData,
}: CreateAppModalProps) {
  const createApp = useCreateApp();
  const updateApp = useUpdateApp();
  const isEditing = !!initialData;
  const isPending = createApp.isPending || updateApp.isPending;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
    onSubmit: (values) => {
      const payload = {
        name: values.value.name,
        description: values.value.description,
      };

      if (isEditing && initialData?.id) {
        updateApp.mutate(
          { id: initialData.id, payload },
          {
            onSuccess: () => {
              onOpenChange(false);
            },
          },
        );
      } else {
        createApp.mutate(payload, {
          onSuccess: () => {
            onOpenChange(false);
          },
        });
      }
    },
    validators: {
      onChange({ value }) {
        if (!value.name || value.name.length < 3) {
          return "Name must be at least 3 characters";
        }
        return undefined;
      },
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit App" : "Create App"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of your app below."
              : "Fill in the details to create a new app instance."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 py-4"
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value || value.length < 3
                  ? "Name must be at least 3 characters"
                  : undefined,
            }}
            children={(field) => (
              <TextField
                field={field}
                label="App Name *"
                placeholder="My Awesome App"
              />
            )}
          />

          <form.Field
            name="description"
            children={(field) => (
              <TextareaField
                field={field}
                label="Description"
                placeholder="What does this app do?"
              />
            )}
          />

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending && <Spinner className="mr-2 h-4 w-4" />}
              {isEditing ? "Save Changes" : "Create App"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
