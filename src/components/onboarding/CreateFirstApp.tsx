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
    <div className="flex min-h-screen w-full flex-col bg-background lg:flex-row">
      {/* Left Panel - Value Proposition */}
      <div className="relative flex w-full flex-col justify-between overflow-hidden bg-primary/5 p-8 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
                <Rocket className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">MissionX</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Launch your workspace
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Create your first app to organize conversations, manage support
              channels, and collaborate with your team.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-background p-2 shadow-sm ring-1 ring-border">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Centralized Workspace</h3>
                <p className="text-sm text-muted-foreground">
                  One place for all your customer interactions and support
                  tickets.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-background p-2 shadow-sm ring-1 ring-border">
                <MessagesSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Unified Messaging</h3>
                <p className="text-sm text-muted-foreground">
                  Connect Facebook, Instagram, and more channels effortlessly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-background p-2 shadow-sm ring-1 ring-border">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Instant Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Get up and running in seconds. No complex configuration
                  needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 hidden lg:block">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Secure & Scalable Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col justify-center p-4 lg:w-1/2 lg:p-12 xl:p-16">
        <div className="mx-auto w-full max-w-lg">
          <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardHeader className="space-y-1 pb-6 text-center sm:text-left">
              <CardTitle className="text-2xl font-bold">
                Design your workspace
              </CardTitle>
              <CardDescription className="text-base">
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

                  <form.Field name="short_id">
                    {(field) => (
                      <TextField
                        field={field}
                        label="Workspace ID"
                        placeholder="e.g., acme-support"
                        description="Unique identifier for URLs (optional)"
                      />
                    )}
                  </form.Field>

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
                    className="w-full text-base font-semibold shadow-lg transition-all hover:shadow-xl"
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

          <div className="mt-8 text-center text-sm text-muted-foreground lg:hidden">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Secure & Scalable Infrastructure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
