import { API_ENDPOINTS, BaseAPIService, RequestOptions } from "@/api";
import { CreateAppPayload } from "./apps.type";

export class AppsService extends BaseAPIService {
  createApp = (payload: CreateAppPayload, options?: RequestOptions) =>
    this.post(API_ENDPOINTS.APPS.CREATE_APP, payload, options);
}

export const appsService = new AppsService();
