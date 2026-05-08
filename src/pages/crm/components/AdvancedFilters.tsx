import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ListFilter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { SegmentRuleBuilder } from "./SegmentRuleBuilder";
import { SaveSegmentDialog } from "./SaveSegmentDialog";
import {
  type CrmFilter,
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

          <SegmentRuleBuilder
            filters={localFilters}
            filterMode={localMode}
            fields={fields}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            onChangeMode={(val: FilterMode) => {
              setLocalMode(val);
              maybeApplyOnChange(localFilters, val);
            }}
          />

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
