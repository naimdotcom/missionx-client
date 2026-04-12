import { queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "./user.service";
import { UpdateUserProfilePayload } from "./user.type";

export function useUserProfileFull(enable: boolean) {
  return useQuery({
    enabled: !!enable,
    queryKey: queryKeys.usersQueryKeys.userProfileFull,
    queryFn: async () => {
      const response = await userService.getUserProfileFull();
      return response;
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      userService.updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersQueryKeys.userProfileFull,
      });
    },
  });
}
