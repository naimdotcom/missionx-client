import { mutationKeys, queryKeys } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { crmService } from "./crm.service";
import type {
  CustomerCreate,
  CustomerListParams,
  CustomerUpdate,
  ExportRequest,
  InboxCustomerPayload,
} from "./crm.types";

/**
 * Hook to fetch customers list with optional filters
 */
export const useCustomers = (params?: CustomerListParams) => {
  return useQuery({
    staleTime: 30_000,
    queryFn: () => crmService.getCustomers(params),
    queryKey: [...queryKeys.crmKeys.customerList, params],
  });
};

/**
 * Hook to create a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerCreate) => crmService.createCustomer(payload),
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
    mutationFn: ({ id, payload }: { id: string; payload: CustomerUpdate }) =>
      crmService.updateCustomer(id, payload),
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

export const useInboxCustomer = (payload: InboxCustomerPayload) => {
  return useQuery({
    queryKey: ["inbox-customer", payload],
    queryFn: () => crmService.inboxCustomer(payload),
    enabled: !!payload.customer_id && !!payload.app_id,
  });
}

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

export const useCustomer = (id?: string) => {
  return useQuery({
    queryKey: [...queryKeys.crmKeys.customerList, id],
    queryFn: () =>
      id ? crmService.getCustomerById(id) : Promise.resolve(null),
    enabled: !!id,
  });
};

export const useExportCustomers = () => {
  return useMutation({
    mutationFn: (payload: ExportRequest) => crmService.exportCustomers(payload),
    mutationKey: mutationKeys.crmKeys.exportCustomers,
    onSuccess: () => {
      // const url = window.URL.createObjectURL(new Blob([data]));
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", `customers_${Date.now()}.csv`);
      // document.body.appendChild(link);
      // link.click();
      toast.success("Customers exported successfully");
    },
    onError: () => {
      toast.error("Failed to export customers");
    },
  });
};
