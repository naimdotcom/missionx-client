// Signup page

import { useRegister } from "@/api";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/_public/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: { email: "", password: "", phone: "" },
    onSubmit: async ({ value }) => {
      registerMutation.mutate(
        { email: value.email, password: value.password, phone: value.phone },
        {
          onSuccess: () => navigate({ to: "/login" }),
          onError: (err) => {
            if (axios.isAxiosError(err)) {
              toast.error(err.response?.data?.detail);
            }
          },
        },
      );
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="phone"
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="text-sm font-medium mb-1.5 block"
              >
                Phone
              </label>
              <Input
                required
                type="text"
                id={field.name}
                name={field.name}
                placeholder="1234567890"
                onBlur={field.handleBlur}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors ? (
                <em className="text-destructive text-xs">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="text-sm font-medium mb-1.5 block"
              >
                Email
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                placeholder="agent@example.com"
                required
              />
              {field.state.meta.errors ? (
                <em className="text-destructive text-xs">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <div>
              <label
                htmlFor={field.name}
                className="text-sm font-medium mb-1.5 block"
              >
                Password
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          )}
        />
      </form>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </div>
    </Card>
  );
}
