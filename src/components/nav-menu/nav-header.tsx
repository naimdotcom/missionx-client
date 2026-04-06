import { useCreateApp, useListApps } from "@/api/services/apps/apps.hook";
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
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import { ChevronsUpDown, Globe2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

function NavHeader() {
  const { open } = useSidebar();
  const { selectedApp, setSelectedApp } = useAuthStore();
  const myAppsQuery = useListApps({ page: "1", page_size: "10" });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="text-2xl font-bold pb-4 ml-1">
          {open ? "MissionX" : "M"}
        </div>

        {myAppsQuery.isPending && (
          <Skeleton className="w-full h-10 rounded-xl" />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full h-10 shadow-xs rounded-xl gap-2 bg-background border"
            >
              <div className="bg-border ml-0.75 flex aspect-square size-6 items-center justify-center rounded-lg">
                <Globe2 className="size-4" />
              </div>
              <span className="flex-1 text-left truncate text-foreground/80">
                {selectedApp?.name || "Select Project"}
              </span>
              <ChevronsUpDown className="size-3 text-muted-foreground/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Apps
            </DropdownMenuLabel>
            {myAppsQuery.data?.apps?.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setSelectedApp(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Globe2 className="size-3.5 shrink-0" />
                </div>
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <AddAppButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavHeader;

function AddAppButton() {
  const [createOpen, setCreateOpen] = useState(false);
  const createApp = useCreateApp();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      short_id: "",
    },
    onSubmit: async (values) => {
      try {
        await createApp.mutateAsync(values.value);
        toast.success("App created successfully");
        setCreateOpen(false);
        form.reset();
      } catch (error) {
        toast.error("Failed to create app");
        console.error(error);
      }
    },
  });

  return (
    <>
      <DropdownMenuItem
        className="gap-2 p-2"
        onSelect={(e) => {
          e.preventDefault();
          setCreateOpen(true);
        }}
      >
        <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
          <Plus className="size-4" />
        </div>
        <div className="text-muted-foreground font-medium">Add App</div>
      </DropdownMenuItem>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-125">
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
                validators={{
                  onChange: ({ value }) =>
                    !value?.trim() ? "Short ID is required" : undefined,
                }}
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
    </>
  );
}
