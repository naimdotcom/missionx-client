import { useUpsertSegment } from "@/api/services/crm/crm.hook";
import type { JSONFilter, SegmentResponse } from "@/api/services/crm/crm.types";
import { TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CrmFilter,
  FILTER_FIELDS,
  FilterMode,
  mapCrmFiltersToSegmentFilters,
  mapSegmentFiltersToCrmFilters,
} from "../const";
import { SegmentRuleBuilder } from "./SegmentRuleBuilder";
import { Plus } from "lucide-react";

interface SaveSegmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAppId?: string;
  rules: JSONFilter;
  segment?: SegmentResponse | null;
  onSaved?: () => void;
}

export function SaveSegmentDialog({
  open,
  onOpenChange,
  selectedAppId,
  rules,
  segment,
  onSaved,
}: SaveSegmentDialogProps) {
  const upsertSegment = useUpsertSegment();
  const isEditing = Boolean(segment?.id);

  const [localFilters, setLocalFilters] = useState<CrmFilter[]>(() =>
    mapSegmentFiltersToCrmFilters(rules.rules),
  );
  const [localMode, setLocalMode] = useState<FilterMode>(
    rules.logic === "OR" ? "or" : "and",
  );

  // Sync internal state if the dialog opens with new props
  useEffect(() => {
    if (open) {
      setLocalFilters(mapSegmentFiltersToCrmFilters(rules.rules));
      setLocalMode(rules.logic === "OR" ? "or" : "and");
    }
  }, [open, rules]);

  const safeRules = useMemo(
    () =>
      mapCrmFiltersToSegmentFilters(localFilters).filter(
        (rule) =>
          rule.field &&
          rule.operator &&
          !(typeof rule.value === "string" && rule.value.trim() === ""),
      ),
    [localFilters],
  );

  const form = useForm({
    defaultValues: {
      name: segment?.name ?? "",
      description: segment?.description ?? "",
    },
    onSubmit: async ({ value }) => {
      const name = value.name.trim();
      const description = value.description.trim();

      if (!selectedAppId) {
        toast.error("Please select an app first.");
        return;
      }

      if (!name) {
        toast.error("Segment name is required.");
        return;
      }

      if (safeRules.length === 0) {
        toast.error("Add at least one filter before saving a segment.");
        return;
      }

      upsertSegment.mutate(
        {
          action: isEditing ? "update" : "add",
          segment: {
            app_id: selectedAppId,
            segment_id: segment?.id,
            name,
            description: description || undefined,
            filter_json: {
              logic: localMode === "or" ? "OR" : "AND",
              rules: safeRules,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success(
              isEditing
                ? "Segment updated successfully"
                : "Segment saved successfully",
            );
            onOpenChange(false);
            onSaved?.();
          },
        },
      );
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: segment?.name ?? "",
      description: segment?.description ?? "",
    });
  }, [form, open, segment?.name, segment?.description]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Segment" : "Save Segment"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the segment name and description."
              : "Save current filters as a reusable segment."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const trimmed = (value ?? "").trim();

                if (!trimmed) return "Segment name is required";
                if (trimmed.length > 80)
                  return "Segment name must be 80 characters or less";

                return undefined;
              },
              onSubmit: ({ value }) => {
                if (!(value ?? "").trim()) {
                  return "Segment name is required";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <TextField
                field={field}
                label="Segment Name"
                placeholder="High value customers"
                maxLength={80}
              />
            )}
          </form.Field>

          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                if ((value ?? "").trim().length > 180) {
                  return "Description must be 180 characters or less";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <TextareaField
                field={field}
                label="Description"
                placeholder="Customers with recent activity and high LTV"
                rows={3}
                maxLength={180}
              />
            )}
          </form.Field>

          <div className="flex items-center justify-between">
            <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              {safeRules.length} filter condition
              {safeRules.length === 1 ? "" : "s"}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setLocalFilters((prev) => [
                  ...prev,
                  {
                    id:
                      typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : Math.random().toString(36).substring(2, 9),
                    field: "",
                    operator: "",
                    values: [""],
                  },
                ]);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Filter
            </Button>
          </div>

          <div className="max-h-72 overflow-y-auto pr-1 pb-3">
            <SegmentRuleBuilder
              filters={localFilters}
              filterMode={localMode}
              fields={FILTER_FIELDS}
              onChangeMode={setLocalMode}
              onRemove={(id) => {
                setLocalFilters((prev) => prev.filter((f) => f.id !== id));
              }}
              onUpdate={(id, updates) => {
                setLocalFilters((prev) =>
                  prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
                );
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="text-white"
              onClick={() => onOpenChange(false)}
              disabled={upsertSegment.isPending}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || upsertSegment.isPending}
                >
                  {upsertSegment.isPending
                    ? isEditing
                      ? "Updating..."
                      : "Saving..."
                    : isEditing
                      ? "Update Segment"
                      : "Save Segment"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
