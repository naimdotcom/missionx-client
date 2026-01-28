import { queryKeys } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "./users.service";

export function useUserProfileFull() {
  return useQuery({
    queryKey: queryKeys.usersQueryKeys.userProfileFull,
    queryFn: async () => {
      const response = await usersService.getUserProfileFull();
      return response;
    },
  });
}
