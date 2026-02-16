import { useCreateApp } from "@/api/services/apps/apps.hook";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import { Rocket, Sparkles } from "lucide-react";
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
    <div className="flex gap-10 overflow-auto min-h-screen w-full items-center justify-center p-5">
      {/* Welcome Header */}
      {/* <div className="text-center space-y-4">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative bg-primary/10 p-6 rounded-full">
            <Rocket className="w-16 h-16 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to MissionX! 🚀
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Let's get started by creating your first app. This will be your
            workspace for managing customer conversations.
          </p>
        </div>
      </div> */}

      {/* Form Card */}
      <Card className="border-2 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-2xl">Welcome to MissionX! 🚀</CardTitle>
          </div>
          <CardDescription>
            Let's get started by creating your first app. This will be your
            workspace for managing customer conversations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
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
                    placeholder="e.g., Customer Support Hub"
                    required
                    description="Choose a name that represents your business or team"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <TextareaField
                    field={field}
                    label="Description"
                    placeholder="e.g., Central hub for managing customer inquiries across Facebook and Instagram"
                    description="A brief description of what this app is for (optional)"
                    rows={3}
                  />
                )}
              </form.Field>

              <form.Field name="short_id">
                {(field) => (
                  <TextField
                    field={field}
                    label="Short ID"
                    placeholder="e.g., cs-hub"
                    description="A unique identifier for your app (optional, lowercase letters and hyphens)"
                  />
                )}
              </form.Field>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
                disabled={createApp.isPending}
              >
                {createApp.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Create App & Continue
                  </span>
                )}
              </Button>
            </div>
          </form>

          {/* Info Section */}
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              What happens next?
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Your app will be created instantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>
                  You'll be guided to connect your first channel (Facebook or
                  Instagram)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>
                  Start managing customer conversations from your dashboard
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
