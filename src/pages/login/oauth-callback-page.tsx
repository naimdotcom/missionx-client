import { useAuthStore } from "@/stores/auth-store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthStore();
  const { success } = useSearch({ from: "/_public/oauth-callback" });

  useEffect(() => {
    if (success === true) {
      setIsAuthenticated(true);
      navigate({ to: "/inbox" });
      toast.success("Login successful!");
      window.close();
    } else {
      toast.error("Login failed!");
    }
  }, [success, navigate, setIsAuthenticated]);

  useEffect(() => {
    // try {
    //   if (window.opener && window.opener !== window) {
    //     window.opener.postMessage(
    //       {
    //         type: "oauth_success",
    //         message:
    //           "Authentication successful. Tokens stored in browser cookies.",
    //       },
    //       window.location.origin,
    //     );
    //     toast.success("Login successful!");
    //     // Wait for message to be received, then close popup
    //     setTimeout(() => {
    //       window.close();
    //     }, 100);
    //   } else {
    //     // If not a popup, reload page to refresh auth state
    //     // Browser will automatically send cookies with the reload request
    //     toast.success("Login successful!");
    //     navigate({ to: "/inbox" });
    //   }
    // } catch (error: any) {
    //   console.error("OAuth callback error:", error);
    //   toast.error(
    //     "Authentication successful but redirect failed. Reloading...",
    //   );
    //   window.location.reload();
    // }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 animate-spin">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication successful!
        </h1>
        <p className="text-gray-600">Redirecting you now...</p>
      </div>
    </div>
  );
}
