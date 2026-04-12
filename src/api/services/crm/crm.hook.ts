import { mutationKeys, queryKeys } from "@/api";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { crmService } from "./crm.service";
import type {
  CustomerCreate,
  CustomerListParams,
  CustomerUpdate,
  ExportRequest,
  InboxCustomerPayload,
  SegmentListParams,
  SegmentResponse,
  SegmentUpsert,
  UpdateAppFieldAction,
  UpdateAppFieldPayload,
} from "./crm.types";

const SEGMENTS_PAGE_SIZE = 12;

const getSegmentItemsFromPage = (page: unknown): SegmentResponse[] => {
  if (Array.isArray(page)) return page as SegmentResponse[];

  if (!page || typeof page !== "object") {
    return [];
  }

  const listData =
    (page as Record<string, unknown>).data ??
    (page as Record<string, unknown>).items ??
    (page as Record<string, unknown>).results ??
    (page as Record<string, unknown>).segments;

  return Array.isArray(listData) ? (listData as SegmentResponse[]) : [];
};

/**
 * Hook to fetch customers list with optional filters
 */
export const useCustomers = (params?: CustomerListParams) => {
  return useQuery({
    staleTime: 0,
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
};

export const useSegments = (params?: Omit<SegmentListParams, "page">) => {
  return useInfiniteQuery({
    staleTime: 0,
    enabled: !!params?.app_id,
    queryKey: [...queryKeys.crmKeys.segments, params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      crmService.listSegments({
        ...params,
        page: pageParam,
        limit: params?.limit ?? SEGMENTS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (
        lastPage &&
        typeof lastPage === "object" &&
        !Array.isArray(lastPage)
      ) {
        const hasMore = Boolean((lastPage as Record<string, unknown>).has_more);
        const currentPage = Number(
          (lastPage as Record<string, unknown>).page ?? lastPageParam,
        );
        const totalPages = Number(
          (lastPage as Record<string, unknown>).total_pages ?? 0,
        );

        if (hasMore) return currentPage + 1;
        if (totalPages > 0 && currentPage < totalPages) return currentPage + 1;

        const total = Number((lastPage as Record<string, unknown>).total ?? 0);
        if (total > 0) {
          const loadedCount = pages.reduce(
            (acc, page) => acc + getSegmentItemsFromPage(page).length,
            0,
          );

          if (loadedCount < total) {
            return currentPage + 1;
          }
        }
      }

      const lastItems = getSegmentItemsFromPage(lastPage);
      const pageSize = params?.limit ?? SEGMENTS_PAGE_SIZE;

      return lastItems.length >= pageSize ? lastPageParam + 1 : undefined;
    },
  });
};

export const useUpdateSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      action: "add" | "update" | "remove";
      segment: SegmentUpsert;
    }) => crmService.upsertSegment(payload.action, payload.segment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmKeys.segments });
    },
    onError: (error: unknown) => {
      const details =
        typeof error === "object" &&
        error !== null &&
        "details" in error &&
        typeof (error as { details?: unknown }).details === "string"
          ? (error as { details: string }).details
          : "Failed to save segment";

      toast.error(details);
    },
  });
};

export const useUpsertSegment = useUpdateSegment;

export const useDeleteSegment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => crmService.deleteSegment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.crmKeys.segments,
      });
      toast.success("Segment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete segment");
    },
  });
};

export const useCustomer = (id: string, app_id: string) => {
  return useQuery({
    queryFn: () => {
      if (!id) {
        throw new Error("Customer ID is required");
      } else {
        return crmService.getCustomerById(id, app_id);
      }
    },
    queryKey: [...queryKeys.crmKeys.customerList, id],
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

export const useAppFields = (app_id: string) => {
  return useQuery({
    enabled: !!app_id,
    queryFn: () => crmService.appFields(app_id),
    queryKey: [queryKeys.crmKeys.appFields(app_id)],
  });
};

export const useUpdateAppField = () => {
  return useMutation({
    mutationFn: (payload: {
      app_id: string;
      action: UpdateAppFieldAction;
      payload: UpdateAppFieldPayload;
    }) =>
      crmService.updateAppFields(
        payload.app_id,
        payload.action,
        payload.payload,
      ),
  });
};
