"use client";

import { useState, FormEvent } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { useLoginMutation } from "@/store/api";
import { loginWithGoogle } from "@/lib/firebase_login";
import { FRONTEND_URL } from "@/utils/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<unknown>(null);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponse(null);
    setToken("");
    setIsError(false);

    try {
      const data = await login({ email, password }).unwrap();
      // RTK Query throws on error, so if we are here, it's successful.
      // However, the backend structure might return { data: ..., ok: ... } if wrapping,
      // but usually RTK Query returns the direct JSON response.
      // Looking at lib/api.ts, `login` returns { data, ok }.
      // But my baseQuery definition in store/api.ts just calls the URL.
      // So the result `data` is the JSON body from the response.

      if (data && data.access_token) {
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token || "");
        // Store other tokens if needed as per original lib/api.ts logic
        // But for minimal repro:
        setToken(data.access_token);
        setResponse({
          message: "✅ Login successful! Session created.",
          session_id: data.session_id,
          expires_in: `${data.expires_in} seconds`,
          refresh_expires_in: `${Math.floor(data.refresh_expires_in / 86400)} days`,
        });
      } else {
        // Fallback if data structure is unexpected
        setResponse(data);
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { detail?: string }; message?: string };
      setResponse({
        error: errorObj.data?.detail || errorObj.message || "Login failed",
      });
      setIsError(true);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const token = await loginWithGoogle();
      console.log("Google login successful:", token);

      const response = await fetch(`${FRONTEND_URL}/api/auth/login/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_token: token }),
      });
      const data = await response.json();
      // Store tokens
      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      // Calculate expiration times
      const accessTokenExpiry = Date.now() + data.expires_in * 1000;
      const refreshTokenExpiry = Date.now() + data.refresh_expires_in * 1000;

      // Send token to backend if needed
      console.log("Google login response:", data);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-foreground mb-5 pb-2.5 border-b-2 border-primary text-2xl font-semibold">
        🔑 Login
      </h2>

      <h3 className="text-xl font-semibold mb-4 text-foreground">
        Password Login
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-muted-foreground">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-muted-foreground">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-linear-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-5 p-4 bg-secondary rounded-lg">
        <strong className="text-foreground">Or login with:</strong>
        <div className="flex gap-2.5 mt-2.5">
          <button
            onClick={() => handleGoogleLogin()}
            className="bg-[#4285f4] text-white px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            🔵 Google
          </button>
          <button
            onClick={() => {
              // Redirect to backend Facebook OAuth endpoint
              const backendUrl =
                process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000";
              window.location.href = `${backendUrl}/api/auth/facebook`;
            }}
            className="bg-[#1877f2] text-white px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            📘 Facebook
          </button>
        </div>
      </div>

      <ResponseBox response={response} isError={isError} />

      {token && (
        <div className="bg-secondary border-2 border-primary p-4 rounded-lg mt-4 break-all">
          <strong className="text-foreground">🎫 Your JWT Token:</strong>
          <br />
          <br />
          <span className="text-sm text-muted-foreground">{token}</span>
        </div>
      )}
    </PageContainer>
  );
}
