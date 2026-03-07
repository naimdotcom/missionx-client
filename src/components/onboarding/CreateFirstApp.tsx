import { useCreateApp } from "@/api/services/apps/apps.hook";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import {
  CheckCircle2,
  LayoutGrid,
  MessagesSquare,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { TextareaField, TextField } from "../form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function CreateFirstApp() {
  const createApp = useCreateApp();
  const setSelectedApp = useAuthStore((state) => state.setSelectedApp);

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
        const newApp = await createApp.mutateAsync(values.value);
        toast.success("App created successfully! 🎉");

        // Set as selected app automatically
        if (newApp) {
          setSelectedApp(newApp);
        }
      } catch (error) {
        toast.error("Failed to create app");
        console.error(error);
      }
    },
  });

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Panel - Value Proposition - Show second on mobile */}
      <div className=" hidden relative md:flex w-full flex-col justify-between overflow-hidden bg-primary/5 p-6 md:p-8 lg:order-first lg:w-1/2 lg:p-12 xl:p-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 space-y-6 lg:space-y-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg md:h-10 md:w-10">
                <Rocket className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <span className="text-lg font-bold tracking-tight md:text-xl">
                MissionX
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl lg:text-5xl">
              Launch your workspace
            </h1>
            <p className="max-w-md text-sm text-muted-foreground md:text-base lg:text-lg">
              Create your first app to organize conversations, manage support
              channels, and collaborate with your team.
            </p>
          </div>

          <div className="grid gap-4 md:gap-6 lg:space-y-6 lg:block">
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="rounded-lg bg-background p-1.5 shadow-xs ring-1 ring-border lg:p-2">
                <LayoutGrid className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
              </div>
              <div className="space-y-0.5 lg:space-y-1">
                <h3 className="font-semibold text-sm lg:text-base">
                  Centralized Workspace
                </h3>
                <p className="text-xs text-muted-foreground lg:text-sm">
                  One place for all your customer interactions and support
                  tickets.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex lg:flex items-start gap-3 lg:gap-4">
              <div className="rounded-lg bg-background p-1.5 shadow-xs ring-1 ring-border lg:p-2">
                <MessagesSquare className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
              </div>
              <div className="space-y-0.5 lg:space-y-1">
                <h3 className="font-semibold text-sm lg:text-base">
                  Unified Messaging
                </h3>
                <p className="text-xs text-muted-foreground lg:text-sm">
                  Connect Facebook, Instagram, and more channels effortlessly.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex lg:flex items-start gap-3 lg:gap-4">
              <div className="rounded-lg bg-background p-1.5 shadow-xs ring-1 ring-border lg:p-2">
                <Zap className="h-4 w-4 text-primary lg:h-6 lg:w-6" />
              </div>
              <div className="space-y-0.5 lg:space-y-1">
                <h3 className="font-semibold text-sm lg:text-base">
                  Instant Setup
                </h3>
                <p className="text-xs text-muted-foreground lg:text-sm">
                  Get up and running in seconds. No complex configuration
                  needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 hidden lg:block">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Secure & Scalable Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form - Show first on mobile */}
      <div className="flex w-full flex-col justify-center bg-background p-6 md:p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="mx-auto w-full max-w-lg">
          <Card className="border-0 shadow-none sm:border sm:shadow-xs">
            <CardHeader className="space-y-1 pb-4 text-center md:pb-6 sm:text-left">
              <CardTitle className="text-xl font-bold md:text-2xl">
                Design your workspace
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Let&apos;s start by giving your new app a name and identity.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <form.Field name="name">
                    {(field) => (
                      <TextField
                        field={field}
                        label="App Name"
                        placeholder="e.g., Acme Support"
                        required
                        description="Visible to your team and customers"
                      />
                    )}
                  </form.Field>

                  {/* <form.Field name="short_id">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Workspace ID"
                        placeholder="e.g., acme-support"
                        description="Unique identifier for URLs (optional)"
                      />
                    )}
                  </form.Field> */}

                  <form.Field name="description">
                    {(field) => (
                      <TextareaField
                        field={field}
                        label="Description"
                        placeholder="Briefly describe what this workspace is for..."
                        description="Helps your team understand the purpose"
                        rows={3}
                      />
                    )}
                  </form.Field>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-sm font-semibold shadow-lg transition-all hover:shadow-xl md:text-base"
                    disabled={createApp.isPending}
                  >
                    {createApp.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating Workspace...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Create App & Continue
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-muted-foreground lg:hidden md:text-sm">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-500 md:h-4 md:w-4" />
              <span>Secure & Scalable Infrastructure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
