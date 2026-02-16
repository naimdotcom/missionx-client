import { API_ENDPOINTS, useGoogleLogin } from "@/api";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/lib/env";
import { useNavigate, useSearch } from "@tanstack/react-router";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth, googleProvider } from "~/lib/firebase";
import { useAuthStore } from "~/stores/auth-store";

function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <div className="mb-4">
            <div className="inline-block bg-gradient-to-br bg-black text-white rounded-lg p-3">
              <svg
                className="w-8 h-8"
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
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-black dark:text-white bg-clip-text text-transparent">
            Mission X
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-2">
            Customer Experience Platform
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 grid grid-cols-1">
          <GoogleLoginBtn />
          <MetaLoginBtn />

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-background text-gray-500">
                Secure OAuth Login
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-center text-gray-600 leading-relaxed px-2">
            By clicking continue, you agree to our{" "}
            <a href="#" className="font-semibold text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;

function GoogleLoginBtn() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const googleAuthMutation = useGoogleLogin();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      googleAuthMutation.mutate(
        { firebase_token: idToken },
        {
          onSuccess: (data) => {
            setAuth(data.access_token, data.refresh_token);
            toast.success("Login successful with Google");
            navigate({ to: "/inbox" });
          },
          onError: (err) => {
            if (axios.isAxiosError(err)) {
              toast.error(
                err.response?.data?.detail || "Google authentication failed",
              );
            }
          },
        },
      );
    } catch (error: any) {
      console.error("Google Popup Error:", error);
      toast.error(error.message || "Could not complete Google Sign-In");
    }
  };
  return (
    <Button
      size="lg"
      className="w-full bg-white text-gray-900 border-2 hover:bg-gray-100 font-semibold"
      onClick={handleGoogleLogin}
      disabled={googleAuthMutation.isPending}
    >
      {googleAuthMutation.isPending && (
        <div className="flex items-center justify-center gap-1">
          <Spinner />
          Connecting...
        </div>
      )}
      {!googleAuthMutation.isPending && (
        <span className="flex items-center justify-center gap-2 sm:gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          <span className="hidden sm:inline">Continue with Google</span>
          <span className="sm:hidden">Google</span>
        </span>
      )}
    </Button>
  );
}

function MetaLoginBtn() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const searchParams = useSearch({ from: "/_public/login" });

  console.log(searchParams);

  useEffect(() => {
    const accessToken = searchParams?.accessToken;
    const refreshToken = searchParams?.refreshToken;

    if (accessToken && refreshToken) {
      try {
        setAuth(accessToken, refreshToken);
        toast.success("Login successful with Meta");
        navigate({ to: "/inbox" });

        // Close the popup if opened by parent window
        if (window.opener) {
          window.close();
        }
      } catch (error: any) {
        console.error("Meta login error:", error);
        toast.error(error.message || "Failed to process Meta login");
      }
    }
  }, [searchParams, navigate, setAuth]);

  const handleMetaLogin = () => {
    const base = env.authUrl;
    const url = new URL(API_ENDPOINTS.AUTH.META_LOGIN, base).toString();
    window.open(url, "meta_login", "width=600,height=700");
  };

  return (
    <Button
      size="lg"
      variant={"secondary"}
      onClick={handleMetaLogin}
      className=" font-semibold shadow-md"
    >
      <span className="flex items-center justify-center gap-2 sm:gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-4 h-4 sm:w-5 sm:h-5"
        >
          <path
            d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
            fill="currentColor"
          />
        </svg>
        <span className="hidden sm:inline">Continue with Meta</span>
        <span className="sm:hidden">Meta</span>
      </span>
    </Button>
  );
}
