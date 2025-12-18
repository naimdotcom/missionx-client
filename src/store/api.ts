import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import { PayloadAction } from "@reduxjs/toolkit";

const API_BASE =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || "http://localhost:8000/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (action as PayloadAction<any>).payload[reducerPath];
    }
    return undefined;
  },
  endpoints: (build) => ({
    // Auth
    register: build.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    refreshToken: build.mutation({
      query: (data) => ({
        url: "/auth/refresh",
        method: "POST",
        body: data,
      }),
    }),
    getSessionInfo: build.query({
      query: () => "/auth/session",
    }),
    getAllSessions: build.query({
      query: () => "/auth/sessions",
    }),
    revokeSession: build.mutation({
      query: (sessionId) => ({
        url: `/auth/sessions/${sessionId}`,
        method: "DELETE",
      }),
    }),
    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    logoutAll: build.mutation({
      query: () => ({
        url: "/auth/logout/all",
        method: "POST",
      }),
    }),

    // Profile
    createProfile: build.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "POST",
        body: data,
      }),
    }),

    // Users
    getUsers: build.query({
      query: () => "/users/",
    }),

    // Customers
    getCustomers: build.query({
      query: () => "/customers/",
    }),
    getMyCustomer: build.query({
      query: () => "/customers/me/full",
    }),
    updateCustomer: build.mutation({
      query: (data) => ({
        url: "/customers/me",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useGetSessionInfoQuery,
  useLazyGetSessionInfoQuery,
  useGetAllSessionsQuery,
  useLazyGetAllSessionsQuery,
  useRevokeSessionMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useCreateProfileMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useGetMyCustomerQuery,
  useLazyGetMyCustomerQuery,
  useUpdateCustomerMutation,
} = api;
