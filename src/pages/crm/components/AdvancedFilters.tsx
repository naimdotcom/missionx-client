import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ListFilter, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SaveSegmentDialog } from "./SaveSegmentDialog";
import {
  type CrmFilter,
  type CrmFilterOption,
  type FilterMode,
  FILTER_FIELDS,
  toFilterJson,
} from "../const";

interface Props {
  filters: CrmFilter[];
  filterMode: FilterMode;
  onApply: (filters: CrmFilter[], mode: FilterMode) => void;
  onClear: () => void;
  selectedAppId?: string;
  applyOnChange?: boolean;
}

const fields = FILTER_FIELDS;

const withInternalIds = (items: CrmFilter[]): CrmFilter[] =>
  items.map((filter) => ({
    ...filter,
    id: filter.id || crypto.randomUUID(),
  }));

const sanitizeFilters = (items: CrmFilter[]): CrmFilter[] =>
  items
    .filter((item) => item.values && item.values[0] !== "")
    .map((item) => {
      const { id: _id, ...rest } = item;
      return rest as CrmFilter;
    });

export function AdvancedFilters({
  filters,
  filterMode,
  onApply,
  onClear,
  selectedAppId,
  applyOnChange = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // local state
  const [localFilters, setLocalFilters] = useState<CrmFilter[]>(
    withInternalIds(filters),
  );
  const [localMode, setLocalMode] = useState<FilterMode>(filterMode);

  const validLocalFilters = useMemo(
    () => sanitizeFilters(localFilters),
    [localFilters],
  );
  const segmentFilterJson = useMemo(
    () =>
      toFilterJson(validLocalFilters, localMode) || {
        logic: "AND" as const,
        rules: [],
      },
    [validLocalFilters, localMode],
  );

  const syncLocalState = () => {
    setLocalFilters(
      filters.length > 0
        ? withInternalIds(filters)
        : [
            {
              id: crypto.randomUUID(),
              field: fields[0]?.key || "unknown",
              operator: "is",
              values: [""],
            },
          ],
    );
    setLocalMode(filterMode);
  };

  const handleAdd = () => {
    const fieldConfig = fields[0];
    const initialOp = fieldConfig?.type === "text" ? "contains" : "is";

    setLocalFilters((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        field: fieldConfig?.key || "unknown",
        operator: initialOp,
        values: [""],
      },
    ]);
  };

  const handleRemove = (id: string | undefined) => {
    if (!id) return;
    setLocalFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const maybeApplyOnChange = (
    nextFilters: CrmFilter[],
    nextMode: FilterMode,
  ) => {
    if (!applyOnChange) {
      return;
    }

    onApply(sanitizeFilters(nextFilters), nextMode);
  };

  const handleUpdate = (
    id: string | undefined,
    updates: Partial<CrmFilter>,
  ) => {
    if (!id) return;
    setLocalFilters((prev) => {
      const nextFilters = prev.map((f) => {
        if (f.id === id) {
          const newF = { ...f, ...updates };
          // reset operator if field changes
          if (updates.field) {
            const fieldDef = fields.find((ff) => ff.key === updates.field);
            if (fieldDef?.type === "text") newF.operator = "contains";
            else newF.operator = "is";
            newF.values = [""];
          }
          return newF;
        }
        return f;
      });

      maybeApplyOnChange(nextFilters, localMode);
      return nextFilters;
    });
  };

  const handleApply = () => {
    onApply(sanitizeFilters(localFilters), localMode);
    setOpen(false);
  };

  const handleReset = () => {
    onClear();
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          syncLocalState();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <ListFilter className="h-4 w-4" />
          Filters {filters.length > 0 && `(${filters.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-150 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold leading-none">Advanced Filters</h4>
          </div>

          <div className="space-y-2">
            {localFilters.map((filter, index) => {
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
                        value={localMode}
                        onValueChange={(val: FilterMode) => {
                          setLocalMode(val);
                          maybeApplyOnChange(localFilters, val);
                        }}
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
                        {localMode}
                      </span>
                    )}
                  </div>

                  <Select
                    value={filter.field}
                    onValueChange={(val) =>
                      handleUpdate(filter.id, { field: val })
                    }
                  >
                    <SelectTrigger className="h-8 flex-1">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f.key || ""} value={f.key || ""}>
                          {f.label || f.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.operator}
                    onValueChange={(val) =>
                      handleUpdate(filter.id, { operator: val })
                    }
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
                        value={String(filter.values[0] || "")}
                        onValueChange={(val) =>
                          handleUpdate(filter.id, { values: [val] })
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
                        value={String(filter.values[0] || "")}
                        onChange={(e) =>
                          handleUpdate(filter.id, { values: [e.target.value] })
                        }
                      />
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground"
                    onClick={() => handleRemove(filter.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {!localFilters.length && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No filters applied.
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add filter
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveDialogOpen(true)}
                disabled={segmentFilterJson.rules.length === 0}
              >
                Save Filter
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Reset
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>

      <SaveSegmentDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        selectedAppId={selectedAppId}
        rules={segmentFilterJson}
      />
    </Popover>
  );
}
