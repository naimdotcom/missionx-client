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

const serializeFilterValue = (value: SegmentFilter["value"]): string[] => {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

export const mapSegmentFiltersToCrmFilters = (
  filters: SegmentFilter[],
): CrmFilter[] =>
  (filters || []).map((item) => ({
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 9),
    field: item.field,
    operator: item.operator === "equals" ? "is" : item.operator,
    values: serializeFilterValue(item.value),
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

export const formatSegmentRulesPreview = (
  rules: SegmentFilter[],
  logic: "AND" | "OR" = "AND",
): string => {
  if (!rules || rules.length === 0) {
    return "0 rules";
  }

  const preview = rules
    .slice(0, 2)
    .map((rule) => {
      const fieldConfig = FILTER_FIELDS.find((f) => f.key === rule.field);
      const label = fieldConfig?.label || rule.field;

      let displayValue = Array.isArray(rule.value)
        ? rule.value.join(", ")
        : String(rule.value ?? "");

      if (fieldConfig?.options) {
        const option = fieldConfig.options.find(
          (opt) => String(opt.value) === String(rule.value),
        );
        if (option) {
          displayValue = option.label;
        }
      }

      return `${label} ${rule.operator.replace(/_/g, " ")} ${displayValue}`;
    })
    .join(` ${logic} `);

  return rules.length > 2 ? `${preview} ...` : preview;
};

export const resolveUpdater = <T>(updater: T | ((prev: T) => T), prev: T): T =>
  typeof updater === "function" ? (updater as (prev: T) => T)(prev) : updater;
