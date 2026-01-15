import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation({
      query: (data) => ({
        url: "/api/auth/register",
        method: "POST",
        body: data,
        service: "auth",
      }),
    }),
    login: build.mutation({
      query: (data) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
        service: "auth",
      }),
    }),
    loginWithGoogle: build.mutation({
      query: (data) => ({
        url: "/api/auth/login/google",
        method: "POST",
        body: data,
        service: "auth",
      }),
    }),
    refreshToken: build.mutation({
      query: (data) => ({
        url: "/api/auth/refresh",
        method: "POST",
        body: data,
        service: "auth",
      }),
    }),
    getSessionInfo: build.query({
      query: () => ({
        url: "/api/auth/session",
        service: "auth",
      }),
    }),
    getAllSessions: build.query({
      query: () => ({
        url: "/api/auth/sessions",
        service: "auth",
      }),
      providesTags: ["Sessions"],
    }),
    revokeSession: build.mutation({
      query: (sessionId) => ({
        url: `/api/auth/sessions/${sessionId}`,
        method: "DELETE",
        service: "auth",
      }),
      invalidatesTags: ["Sessions"],
    }),
    logout: build.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
        service: "auth",
      }),
    }),
    logoutAll: build.mutation({
      query: () => ({
        url: "/api/auth/logout/all",
        method: "POST",
        service: "auth",
      }),
      invalidatesTags: ["Sessions"],
    }),
    createProfile: build.mutation({
      query: (data) => ({
        url: "/api/v1/users/profile",
        method: "POST",
        body: data,
        service: "auth",
      }),
    }),
    getUsers: build.query({
      query: () => ({
        url: "/api/v1/users/",
        service: "auth",
      }),
    }),
    getCustomers: build.query({
      query: () => ({
        url: "/api/v1/customers/",
        service: "auth",
      }),
    }),
    getMyCustomer: build.query({
      query: () => ({
        url: "/api/v1/customers/me/full",
        service: "auth",
      }),
    }),
    updateCustomer: build.mutation({
      query: (data) => ({
        url: "/api/v1/customers/me",
        method: "PUT",
        body: data,
        service: "auth",
      }),
    }),
    getMyProfile: build.query({
      query: () => ({
        url: "/api/v1/auth/me",
        service: "auth",
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: "/api/v1/auth/me",
        method: "PUT",
        body: data,
        service: "auth",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginWithGoogleMutation,
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
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} = authApi;
