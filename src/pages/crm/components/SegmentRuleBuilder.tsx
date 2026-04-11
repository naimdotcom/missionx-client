import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import type {
  CrmFilter,
  CrmFilterFieldConfig,
  CrmFilterOption,
  FilterMode,
} from "../const";

export interface SegmentRuleBuilderProps {
  filters: CrmFilter[];
  filterMode: FilterMode;
  fields: CrmFilterFieldConfig[];
  onUpdate: (id: string | undefined, updates: Partial<CrmFilter>) => void;
  onRemove: (id: string | undefined) => void;
  onChangeMode: (mode: FilterMode) => void;
}

export function SegmentRuleBuilder({
  filters,
  filterMode,
  fields,
  onUpdate,
  onRemove,
  onChangeMode,
}: SegmentRuleBuilderProps) {
  return (
    <div className="space-y-2">
      {filters.map((filter, index) => {
        const fieldConfig = fields.find((f) => f.key === filter.field);
        const operators =
          fieldConfig?.type === "text"
            ? [
                { label: "contains", value: "contains" },
                { label: "is exact", value: "is" },
                { label: "is not", value: "is_not" },
              ]
            : [
                { label: "is", value: "is" },
                { label: "is not", value: "is_not" },
              ];

        return (
          <div key={filter.id} className="flex items-center gap-2">
            <div className="flex w-17.5 shrink-0 justify-end pr-2 text-sm font-medium text-muted-foreground">
              {index === 0 ? (
                "Where"
              ) : index === 1 ? (
                <Select
                  value={filterMode}
                  onValueChange={(val: FilterMode) => onChangeMode(val)}
                >
                  <SelectTrigger className="h-8 w-17.5 border-none bg-transparent px-1 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="and">And</SelectItem>
                    <SelectItem value="or">Or</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span className="capitalize py-1 inline-block">
                  {filterMode}
                </span>
              )}
            </div>

            <Select
              value={
                fields.some((f) => f.key === filter.field)
                  ? filter.field
                  : undefined
              }
              onValueChange={(val) => onUpdate(filter.id, { field: val })}
            >
              <SelectTrigger className="h-8 flex-1">
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((f, i) => (
                  <SelectItem
                    key={f.key || `fallback-${i}`}
                    value={f.key || `fallback-${i}`}
                  >
                    {f.label || f.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={
                operators.some((o) => o.value === filter.operator)
                  ? filter.operator
                  : undefined
              }
              onValueChange={(val) => onUpdate(filter.id, { operator: val })}
            >
              <SelectTrigger className="h-8 w-30">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1">
              {fieldConfig?.type === "select" ? (
                <Select
                  value={
                    filter.values?.[0] !== undefined &&
                    filter.values?.[0] !== "" &&
                    fieldConfig.options?.some(
                      (opt) => String(opt.value) === String(filter.values?.[0]),
                    )
                      ? String(filter.values[0])
                      : undefined
                  }
                  onValueChange={(val) =>
                    onUpdate(filter.id, { values: [val] })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select value..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldConfig.options?.map((opt: CrmFilterOption) => (
                      <SelectItem
                        key={String(opt.value)}
                        value={String(opt.value)}
                      >
                        {String(opt.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  className="h-8"
                  placeholder={fieldConfig?.placeholder || "Value..."}
                  value={
                    filter.values?.[0] !== undefined
                      ? String(filter.values[0])
                      : ""
                  }
                  onChange={(e) =>
                    onUpdate(filter.id, { values: [e.target.value] })
                  }
                />
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              onClick={() => onRemove(filter.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
