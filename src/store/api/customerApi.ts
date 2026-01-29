import { baseApi } from "./baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getExtCustomers: build.query({
      query: () => ({
        url: "/api/v1/customers",
        service: "customer",
      }),
    }),
    getExtCustomerDetail: build.query({
      query: (id) => ({
        url: `/api/v1/customers/${id}`,
        service: "customer",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExtCustomersQuery,
  useLazyGetExtCustomersQuery,
  useGetExtCustomerDetailQuery,
} = customerApi;
