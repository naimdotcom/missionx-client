"use client";

import { useState, FormEvent } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { api, tokenManager } from "@/lib/api";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const token = tokenManager.getAuthToken();
    if (!token) {
      setResponse({ error: "No token. Please login first to create profile." });
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      const { data, ok } = await api.createProfile(
        firstName,
        lastName,
        timezone
      );
      setResponse(data);
      setIsError(!ok);
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
        👤 User Profile Management
      </h2>

      <h3 className="text-xl font-semibold mb-4 text-[#333]">
        Create/Update Profile
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">
              Timezone
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="America/New_York"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <ResponseBox response={response} isError={isError} />
    </PageContainer>
  );
}
