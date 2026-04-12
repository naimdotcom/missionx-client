import { API_ENDPOINTS, RequestOptions } from "@/api";
import { authClient } from "@/api/core/init";
import { UpdateUserProfilePayload, UserProfileFull } from "./user.type";

export const userService = {
  getUserProfileFull: (options?: RequestOptions) => {
    return authClient.get<UserProfileFull>(
      API_ENDPOINTS.USER.FULL_PROFILE,
      undefined,
      options,
    );
  },

  updateUserProfile: (
    payload: UpdateUserProfilePayload,
    options?: RequestOptions,
  ) => {
    return authClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, payload, options);
  },
};
