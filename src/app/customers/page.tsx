"use client";

import { useState, FormEvent } from "react";
import PageContainer from "@/components/PageContainer";
import ResponseBox from "@/components/ResponseBox";
import {
  useLazyGetCustomersQuery,
  useLazyGetMyCustomerQuery,
  useUpdateCustomerMutation,
} from "@/store/api";

export default function CustomersPage() {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);

  const [triggerGetCustomers, { isLoading: isCustomersLoading }] =
    useLazyGetCustomersQuery();
  const [triggerGetMyCustomer, { isLoading: isMyCustomerLoading }] =
    useLazyGetMyCustomerQuery();
  const [updateCustomer, { isLoading: isUpdateLoading }] =
    useUpdateCustomerMutation();

  const isLoading =
    isCustomersLoading || isMyCustomerLoading || isUpdateLoading;

  const handleFetchCustomers = async () => {
    setResponse("Loading...");
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      setResponse({ error: "No token. Please login first." });
      setIsError(true);
      return;
    }

    try {
      const result = await triggerGetCustomers(undefined).unwrap();
      setResponse(result);
      setIsError(false);
    } catch (err: any) {
      setResponse({ error: err.data || err.message });
      setIsError(true);
    }
  };

  const handleFetchMyCustomer = async () => {
    setResponse("Loading...");
    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      setResponse({ error: "No token. Please login first." });
      setIsError(true);
      return;
    }

    try {
      const result = await triggerGetMyCustomer(undefined).unwrap();
      setResponse(result);
      setIsError(false);
    } catch (err: any) {
      setResponse({ error: err.data || err.message });
      setIsError(true);
    }
  };

  const handleUpdateCustomer = async (e: FormEvent) => {
    e.preventDefault();
    setResponse(null);

    if (typeof window !== "undefined" && !localStorage.getItem("authToken")) {
      setResponse({ error: "No token. Please login first." });
      setIsError(true);
      return;
    }

    try {
      const result = await updateCustomer({
        address,
        city,
        country,
        postal_code: postalCode,
      }).unwrap();
      setResponse(result);
      setIsError(false);
    } catch (err: any) {
      setResponse({ error: err.data || err.message });
      setIsError(true);
    }
  };

  return (
    <PageContainer title="Authentication API">
      <h2 className="text-[#333] mb-5 pb-2.5 border-b-2 border-[#667eea] text-2xl font-semibold">
        🏢 Customers
      </h2>

      <div className="flex gap-2.5 mb-5">
        <button
          onClick={handleFetchCustomers}
          disabled={isLoading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          All Customers
        </button>
        <button
          onClick={handleFetchMyCustomer}
          disabled={isLoading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          My Profile
        </button>
      </div>

      <h3 className="text-xl font-semibold my-5 text-[#333]">
        Update My Customer Profile
      </h3>

      <form onSubmit={handleUpdateCustomer}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="USA"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-semibold text-[#555]">
              Postal Code
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="10001"
              className="w-full px-4 py-3 border-2 border-[#e0e0e0] rounded-lg text-base transition-colors focus:outline-none focus:border-[#667eea]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-7 py-3.5 rounded-lg text-base cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(102,126,234,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <ResponseBox response={response} isError={isError} />
    </PageContainer>
  );
}
