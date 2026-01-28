import { useQuery } from "@tanstack/react-query";
import { usersQueryKeys } from "./users.keys";
import { usersService } from "./users.service";

export function useUserProfileFull() {
  return useQuery({
    queryKey: usersQueryKeys.userProfileFull,
    queryFn: async () => {
      const response = await usersService.getUserProfileFull();
      return response;
    },
  });
}
