"use client";

import { useState, FormEvent } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { useRegisterMutation } from "@/store/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponse(null);
    setIsError(false);

    if (password.length < 8) {
      setResponse({ error: "Password must be at least 8 characters long" });
      setIsError(true);
      return;
    }

    try {
      const data = await register({ email, password, phone }).unwrap();

      // If successful:
      setResponse({
        ...data,
        message: `✅ User created! User ID: ${data.id}`,
      });
    } catch (err: any) {
      // RTK Query error object
      setResponse({
        error: err.data?.detail || err.message || "Registration failed",
      });
      setIsError(true);
    }
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-foreground mb-5 pb-2.5 border-b-2 border-primary text-2xl font-semibold">
        📝 Register New User
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              placeholder="Enter secure password"
              minLength={8}
              className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-muted-foreground">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <ResponseBox response={response} isError={isError} />
    </PageContainer>
  );
}
