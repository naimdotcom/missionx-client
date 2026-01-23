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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => {
            /* Mock social login */
            setUser({
              id: "google-user",
              email: "google@example.com",
              name: "Google User",
              organizationId: "org-1",
              role: "agent",
            });
            navigate({ to: "/inbox/ws-1" });
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            /* Mock social login */
            setUser({
              id: "facebook-user",
              email: "fb@example.com",
              name: "Facebook User",
              organizationId: "org-1",
              role: "agent",
            });
            navigate({ to: "/inbox/ws-1" });
          }}
        >
          <svg
            className="mr-2 h-4 w-4 text-[#1877F2]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Demo credentials are pre-filled</p>
      </div>
    </Card>
  );
}
