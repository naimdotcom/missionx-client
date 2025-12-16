"use client";

import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import { useLazyGetUsersQuery } from "@/store/api";

export default function UsersPage() {
  const [trigger, { data: usersData, error, isLoading }] =
    useLazyGetUsersQuery();
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const handleFetchUsers = async () => {
    setResponse("Loading...");

    // The existing token check can be kept or removed if the baseQuery handles it safely (it returns 401/403)
    // But for UI feedback:
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      setResponse({ error: "No token. Please login first." });
      return;
    }

    try {
      const result = await trigger(undefined).unwrap();
      setResponse(result);
      if (Array.isArray(result)) {
        setUsers(result);
      }
    } catch (err: any) {
      setResponse({ error: err.data || err.message });
    }
  };

  const renderStatusBadge = (verified: boolean, label: string) => {
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          verified
            ? "bg-[#d1fae5] text-[#059669]"
            : "bg-[#fee2e2] text-[#dc2626]"
        }`}
      >
        {label}: {verified ? "✓ Verified" : "✗ Unverified"}
      </span>
    );
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-[#333] mb-5 pb-2.5 border-b-2 border-[rgb(102,126,234)] text-2xl font-semibold">
        👥 All Users
      </h2>

      <button
        onClick={handleFetchUsers}
        disabled={isLoading}
        className="bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(126,102,234)] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mb-5"
      >
        {isLoading ? "Loading..." : "Fetch All Users"}
      </button>

      {users.length > 0 && (
        <div className="mb-5">
          {users.map((item) => {
            const user = item.user || item;
            const profile = item.profile || null;
            const authProviders = item.auth_providers || [];
            const customer = item.customer || null;

            if (!user || !user.id) {
              return (
                <div
                  key={Math.random()}
                  className="bg-[#fee2e2] p-4 rounded-lg mb-5"
                >
                  <em>Invalid user data</em>
                </div>
              );
            }

            return (
              <div
                key={user.id}
                className="bg-[#f8f9fa] p-5 rounded-lg mb-5 border-l-4 border-[rgb(102,126,234)]"
              >
                <div className="border-b-2 border-[rgb(102,126,234)] pb-2.5 mb-4">
                  <strong className="text-lg text-[#667eea]">👤 USER</strong>
                  <span className="text-[#666] text-sm float-right">
                    UUID: {user.id}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="mb-1">
                    📧 <strong>Email:</strong> {user.email}
                  </p>
                  <p className="mb-2">
                    📱 <strong>Phone:</strong> {user.phone || "N/A"}
                  </p>
                  <div className="mb-2 space-x-2">
                    {renderStatusBadge(user.email_verified, "Email")}
                    {renderStatusBadge(user.phone_verified, "Phone")}
                  </div>
                  <small className="text-[#888]">
                    Created: {new Date(user.created_at).toLocaleString()}
                  </small>
                </div>

                {profile ? (
                  <div className="bg-[#f0f9ff] p-3 rounded-md mb-4">
                    <strong className="text-[#0ea5e9]">📋 PROFILE</strong>
                    <br />
                    <strong>Name:</strong> {profile.first_name || ""}{" "}
                    {profile.last_name || ""}
                    <br />
                    <strong>Timezone:</strong> {profile.timezone || "N/A"}
                    <br />
                    {profile.preferences && (
                      <>
                        <strong>Preferences:</strong>{" "}
                        {JSON.stringify(profile.preferences)}
                        <br />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#fef3c7] p-3 rounded-md mb-4">
                    <em>No profile created</em>
                  </div>
                )}

                {authProviders.length > 0 ? (
                  <div className="bg-[#f0fdf4] p-3 rounded-md mb-4">
                    <strong className="text-[#10b981]">
                      🔐 AUTH PROVIDERS
                    </strong>
                    <br />
                    {authProviders.map((ap: any, idx: number) => (
                      <div key={idx}>
                        • <strong>{ap.provider_name}</strong> (ID:{" "}
                        {ap.provider_id})
                        <br />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#fef3c7] p-3 rounded-md mb-4">
                    <em>No OAuth providers linked</em>
                  </div>
                )}

                {customer ? (
                  <div className="bg-[#faf5ff] p-3 rounded-md">
                    <strong className="text-[#a855f7]">🏢 CUSTOMER</strong>
                    <br />
                    <strong>Address:</strong> {customer.address || "N/A"}
                    <br />
                    <strong>City:</strong> {customer.city || "N/A"}
                    <br />
                    <strong>Country:</strong> {customer.country || "N/A"}
                    <br />
                    <strong>Postal:</strong> {customer.postal_code || "N/A"}
                    <br />
                    <div className="mt-2 space-x-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.status === "verified"
                            ? "bg-[#d1fae5] text-[#059669]"
                            : "bg-[#fef3c7] text-[#d97706]"
                        }`}
                      >
                        Status: {customer.status}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.verification_status === "verified"
                            ? "bg-[#d1fae5] text-[#059669]"
                            : "bg-[#fee2e2] text-[#dc2626]"
                        }`}
                      >
                        Verification: {customer.verification_status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#fef3c7] p-3 rounded-md">
                    <em>No customer profile</em>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ResponseBox response={response} isError={isError} />
    </PageContainer>
  );
}
