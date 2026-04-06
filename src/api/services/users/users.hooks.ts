import { queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfileFull, updateUserProfile } from "./users.service";
import { UpdateUserProfilePayload } from "./users.type";

export function useUserProfileFull(enable: boolean) {
  return useQuery({
    enabled: !!enable,
    queryKey: queryKeys.usersQueryKeys.userProfileFull,
    queryFn: async () => {
      const response = await getUserProfileFull();
      return response;
    },
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersQueryKeys.userProfileFull,
      });
    },
  });
}
