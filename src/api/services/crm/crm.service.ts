import { API_ENDPOINTS } from "@/api";
import { serviceRegistry } from "@/api/core/service-registry";
import type {
  APPField,
  Customer,
  CustomerCreate,
  CustomerListParams,
  Customers,
  CustomerUpdate,
  ExportRequest,
  InboxCustomerPayload,
  UpdateAppFieldAction,
  UpdateAppFieldPayload,
} from "./crm.types";

const client = serviceRegistry.getClient("crm");

export const getCustomers = (params?: CustomerListParams) => {
  return client.get<Customers>(API_ENDPOINTS.CRM.CUSTOMERS, params);
};

export const getCustomerById = (id: string, app_id: string) => {
  return client.get<Customer>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id), { app_id });
};

export const createCustomer = (payload: CustomerCreate) => {
  return client.post<Customer>(API_ENDPOINTS.CRM.CUSTOMERS, payload);
};

export const updateCustomer = (id: string, payload: CustomerUpdate) => {
  return client.put<Customer>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id), payload);
};

export const deleteCustomer = (id: string) => {
  return client.delete(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id));
};

export const exportCustomers = (payload: ExportRequest) => {
  return client.post(API_ENDPOINTS.CRM.EXPORT, payload);
};

export const inboxCustomer = (payload: InboxCustomerPayload) => {
  return client.get(API_ENDPOINTS.CRM.INBOX_CUSTOMER(payload.customer_id), {
    app_id: payload.app_id,
    page: payload.page,
    limit: payload.limit,
  });
};

export const getSegmentById = (id: string) => {
  return client.get<import("./crm.types").SegmentResponse>(
    API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
  );
};

export const updateSegment = (
  id: string,
  payload: import("./crm.types").SegmentUpdate,
) => {
  return client.patch<import("./crm.types").SegmentResponse>(
    API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
    payload,
  );
};

export const deleteSegment = (id: string) => {
  return client.delete(API_ENDPOINTS.CRM.SEGMENT_BY_ID(id));
};

export const appFields = (app_id: string) => {
  return client.get<APPField>(API_ENDPOINTS.CRM.APP_FIELDS(app_id));
};

export const updateAppFields = (
  app_id: string,
  action: UpdateAppFieldAction,
  payload: UpdateAppFieldPayload,
) => {
  const queryParams = new URLSearchParams();
  queryParams.append("action", action);
  const endpoint = `${API_ENDPOINTS.CRM.APP_FIELDS(app_id)}?${queryParams.toString()}`;
  return client.put(endpoint, payload);
};
