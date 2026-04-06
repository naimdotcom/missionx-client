import { APIErrorResponse } from "@/api/core/api.types";
import { queryKeys } from "@/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  assignAppRole,
  createApp,
  deleteApp,
  deleteAppRole,
  getAppDetails,
  listApps,
  listAppUsers,
  listMyApps,
  roleList,
  updateApp,
  updateRole,
} from "./apps.service";
import {
  AppParams,
  CreateAppPayload,
  MyAppParams,
  UpdateRolePayload,
} from "./apps.type";

/**
 * Hook to create a new app
 */
export const useCreateApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppPayload) => createApp(payload),
    onSuccess: () => {
      // Invalidate both all apps and my apps lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.listApps,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.listMyApps,
      });
    },
    onError: (error: APIErrorResponse) => {
      toast.error(error?.detail || error?.message || "Failed to create app");
    },
  });
};

/**
 * Hook to list all apps
 */
export const useListApps = (params: AppParams) => {
  return useQuery({
    queryFn: () => listApps(params),
    queryKey: [...queryKeys.appsQueryKeys.listApps, params],
  });
};

/**
 * Hook to list my apps
 */
export const useListMyApps = (params: MyAppParams) => {
  return useQuery({
    queryFn: () => listMyApps(params),
    queryKey: [...queryKeys.appsQueryKeys.listMyApps, params],
  });
};

/**
 * Hook to list app users
 */
export const useListAppUsers = (id: string, enabled = true) => {
  return useQuery({
    enabled: !!id && enabled,
    queryFn: () => listAppUsers(id),
    queryKey: queryKeys.appsQueryKeys.appUsers(id),
  });
};

/**
 * Hook to get app details
 */
export const useGetAppDetails = (id: string, enabled = true) => {
  return useQuery({
    enabled: !!id && enabled,
    queryFn: () => getAppDetails(id),
    queryKey: queryKeys.appsQueryKeys.appDetails(id),
  });
};

/**
 * Hook to update an app
 */
export const useUpdateApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateAppPayload }) =>
      updateApp(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.appDetails(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.listApps,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.listMyApps,
      });
    },
  });
};

/**
 * Hook to delete an app
 */
export const useDeleteApp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.listApps,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.listMyApps,
      });
    },
  });
};

/**
 * Hook to list roles
 */
export const useRoleList = (params: MyAppParams) => {
  return useQuery({
    queryKey: [...queryKeys.appsQueryKeys.listRoles, params],
    queryFn: () => roleList(params),
  });
};

/**
 * Hook to assign a role to a user in an app
 */
export const useAssignAppRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      assignAppRole(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.appUsers(id),
      });
    },
  });
};

/**
 * Hook to delete a user role from an app
 */
export const useDeleteAppRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      deleteAppRole(id, email),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.appUsers(id),
      });
    },
  });
};

/**
 * Hook to update an existing user role in an app
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      updateRole(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.appsQueryKeys.appUsers(id),
      });
    },
  });
};
