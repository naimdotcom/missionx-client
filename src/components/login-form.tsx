"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook } from "lucide-react";
import { FieldDescription } from "@/components/ui/field";
import { loginWithGoogle } from "@/lib/firebase_login";
import { useLoginWithGoogleMutation, useLazyGetAppsQuery } from "@/store/api";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/store/authSlice";
import { tokenStore } from "@/store/api/tokenStore";
import { setCookie } from "@/lib/cookies";
import {
  redirectToReturnLocation,
  getReturnLocation,
} from "@/lib/locationPersistence";
import WorkspaceSelector from "./workspace-selector";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loginWithGoogleMutation, { isLoading: isLoggingIn }] =
    useLoginWithGoogleMutation();
  const [isFacebookLoggingIn, setIsFacebookLoggingIn] = useState(false);
  const [getApps] = useLazyGetAppsQuery();
  const dispatch = useDispatch();

  // Check if there's a return location saved
  useEffect(() => {
    const returnLocation = getReturnLocation();
    if (returnLocation) {
      console.log("[LoginForm] Found saved return location:", returnLocation);
    }
  }, []);

  // Listen for messages from Facebook login popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify origin for security (allow self and backend URL)
      const allowedOrigins = [window.location.origin];
      const backendUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8000";
      try {
        const backendOrigin = new URL(backendUrl).origin;
        allowedOrigins.push(backendOrigin);
      } catch (e) {
        // ignore invalid backend url
      }
      
      if (!allowedOrigins.includes(event.origin)) {
        console.log("Ignored message from unknown origin:", event.origin);
        return;
      }

      if (event.data?.type === "FACEBOOK_LOGIN_SUCCESS") {
        console.log("Facebook login successful via popup");
        setIsFacebookLoggingIn(false);
        
        // Store the token immediately and persist in cookies
        const { accessToken, refreshToken } = event.data;
        if (accessToken) {
            tokenStore.setAccessToken(accessToken);
            // Set cookies for persistence across reloads/redirects (essential for localhost vs ngrok)
            setCookie("access_token", accessToken);
            if (refreshToken) {
                setCookie("refresh_token", refreshToken);
            }
        }
        dispatch(setAuthenticated(true));
        
        toast.success("Login successful!", {
          description: "Redirecting to workspace...",
        });

        try {
          // Redirect to saved location or dashboard
          redirectToReturnLocation(router, "/dashboard");
        } catch (err) {
          console.error("Failed to redirect:", err);
          router.push("/dashboard");
        }
      }

      if (event.data?.type === "FACEBOOK_LOGIN_ERROR") {
        console.error("Facebook login error:", event.data.error);
        setIsFacebookLoggingIn(false);
        toast.error("Login failed", {
          description: event.data.error || "An error occurred during Facebook login",
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch, router, getApps]);

  // Facebook login handler - opens popup
  const handleFacebookLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const configId = process.env.NEXT_PUBLIC_META_CONFIGURATION_ID;
    const backendUrl =
      process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:8000";
    const redirectUri = `${backendUrl}/api/auth/facebook/callback`;
    
    if (!appId) {
      console.error("Missing NEXT_PUBLIC_META_APP_ID");
      toast.error("Configuration Error", {
        description: "Facebook Login is not correctly configured.",
      });
      setIsFacebookLoggingIn(false);
      return;
    }
    
    // Calculate popup window dimensions (centered on screen)
    const width = 600;
    const height = 700;
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    
    // Open Facebook OAuth in a popup window
    // Uses config_id for Business Login permissions
    const facebookAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&config_id=${configId}&response_type=code&display=popup`;
    
    console.log("[Facebook Login] Backend URL:", backendUrl);
    console.log("[Facebook Login] Redirect URI:", redirectUri);
    console.log("[Facebook Login] Auth URL:", facebookAuthUrl);
    
    // Use fully specified features to ensure browser opens a popup, not a tab
    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no`;
    
    const popup = window.open(
      facebookAuthUrl,
      'FacebookLoginPopup',
      windowFeatures
    );
    
    // Set loading state after opening popup
    setIsFacebookLoggingIn(true);
    
    // Focus the popup and monitor if it's closed
    if (popup && !popup.closed) {
      popup.focus();
      
      // Check if popup is closed manually (user cancelled)
      const checkPopupClosed = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupClosed);
          setIsFacebookLoggingIn(false);
        }
      }, 500);
    } else {
      // Popup was blocked
      setIsFacebookLoggingIn(false);
      toast.error("Popup blocked", {
        description: "Please allow popups for this site to login with Facebook",
      });
    }
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const firebaseToken = await loginWithGoogle();

      const result = await loginWithGoogleMutation({
        firebase_token: firebaseToken,
      }).unwrap();
      console.log("Google login result:", result);

      if (result.access_token) {
        dispatch(setAuthenticated(true));
        console.log("Google login successful");

        // Redirect to saved location or dashboard
        redirectToReturnLocation(router, "/dashboard");
      }
    } catch (error: any) {
      console.error("Google login failed:", error);

      let errorMessage = "Login failed";
      let errorDescription = "An error occurred during login";

      if (error?.data?.detail) {
        errorDescription = error.data.detail;
      } else if (error?.message) {
        errorDescription = error.message;
      }

      toast.error(errorMessage, {
        description: errorDescription,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Continue with your Facebook or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleFacebookLogin}
                disabled={isLoggingIn || isFacebookLoggingIn}
              >
                {isFacebookLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
                    Authenticating with Facebook...
                  </span>
                ) : (
                  <>
                    <Facebook className="size-5" />
                    Continue with Facebook
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn || isFacebookLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-5"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
