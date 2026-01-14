import { baseApi } from "./baseApi";

export const appsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getApps: build.query({
      query: () => ({
        url: "/api/v1/apps",
        method: "GET",
        service: "apps",
      }),
    }),
    createApp: build.mutation({
      query: (data) => ({
        url: "/api/v1/apps",
        method: "POST",
        body: data,
        service: "apps",
      }),
    }),
    getAppDetail: build.query({
      query: (appId) => ({
        url: `/api/v1/apps/${appId}`,
        service: "apps",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAppsQuery,
  useLazyGetAppsQuery,
  useCreateAppMutation,
  useGetAppDetailQuery,
  useLazyGetAppDetailQuery,
} = appsApi;
