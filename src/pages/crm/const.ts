import type {
  CustomerListParams,
  JSONFilter,
  SegmentFilter,
} from "@/api/services/crm/crm.types";
import { parseAsInteger, parseAsJson, parseAsString } from "nuqs";

export type CrmFilterOption = {
  value: string;
  label: string;
};

export type CrmFilterFieldConfig = {
  key?: string;
  label?: string;
  type?: "select" | "text";
  options?: CrmFilterOption[];
  placeholder?: string;
};

export type CrmFilter = {
  id?: string;
  field: string;
  operator: string;
  values: string[];
};

export type FilterMode = "and" | "or";

export type AdvancedFilterData = {
  condition: FilterMode;
  items: CrmFilter[];
};

export type CrmQueryState = {
  page: number;
  perPage: number;
  q: string | null;
  segment_id: string | null;
  filters: AdvancedFilterData | null;
};

export const SEARCH_DEBOUNCE_MS = 300;

export const filtersParser = parseAsJson<AdvancedFilterData>(
  (val) => val as AdvancedFilterData,
);

export const QUERY_STATE_PARSERS = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  q: parseAsString,
  segment_id: parseAsString,
  filters: filtersParser,
};

export const FILTER_FIELDS: CrmFilterFieldConfig[] = [
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

export const buildApiParams = (
  params: CrmQueryState,
  selectedAppId?: string,
): CustomerListParams => {
  const adv = params.filters;
  const filterJson = adv ? toFilterJson(adv.items, adv.condition) : undefined;

  return {
    page: params.page,
    limit: params.perPage,
    q: params.q || undefined,
    app_id: selectedAppId,
    segment_id: params.segment_id || undefined,
    filter_json: filterJson ? JSON.stringify(filterJson) : undefined,
  };
};

const parseFilterValue = (
  field: string,
  values: string[],
): SegmentFilter["value"] => {
  if (values.length === 0) return null;

  if (values.length === 1) {
    const raw = values[0] ?? "";

    if (field === "is_active") {
      if (raw === "true") return true;
      if (raw === "false") return false;
    }

    return raw;
  }

  return values;
};

export const mapCrmFiltersToSegmentFilters = (
  filters: CrmFilter[],
): SegmentFilter[] =>
  filters
    .filter((item) => item.field && item.values && item.values[0] !== "")
    .map((item) => ({
      field: item.field,
      operator: item.operator as SegmentFilter["operator"],
      value: parseFilterValue(item.field, item.values),
    }));

export const toFilterJson = (
  filters: CrmFilter[],
  mode: FilterMode,
): JSONFilter | undefined => {
  const rules = mapCrmFiltersToSegmentFilters(filters);

  if (rules.length === 0) {
    return undefined;
  }

  return {
    logic: mode.toUpperCase() as "AND" | "OR",
    rules,
  };
};

export const resolveUpdater = <T>(updater: T | ((prev: T) => T), prev: T): T =>
  typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
