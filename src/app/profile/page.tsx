"use client";

import { useState, FormEvent } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { useCreateProfileMutation } from "@/store/api";

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [createProfile, { isLoading }] = useCreateProfileMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponse(null);

    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      setResponse({ error: "No token. Please login first to create profile." });
      setIsError(true);
      return;
    }

    try {
      const data = await createProfile({
        first_name: firstName,
        last_name: lastName,
        timezone,
        preferences: {},
      }).unwrap();
      setResponse(data);
      setIsError(false);
    } catch (err: any) {
      setResponse({ error: err.data || err.message });
      setIsError(true);
    }
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-foreground mb-5 pb-2.5 border-b-2 border-primary text-2xl font-semibold">
        👤 User Profile Management
      </h2>

      <h3 className="text-xl font-semibold mb-4 text-foreground">
        Create/Update Profile
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-muted-foreground">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-muted-foreground">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-muted-foreground">
              Timezone
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="America/New_York"
              className="w-full px-4 py-3 border-2 border-input rounded-lg text-base transition-colors focus:outline-none focus:border-ring bg-background text-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <ResponseBox response={response} isError={isError} />
    </PageContainer>
  );
}
