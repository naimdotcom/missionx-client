import { API_ENDPOINTS } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
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

  getCustomerById = (id: string) => {
    return this.get<Customer>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id));
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

  // Segments

  // getSegments = (params?: Partial<import("./crm.types").SegmentListParams>) => {
  //   return this.get<import("./crm.types").SegmentResponse[]>(
  //     API_ENDPOINTS.CRM.SEGMENT,
  //     params as Record<string, unknown>,
  //   );
  // };

  getSegmentById = (id: string) => {
    return this.get<import("./crm.types").SegmentResponse>(
      API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
    );
  };

  // createSegment = (payload: import("./crm.types").SegmentCreate) => {
  //   return this.post<import("./crm.types").SegmentResponse>(
  //     API_ENDPOINTS.CRM.SEGMENT,
  //     payload,
  //   );
  // };

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
}

export const crmService = new CrmService(env.crmUrl || "");
