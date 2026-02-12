import { API_ENDPOINTS, BaseAPIService, RequestOptions } from "@/api";
import { env } from "@/lib/env";
import { UpdateUserProfilePayload, UserProfileFull } from "./users.type";

export class UsersService extends BaseAPIService {
  getUserProfileFull = (options?: RequestOptions) => {
    return this.get<UserProfileFull>(
      API_ENDPOINTS.USERS.FULL_PROFILE,
      undefined,
      options,
    );
  };

  updateUserProfile = (
    payload: UpdateUserProfilePayload,
    options?: RequestOptions,
  ) => {
    return this.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, payload, options);
  };
}

export const usersService = new UsersService(env.authUrl);
