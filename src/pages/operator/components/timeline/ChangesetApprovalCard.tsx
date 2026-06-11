import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Package,
  RefreshCw,
  Rows3,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChoiceOption } from "@/api/services/operator/operator.type";
import { useChangesetPreview } from "@/api/services/operator/operator.hook";

interface ChangesetApprovalCardProps {
  changesetId: string;
  prompt: string;
  options: ChoiceOption[];
  answered: boolean;
  selection?: string[];
  onSubmit: (selection: string[]) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  applied: "bg-green-500/15 text-green-700 dark:text-green-400",
  skipped: "bg-secondary text-secondary-foreground",
  conflict: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  failed: "bg-destructive/15 text-destructive",
};

function titleCase(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function DiffCell({
  diff,
}: {
  diff?: Record<string, { old: unknown; new: unknown }> | null;
}) {
  if (!diff) return <span className="text-muted-foreground">—</span>;
  const entries = Object.entries(diff).slice(0, 3);
  if (!entries.length) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-col gap-0.5">
      {entries.map(([field, { old: o, new: n }]) => (
        <span key={field} className="whitespace-nowrap text-[11px]">
          <span className="font-medium text-muted-foreground">{field}:</span>{" "}
          <span className="text-muted-foreground line-through">
            {String(o ?? "—")}
          </span>{" "}
          <span className="text-foreground">→ {String(n ?? "—")}</span>
        </span>
      ))}
      {Object.keys(diff).length > 3 && (
        <span className="text-[11px] text-muted-foreground">
          +{Object.keys(diff).length - 3} more
        </span>
      )}
    </div>
  );
}

export function ChangesetApprovalCard({
  changesetId,
  prompt,
  options,
  answered,
  selection,
  onSubmit,
}: ChangesetApprovalCardProps) {
  const [page, setPage] = useState(0);
  const limit = 50;

  const { data: preview, isLoading, isError, refetch } = useChangesetPreview(
    changesetId,
    { offset: page * limit, limit },
  );

  const isLocked = answered;
  const chosen = answered ? (selection ?? []) : [];

  const approveOption = options.find(
    (o) =>
      o.id === "approve" ||
      o.label.toLowerCase().includes("approve"),
  );
  const rejectOption = options.find(
    (o) =>
      o.id === "reject" ||
      o.label.toLowerCase().includes("reject"),
  );

  const kindLabel =
    preview?.kind === "bulk_update" ? "Bulk Update" : "Import";

  const counts = preview?.counts ?? {};
  const totalItems = preview?.total_items ?? 0;

  const summaryPills = [
    {
      icon: <Rows3 className="size-3" />,
      label: `${totalItems} rows`,
      className: "bg-muted text-muted-foreground",
    },
    counts.pending != null && counts.pending > 0
      ? {
          icon: <Sparkles className="size-3" />,
          label: `${counts.pending} new`,
          className: "bg-primary/10 text-primary",
        }
      : null,
    counts.conflict != null && counts.conflict > 0
      ? {
          icon: <AlertTriangle className="size-3" />,
          label: `${counts.conflict} conflict${counts.conflict !== 1 ? "s" : ""}`,
          className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        }
      : null,
    counts.failed != null && counts.failed > 0
      ? {
          icon: <XCircle className="size-3" />,
          label: `${counts.failed} invalid`,
          className: "bg-destructive/15 text-destructive",
        }
      : null,
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    className: string;
  }[];

  const hasMore =
    preview != null && preview.items.length + page * limit < totalItems;

  return (
    <div className="ml-10 max-w-[90%] overflow-hidden rounded-xl border bg-card shadow-md">
      {/* Warning header */}
      <div className="flex items-center gap-2 border-b border-l-4 border-l-amber-500 bg-amber-500/5 px-4 py-3">
        <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="flex-1 text-sm font-semibold text-foreground">{prompt}</p>
        <Badge variant="secondary" className="shrink-0 text-[11px]">
          {isLoading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <>
              <Package className="mr-1 size-3" />
              {kindLabel}
            </>
          )}
        </Badge>
      </div>

      {/* Summary pills */}
      {(isLoading || summaryPills.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-2.5">
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </>
          ) : (
            summaryPills.map((pill, i) => (
              <span
                key={i}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                  pill.className,
                )}
              >
                {pill.icon}
                {pill.label}
              </span>
            ))
          )}
        </div>
      )}

      {/* Preview table */}
      <div className="max-h-72 overflow-auto">
        {isError ? (
          <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-muted-foreground">
            <span>Failed to load preview.</span>
            <button
              className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
              onClick={() => refetch()}
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          </div>
        ) : (
          <table className="min-w-160 w-full text-sm">
            <thead className="sticky top-0 z-10 border-b bg-card">
              <tr>
                {["#", "Action", "SKU / Title", "Status", "Diff", "Error"].map(
                  (h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-3 py-2">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : preview?.items.map((item) => {
                    const skuTitle = String(
                      item.payload?.sku ?? item.payload?.title ?? "—",
                    );
                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <td className="px-3 py-2 text-xs tabular-nums text-muted-foreground">
                          {item.row_number}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-xs">
                          {titleCase(item.action)}
                        </td>
                        <td className="max-w-45 px-3 py-2">
                          <span
                            className="block truncate text-xs font-medium"
                            title={skuTitle}
                          >
                            {skuTitle}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                              STATUS_STYLES[item.status] ??
                                "bg-muted text-muted-foreground",
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <DiffCell diff={item.diff} />
                        </td>
                        <td className="max-w-40 px-3 py-2">
                          {item.error ? (
                            <span
                              className="block truncate text-[11px] text-destructive"
                              title={item.error}
                            >
                              {item.error}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        )}
      </div>

      {/* Load more */}
      {hasMore && !isLoading && (
        <div className="border-t px-4 py-2 text-center">
          <button
            className="text-xs text-primary underline-offset-2 hover:underline"
            onClick={() => setPage((p) => p + 1)}
          >
            Load more ({totalItems - (page + 1) * limit} remaining)
          </button>
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
        {isLocked ? (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Check className="size-4 text-green-600" />
            Submitted:{" "}
            <span className="font-medium text-foreground capitalize">
              {chosen[0] === "approve" ? "Approved" : "Rejected"}
            </span>
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone after approval.
            </p>
            <div className="flex items-center gap-2">
              {rejectOption && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onSubmit([rejectOption.id])}
                  disabled={isLocked}
                >
                  <X className="mr-1.5 size-3.5" />
                  Reject
                </Button>
              )}
              {approveOption && (
                <Button
                  size="sm"
                  onClick={() => onSubmit([approveOption.id])}
                  disabled={isLocked || isLoading}
                >
                  <Check className="mr-1.5 size-3.5" />
                  Approve & Apply
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
