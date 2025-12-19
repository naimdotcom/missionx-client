"use client";
import { Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { loginWithGoogle } from "@/lib/firebase_login";
import { FRONTEND_URL } from "@/utils/config";
import { redirect } from "next/navigation";

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Facebook login handler
  const handleFacebookLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000";
    window.location.href = `${backendUrl}/api/auth/facebook`;
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const token = await loginWithGoogle();

      const response = await fetch(`${FRONTEND_URL}/api/auth/login/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_token: token }),
      });
      const data = await response.json();
      // Store tokens
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      console.log("Google login response:", data);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form className="w-full">
        <FieldGroup className="w-full">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-medium">
              Welcome to <span className="font-bold">Brainchat</span>.
            </h1>
            <FieldDescription>
              Don&apos;t have an account? <a href="/signup">Sign up</a>
            </FieldDescription>
          </div>
          <Field className="w-full grid gap-2 sm:grid-cols-2">
            <Button
              className="w-full"
              variant="outline"
              type="button"
              onClick={handleFacebookLogin}
            >
              <Facebook className="" />
              <span className="">sign in with Facebook</span>
            </Button>
            <Button
              className="px-4"
              variant="outline"
              type="button"
              onClick={handleGoogleLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              sign in with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
