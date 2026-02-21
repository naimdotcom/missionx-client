import { API_ENDPOINTS, BaseAPIService, RequestOptions } from "@/api";
import { env } from "@/lib/env";
import {
  App,
  AppParams,
  Apps,
  AppUsers,
  CreateAppPayload,
  MyAppParams,
  Role,
  UpdateRolePayload,
} from "./apps.type";

export class AppsService extends BaseAPIService {
  createApp = (payload: CreateAppPayload, options?: RequestOptions) =>
    this.post<App>(API_ENDPOINTS.APPS.CREATE_APP, payload, options);

  listApps = (params: AppParams, options?: RequestOptions) =>
    this.get<Apps>(API_ENDPOINTS.APPS.LIST_APPS, params, options);

  listMyApps = (params: MyAppParams, options?: RequestOptions) =>
    this.get<Apps>(API_ENDPOINTS.APPS.LIST_MY_APPS, params, options);

  listAppUsers = (id: string, options?: RequestOptions) =>
    this.get<AppUsers>(API_ENDPOINTS.APPS.APP_USERS(id), undefined, options);

  getAppDetails = (id: string, options?: RequestOptions) =>
    this.get<App>(API_ENDPOINTS.APPS.APP_CRUD(id), undefined, options);

  updateApp = (
    id: string,
    payload: Partial<CreateAppPayload>,
    options?: RequestOptions,
  ) => this.patch(API_ENDPOINTS.APPS.APP_CRUD(id), payload, options);

  deleteApp = (id: string, options?: RequestOptions) =>
    this.delete(API_ENDPOINTS.APPS.APP_CRUD(id), undefined, options);

  roleList = (params: MyAppParams, options?: RequestOptions) =>
    this.get<Role[]>(API_ENDPOINTS.APPS.LIST_ROLES, params, options);

  assignAppRole = (
    id: string,
    payload: UpdateRolePayload,
    options?: RequestOptions,
  ) => this.post(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), payload, options);

  deleteAppRole = (id: string, email: string, options?: RequestOptions) =>
    this.delete(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), { email }, options);

  updateRole = (
    id: string,
    payload: UpdateRolePayload,
    options?: RequestOptions,
  ) => this.patch(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), payload, options);
}

export const appsService = new AppsService(env.appUrl || "");
