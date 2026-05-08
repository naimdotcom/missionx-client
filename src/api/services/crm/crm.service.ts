import { API_ENDPOINTS } from "@/api";
import type {
  APPField,
  Customer,
  CustomerCreate,
  CustomerListParams,
  Customers,
  CustomerUpdate,
  ExportRequest,
  InboxCustomerPayload,
  SegmentListParams,
  SegmentResponse,
  SegmentUpsert,
  UpdateAppFieldAction,
  UpdateAppFieldPayload,
} from "./crm.types";
import { crmClient } from "@/api/core/init";

export const crmService = {
  getCustomers: (params?: CustomerListParams) => {
    return crmClient.get<Customers>(API_ENDPOINTS.CRM.CUSTOMERS, params);
  },

  getCustomerById: (id: string, app_id: string) => {
    return crmClient.get<Customer>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id), {
      app_id,
    });
  },

  createCustomer: (payload: CustomerCreate) => {
    return crmClient.post<Customer>(API_ENDPOINTS.CRM.CUSTOMERS, payload);
  },

  updateCustomer: (id: string, payload: CustomerUpdate) => {
    return crmClient.put<Customer>(
      API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id),
      payload,
    );
  },

  deleteCustomer: (id: string) => {
    return crmClient.delete(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id));
  },

  exportCustomers: (payload: ExportRequest) => {
    return crmClient.post(API_ENDPOINTS.CRM.EXPORT, payload);
  },

  inboxCustomer: (payload: InboxCustomerPayload) => {
    return crmClient.get(
      API_ENDPOINTS.CRM.INBOX_CUSTOMER(payload.customer_id),
      {
        app_id: payload.app_id,
        page: payload.page,
        limit: payload.limit,
      },
    );
  },

  upsertSegment: (
    action: "add" | "update" | "remove",
    payload: SegmentUpsert,
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("action", action);
    const endpoint = `${API_ENDPOINTS.CRM.UPSERT_SEGMENT}?${queryParams.toString()}`;
    return crmClient.post(endpoint, payload);
  },

  getSegmentById: (id: string) => {
    return crmClient.get<import("./crm.types").SegmentResponse>(
      API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
    );
  },

  listSegments: (params: SegmentListParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.app_id) queryParams.append("app_id", params.app_id);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    const endpoint = query
      ? `${API_ENDPOINTS.CRM.LIST_SEGMENT}?${query}`
      : API_ENDPOINTS.CRM.LIST_SEGMENT;

    return crmClient.get<SegmentResponse[]>(endpoint);
  },

  deleteSegment: (id: string) => {
    return crmClient.delete(API_ENDPOINTS.CRM.SEGMENT_BY_ID(id));
  },

  appFields: (app_id: string) => {
    return crmClient.get<APPField>(API_ENDPOINTS.CRM.APP_FIELDS(app_id));
  },

  updateAppFields: (
    app_id: string,
    action: UpdateAppFieldAction,
    payload: UpdateAppFieldPayload,
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.append("action", action);
    const endpoint = `${API_ENDPOINTS.CRM.APP_FIELDS(app_id)}?${queryParams.toString()}`;
    return crmClient.put(endpoint, payload);
  },
};
