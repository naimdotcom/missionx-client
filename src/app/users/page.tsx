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
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        }`}
      >
        {label}: {verified ? "✓ Verified" : "✗ Unverified"}
      </span>
    );
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-foreground mb-5 pb-2.5 border-b-2 border-primary text-2xl font-semibold">
        👥 All Users
      </h2>

      <button
        onClick={handleFetchUsers}
        disabled={isLoading}
        className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-5"
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
                  className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 p-4 rounded-lg mb-5"
                >
                  <em>Invalid user data</em>
                </div>
              );
            }

            return (
              <div
                key={user.id}
                className="bg-muted p-5 rounded-lg mb-5 border-l-4 border-primary"
              >
                <div className="border-b-2 border-primary/20 pb-2.5 mb-4">
                  <strong className="text-lg text-primary">👤 USER</strong>
                  <span className="text-muted-foreground text-sm float-right">
                    UUID: {user.id}
                  </span>
                </div>

                <div className="mb-4 text-foreground">
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
                  <small className="text-muted-foreground">
                    Created: {new Date(user.created_at).toLocaleString()}
                  </small>
                </div>

                {profile ? (
                  <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-md mb-4 text-foreground">
                    <strong className="text-sky-600 dark:text-sky-400">
                      📋 PROFILE
                    </strong>
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
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 p-3 rounded-md mb-4">
                    <em>No profile created</em>
                  </div>
                )}

                {authProviders.length > 0 ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-md mb-4 text-foreground">
                    <strong className="text-emerald-600 dark:text-emerald-400">
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
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 p-3 rounded-md mb-4">
                    <em>No OAuth providers linked</em>
                  </div>
                )}

                {customer ? (
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md text-foreground">
                    <strong className="text-purple-600 dark:text-purple-400">
                      🏢 CUSTOMER
                    </strong>
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
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        Status: {customer.status}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.verification_status === "verified"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        Verification: {customer.verification_status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 p-3 rounded-md">
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
