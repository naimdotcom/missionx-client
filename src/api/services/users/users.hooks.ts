import { queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "./users.service";
import { UpdateUserProfilePayload } from "./users.type";

export function useUserProfileFull(enable: boolean) {
  return useQuery({
    enabled: !!enable,
    queryKey: queryKeys.usersQueryKeys.userProfileFull,
    queryFn: async () => {
      const response = await usersService.getUserProfileFull();
      return response;
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      usersService.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersQueryKeys.userProfileFull,
      });
    },
  });
}
