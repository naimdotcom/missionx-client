// Login page with dummy authentication

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAuthStore } from "~/stores/auth-store";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "agent@example.com",
    password: "password",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Set dummy user token
    setUser({
      id: "user-1",
      email: formData.email,
      name: "Demo Agent",
      organizationId: "org-1",
      role: "agent",
    });

    // Navigate to inbox
    navigate({ to: "/inbox/ws-1" });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="agent@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium mb-1.5 block"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Demo credentials are pre-filled</p>
      </div>
    </Card>
  );
}
