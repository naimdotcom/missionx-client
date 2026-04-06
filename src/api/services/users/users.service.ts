import { API_ENDPOINTS, RequestOptions } from "@/api";
import { authClient } from "@/api/core/init";
import { UpdateUserProfilePayload, UserProfileFull } from "./users.type";

export const getUserProfileFull = (options?: RequestOptions) => {
  return authClient.get<UserProfileFull>(
    API_ENDPOINTS.USERS.FULL_PROFILE,
    undefined,
    options,
  );
};

export const updateUserProfile = (
  payload: UpdateUserProfilePayload,
  options?: RequestOptions,
) => {
  return authClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, payload, options);
};
