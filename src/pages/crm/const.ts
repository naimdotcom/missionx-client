import { ChannelPlatform } from "@/api";
import type { CustomerListParams } from "@/api/services/crm/crm.types";
import { Filter, FilterFieldsConfig } from "~/components/reui/filters";

export type FilterMode = "and" | "or";

export type CrmQueryState = {
  page: number;
  perPage: number;
  filterMode: FilterMode;
  q: string | null;
  platform: string | null;
  is_active: string | null;
  email: string | null;
  phone: string | null;
  platform_id: string | null;
};

export const FILTER_KEYS = [
  "q",
  "platform",
  "is_active",
  "email",
  "phone",
  "platform_id",
] as const;

export type CrmFilterKey = (typeof FILTER_KEYS)[number];

export const SEARCH_DEBOUNCE_MS = 300;

export const QUERY_STATE_PARSERS = {
  page: 1,
  perPage: 10,
  filterMode: "and" as const,
};

export const TEXT_FILTER_KEYS = new Set<CrmFilterKey>([
  "q",
  "email",
  "phone",
  "platform_id",
]);

export const EMPTY_FILTER_PARAMS: Pick<
  CrmQueryState,
  "q" | "platform" | "is_active" | "email" | "phone" | "platform_id"
> = {
  q: null,
  platform: null,
  is_active: null,
  email: null,
  phone: null,
  platform_id: null,
};

export const FILTER_FIELDS: FilterFieldsConfig = [
  {
    key: "platform",
    label: "Platform",
    type: "select",
    options: [
      { label: "Instagram", value: "instagram" },
      { label: "Facebook", value: "facebook" },
    ],
  },
  {
    key: "is_active",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    placeholder: "Filter by email...",
  },
  {
    key: "phone",
    label: "Phone",
    type: "text",
    placeholder: "Filter by phone...",
  },
  {
    key: "platform_id",
    label: "Platform ID",
    type: "text",
    placeholder: "Filter by platform ID...",
  },
];

const toOptional = (value: string | null | undefined) => value || undefined;

const parseIsActive = (value: string | null | undefined) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

export const normalizeFilterMode = (
  value: string | null | undefined,
): FilterMode => (value === "or" ? "or" : "and");

const getActiveFilters = (params: CrmQueryState): Record<string, string> => {
  const activeFilters: Record<string, string> = {};

  FILTER_KEYS.forEach((key) => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== "") {
      activeFilters[key] = value;
    }
  });

  return activeFilters;
};

export const buildApiParams = (
  params: CrmQueryState,
  selectedAppId?: string,
): CustomerListParams => {
  const activeFilters = getActiveFilters(params);
  const filterMode = normalizeFilterMode(params.filterMode);

  const serializedFilters =
    Object.keys(activeFilters).length > 0
      ? JSON.stringify({
          condition: filterMode,
          filters: activeFilters,
        })
      : undefined;

  const useFieldParams = filterMode === "and";

  return {
    page: params.page,
    limit: params.perPage,
    q: useFieldParams ? toOptional(params.q) : undefined,
    app_id: selectedAppId,
    platform: useFieldParams
      ? (toOptional(params.platform) as ChannelPlatform | undefined)
      : undefined,
    platform_id: useFieldParams ? toOptional(params.platform_id) : undefined,
    email: useFieldParams ? toOptional(params.email) : undefined,
    phone: useFieldParams ? toOptional(params.phone) : undefined,
    is_active: useFieldParams ? parseIsActive(params.is_active) : undefined,
    filters: serializedFilters,
  };
};

export const buildFilters = (params: CrmQueryState): Filter[] =>
  FILTER_KEYS.flatMap((key) => {
    const value = params[key];
    if (value === null || value === undefined) {
      return [];
    }

    return [
      {
        id: key,
        field: key,
        operator: TEXT_FILTER_KEYS.has(key) ? "contains" : "is",
        values: [value],
      } as Filter,
    ];
  });

export const buildParamsFromFilters = (filters: Filter[]) => {
  const nextParams: Record<"page" | CrmFilterKey, string | number | null> = {
    page: 1,
    ...EMPTY_FILTER_PARAMS,
  };

  filters.forEach((filter) => {
    const isKnownField = FILTER_KEYS.includes(filter.field as CrmFilterKey);
    if (!isKnownField) {
      return;
    }

    nextParams[filter.field as CrmFilterKey] =
      (filter.values[0] as string) ?? "";
  });

  return nextParams;
};

export const resolveUpdater = <T>(updater: T | ((prev: T) => T), prev: T): T =>
  typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
