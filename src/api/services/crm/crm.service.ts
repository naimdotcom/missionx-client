import { API_ENDPOINTS } from "@/api";
import { BaseAPIService } from "@/api/core/base.service";
import { env } from "@/lib/env";
import type {
  AttributeUpdate,
  BulkAttributeUpdateRequest,
  CustomerCreate,
  CustomerListParams,
  CustomerQueryParams,
  CustomerResponse,
  CustomerUpdate,
  ExportRequest,
  NotesUpdateRequest,
  TagUpdateRequest,
} from "./crm.types";

export class CrmService extends BaseAPIService {
  constructor(baseURL: string) {
    super(baseURL);
  }

  getCustomers = (params?: CustomerListParams) => {
    return this.get<CustomerResponse[]>(
      API_ENDPOINTS.CRM.CUSTOMERS,
      params as Record<string, unknown>,
    );
  };

  getCustomerById = (id: string) => {
    return this.get<CustomerResponse>(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id));
  };

  createCustomer = (payload: CustomerCreate) => {
    return this.post<CustomerResponse>(API_ENDPOINTS.CRM.CUSTOMERS, payload);
  };

  updateCustomer = (id: string, payload: CustomerUpdate) => {
    return this.put<CustomerResponse>(
      API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id),
      payload,
    );
  };

  deleteCustomer = (id: string) => {
    return this.delete(API_ENDPOINTS.CRM.CUSTOMER_BY_ID(id));
  };

  updateTags = (id: string, payload: TagUpdateRequest) => {
    return this.patch(API_ENDPOINTS.CRM.CUSTOMER_TAGS(id), payload);
  };

  updateNotes = (id: string, payload: NotesUpdateRequest) => {
    return this.patch(API_ENDPOINTS.CRM.CUSTOMER_NOTES(id), payload);
  };

  patchAttribute = (id: string, payload: AttributeUpdate) => {
    return this.patch(API_ENDPOINTS.CRM.CUSTOMER_ATTRIBUTES(id), payload);
  };

  bulkUpdateAttributes = (id: string, payload: BulkAttributeUpdateRequest) => {
    return this.post(API_ENDPOINTS.CRM.CUSTOMER_BULK_ATTRIBUTES(id), payload);
  };

  queryCustomers = (params?: Partial<CustomerQueryParams>) => {
    return this.get<CustomerResponse[]>(
      API_ENDPOINTS.CRM.QUERY,
      params as Record<string, unknown>,
    );
  };

  exportCustomers = (payload: ExportRequest) => {
    return this.post(API_ENDPOINTS.CRM.EXPORT, payload);
  };

  // Segments

  getSegments = (params?: Partial<import("./crm.types").SegmentListParams>) => {
    return this.get<import("./crm.types").SegmentResponse[]>(
      API_ENDPOINTS.CRM.SEGMENT,
      params as Record<string, unknown>,
    );
  };

  getSegmentById = (id: string) => {
    return this.get<import("./crm.types").SegmentResponse>(
      API_ENDPOINTS.CRM.SEGMENT_BY_ID(id),
    );
  };

  createSegment = (payload: import("./crm.types").SegmentCreate) => {
    return this.post<import("./crm.types").SegmentResponse>(
      API_ENDPOINTS.CRM.SEGMENT,
      payload,
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
}

export const crmService = new CrmService(env.crmUrl || "");
