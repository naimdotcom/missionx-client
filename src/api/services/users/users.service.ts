import { API_ENDPOINTS, BaseAPIService, RequestOptions } from "@/api";
import { UserProfileFull } from "./users.type";

export class UsersService extends BaseAPIService {
  getUserProfileFull = (options?: RequestOptions) => {
    return this.get<UserProfileFull>(
      API_ENDPOINTS.USERS.FULL_PROFILE,
      undefined,
      options,
    );
  };
}

export const usersService = new UsersService();
