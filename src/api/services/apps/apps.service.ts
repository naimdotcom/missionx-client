import { API_ENDPOINTS, RequestOptions } from "@/api";
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
import { appClient } from "@/api/core/init";

export const createApp = (
  payload: CreateAppPayload,
  options?: RequestOptions,
) => appClient.post<App>(API_ENDPOINTS.APPS.CREATE_APP, payload, options);

export const listApps = (params: AppParams, options?: RequestOptions) =>
  appClient.get<Apps>(API_ENDPOINTS.APPS.LIST_APPS, params, options);

export const listMyApps = (params: MyAppParams, options?: RequestOptions) =>
  appClient.get<Apps>(API_ENDPOINTS.APPS.LIST_MY_APPS, params, options);

export const listAppUsers = (id: string, options?: RequestOptions) =>
  appClient.get<AppUsers>(API_ENDPOINTS.APPS.APP_USERS(id), undefined, options);

export const getAppDetails = (id: string, options?: RequestOptions) =>
  appClient.get<App>(API_ENDPOINTS.APPS.APP_CRUD(id), undefined, options);

export const updateApp = (
  id: string,
  payload: Partial<CreateAppPayload>,
  options?: RequestOptions,
) => appClient.patch(API_ENDPOINTS.APPS.APP_CRUD(id), payload, options);

export const deleteApp = (id: string, options?: RequestOptions) =>
  appClient.delete(API_ENDPOINTS.APPS.APP_CRUD(id), undefined, options);

export const roleList = (params: MyAppParams, options?: RequestOptions) =>
  appClient.get<Role[]>(API_ENDPOINTS.APPS.LIST_ROLES, params, options);

export const assignAppRole = (
  id: string,
  payload: UpdateRolePayload,
  options?: RequestOptions,
) => appClient.post(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), payload, options);

export const deleteAppRole = (
  id: string,
  email: string,
  options?: RequestOptions,
) => appClient.delete(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), { email }, options);

export const updateRole = (
  id: string,
  payload: UpdateRolePayload,
  options?: RequestOptions,
) => appClient.patch(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), payload, options);
