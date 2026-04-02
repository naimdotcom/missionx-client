import { API_ENDPOINTS } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
  APPField,
  Customer,
  CustomerCreate,
  CustomerListParams,
  Customers,
  CustomerUpdate,
  ExportRequest,
  InboxCustomerPayload,
} from "./crm.types";

export class CrmService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  getCustomers = (params?: CustomerListParams) => {
    return this.get<Customers>(API_ENDPOINTS.CRM.CUSTOMERS, params);
  };

  getCustomerById = (id: string, app_id: string) => {
    return this.get<Customer>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id), { app_id });
  };

  createCustomer = (payload: CustomerCreate) => {
    return this.post<Customer>(API_ENDPOINTS.CRM.CUSTOMERS, payload);
  };

  updateCustomer = (id: string, payload: CustomerUpdate) => {
    return this.put<Customer>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id), payload);
  };

  deleteCustomer = (id: string) => {
    return this.delete(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id));
  };

  exportCustomers = (payload: ExportRequest) => {
    return this.post(API_ENDPOINTS.CRM.EXPORT, payload);
  };

  inboxCustomer = (payload: InboxCustomerPayload) => {
    return this.get(API_ENDPOINTS.CRM.INBOX_CUSTOMER(payload.customer_id), {
      app_id: payload.app_id,
      page: payload.page,
      limit: payload.limit,
    });
  };

  getSegmentById = (id: string) => {
    return this.get<import("./crm.types").SegmentResponse>(
      API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
    );
  };

  updateSegment = (
    id: string,
    payload: import("./crm.types").SegmentUpdate,
  ) => {
    return this.patch<import("./crm.types").SegmentResponse>(
      API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
      payload,
    );
  };

  deleteSegment = (id: string) => {
    return this.delete(API_ENDPOINTS.CRM.SEGMENT_BY_ID(id));
  };

  appFields = (app_id: string) => {
    return this.get<APPField>(API_ENDPOINTS.CRM.APP_FIELDS(app_id));
  };
}

export const crmService = new CrmService(env.crmUrl || "");
