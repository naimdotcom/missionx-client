import { API_ENDPOINTS } from "@/api";
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

export const appService = {
  createApp: (payload: CreateAppPayload) =>
    appClient.post<App>(API_ENDPOINTS.APPS.CREATE_APP, payload),

  listApps: (params: AppParams) =>
    appClient.get<Apps>(API_ENDPOINTS.APPS.LIST_APPS, params),

  listMyApps: (params: MyAppParams) =>
    appClient.get<Apps>(API_ENDPOINTS.APPS.LIST_MY_APPS, params),

  listAppUsers: (id: string) =>
    appClient.get<AppUsers>(API_ENDPOINTS.APPS.APP_USERS(id)),

  getAppDetails: (id: string) =>
    appClient.get<App>(API_ENDPOINTS.APPS.APP_CRUD(id)),

  updateApp: (id: string, payload: Partial<CreateAppPayload>) =>
    appClient.patch(API_ENDPOINTS.APPS.APP_CRUD(id), payload),

  deleteApp: (id: string) => appClient.delete(API_ENDPOINTS.APPS.APP_CRUD(id)),

  roleList: (params: MyAppParams) =>
    appClient.get<Role[]>(API_ENDPOINTS.APPS.LIST_ROLES, params),

  assignAppRole: (id: string, payload: UpdateRolePayload) =>
    appClient.post(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), payload),

  deleteAppRole: (id: string, email: string) =>
    appClient.delete(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), { email }),

  updateRole: (id: string, payload: UpdateRolePayload) =>
    appClient.patch(API_ENDPOINTS.APPS.APP_ROLE_CRUD(id), payload),
};
