import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { crmService } from "./crm.service";
import type {
  CustomerCreate,
  CustomerListParams,
  CustomerUpdate,
} from "./crm.types";

/**
 * Hook to fetch customers list with optional filters
 */
export const useCustomers = (params?: Partial<CustomerListParams>) => {
  return useQuery({
    queryKey: [...queryKeys.crmKeys.customerList, params],
    queryFn: () => crmService.getCustomers(params),
    staleTime: 30_000,
  });
};

/**
 * Hook to create a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerCreate) =>
      crmService.createCustomer(payload),
    mutationKey: mutationKeys.crmKeys.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crmKeys.customerList,
      });
      toast.success("Customer created successfully");
    },
    onError: () => {
      toast.error("Failed to create customer");
    },
  });
};

/**
 * Hook to update a customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CustomerUpdate;
    }) => crmService.updateCustomer(id, payload),
    mutationKey: mutationKeys.crmKeys.updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crmKeys.customerList,
      });
      toast.success("Customer updated successfully");
    },
    onError: () => {
      toast.error("Failed to update customer");
    },
  });
};

/**
 * Hook to delete a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => crmService.deleteCustomer(id),
    mutationKey: mutationKeys.crmKeys.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crmKeys.customerList,
      });
      toast.success("Customer deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete customer");
    },
  });
};

/**
 * 
 * Segments
 * 
 */

export const useSegments = (params?: Partial<import("./crm.types").SegmentListParams>) => {
  return useQuery({
    queryKey: ["segments", params],
    queryFn: () => crmService.getSegments(params),
    staleTime: 30_000,
  });
};

export const useCreateSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: import("./crm.types").SegmentCreate) =>
      crmService.createSegment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["segments"],
      });
      toast.success("Segment created successfully");
    },
    onError: () => {
      toast.error("Failed to create segment");
    },
  });
};

export const useUpdateSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: import("./crm.types").SegmentUpdate;
    }) => crmService.updateSegment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["segments"],
      });
      toast.success("Segment updated successfully");
    },
    onError: () => {
      toast.error("Failed to update segment");
    },
  });
};

export const useDeleteSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => crmService.deleteSegment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["segments"],
      });
      toast.success("Segment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete segment");
    },
  });
};
