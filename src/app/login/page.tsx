"use client";

import { useState, FormEvent } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setToken("");

    try {
      const { data, ok } = await api.login(email, password);
      setResponse(data);
      setIsError(!ok);

      if (ok && data.access_token) {
        setToken(data.access_token);
        setResponse({
          message: "✅ Login successful! Session created.",
          session_id: data.session_id,
          expires_in: `${data.expires_in} seconds`,
          refresh_expires_in: `${Math.floor(data.refresh_expires_in / 86400)} days`,
        });
      }
    } catch (err: any) {
      setResponse({ error: err.message });
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-[#333] mb-5 pb-2.5 border-b-2 border-[#667eea] text-2xl font-semibold">
        🔑 Login
      </h2>

      <h3 className="text-xl font-semibold mb-4 text-[#333]">Password Login</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#555]">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="user@example.com"
            className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-[#555]">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-5 p-4 bg-[#f0f9ff] rounded-lg">
        <strong className="text-[#333]">Or login with:</strong>
        <div className="flex gap-2.5 mt-2.5">
          <button
            onClick={() => alert("Google OAuth integration coming soon")}
            className="bg-[#4285f4] text-white px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            🔵 Google
          </button>
          <button
            onClick={() => alert("Facebook OAuth integration coming soon")}
            className="bg-[#1877f2] text-white px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            📘 Facebook
          </button>
        </div>
      </div>

      <ResponseBox response={response} isError={isError} />

      {token && (
        <div className="bg-[#f0f9ff] border-2 border-[#0ea5e9] p-4 rounded-lg mt-4 break-all">
          <strong className="text-[#333]">🎫 Your JWT Token:</strong>
          <br />
          <br />
          <span className="text-sm text-[#555]">{token}</span>
        </div>
      )}
    </PageContainer>
  );
}
