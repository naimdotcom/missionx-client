import { useSegments } from "@/api/services/crm/crm.hook";
import type {
  JSONFilter,
  SegmentFilter,
  SegmentResponse,
} from "@/api/services/crm/crm.types";
import InfiniteScroll from "@/components/shared/InfinityScroll";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Layers3, Loader2, PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import { SaveSegmentDialog } from "./SaveSegmentDialog";
import { formatSegmentRulesPreview } from "../const";

const SEGMENTS_PAGE_SIZE = 12;

interface SegmentsListProps {
  selectedAppId?: string;
  activeSegmentId?: string | null;
  onSelectSegment: (segmentId: string | null) => void;
}

const getSegmentsFromPage = (page: unknown): SegmentResponse[] => {
  if (Array.isArray(page)) return page as SegmentResponse[];

  if (!page || typeof page !== "object") {
    return [];
  }

  const source =
    (page as Record<string, unknown>).data ??
    (page as Record<string, unknown>).items ??
    (page as Record<string, unknown>).results ??
    (page as Record<string, unknown>).segments;

  return Array.isArray(source) ? (source as SegmentResponse[]) : [];
};

const getSegmentRules = (segment: SegmentResponse): SegmentFilter[] => {
  const data = segment.filters || (segment as any).filter_json;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed.rules)
        ? parsed.rules
        : Array.isArray(parsed)
          ? parsed
          : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.rules) ? data.rules : [];
};

const getSegmentFilterJson = (segment: SegmentResponse): JSONFilter => {
  let data = segment.filters || (segment as any).filter_json;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      data = { logic: "AND", rules: [] };
    }
  }
  if (!Array.isArray(data)) {
    return {
      logic: data?.logic || "AND",
      rules: Array.isArray(data?.rules) ? data.rules : [],
    };
  }
  return { logic: "AND", rules: data };
};

export function SegmentsList({
  selectedAppId,
  activeSegmentId,
  onSelectSegment,
}: SegmentsListProps) {
  const [editingSegment, setEditingSegment] = useState<SegmentResponse | null>(
    null,
  );

  const segmentsQuery = useSegments({
    app_id: selectedAppId,
    limit: SEGMENTS_PAGE_SIZE,
  });

  const segments = useMemo(() => {
    const byId = new Map<string, SegmentResponse>();

    segmentsQuery.data?.pages.forEach((page) => {
      getSegmentsFromPage(page).forEach((segment) => {
        byId.set(segment.id, segment);
      });
    });

    return Array.from(byId.values());
  }, [segmentsQuery.data?.pages]);

  const editingFilterJson = useMemo(
    () =>
      editingSegment
        ? getSegmentFilterJson(editingSegment)
        : { logic: "AND" as const, rules: [] },
    [editingSegment],
  );

  return (
    <aside className="flex h-full min-h-0 flex-col border-r bg-muted/20">
      <div className="border-b bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Layers3 className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Segments</p>
            <p className="text-xs text-muted-foreground">
              Saved customer filters
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-2 p-3">
          {segmentsQuery.isLoading && (
            <div className="space-y-2">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-16 rounded-xl" />
              ))}
            </div>
          )}

          {!segmentsQuery.isLoading && segments.length === 0 && (
            <div className="rounded-xl border border-dashed bg-background px-4 py-8 text-center">
              <p className="text-sm font-medium">No segments yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Save a filter to create your first segment
              </p>
            </div>
          )}

          {segments.length > 0 && (
            <InfiniteScroll
              isLoading={segmentsQuery.isFetchingNextPage}
              hasMore={Boolean(segmentsQuery.hasNextPage)}
              next={() => {
                if (
                  segmentsQuery.hasNextPage &&
                  !segmentsQuery.isFetchingNextPage
                ) {
                  void segmentsQuery.fetchNextPage();
                }
              }}
              threshold={0.1}
              rootMargin="300px"
            >
              {segments.map((segment) => {
                const isActive = segment.id === activeSegmentId;
                const rulesCount = getSegmentRules(segment).length;

                return (
                  <button
                    key={segment.id}
                    type="button"
                    onClick={() =>
                      onSelectSegment(isActive ? null : segment.id)
                    }
                    className={cn(
                      "w-full rounded-xl border bg-card px-3 py-3 text-left transition-colors hover:bg-muted/30",
                      isActive && "border-primary/60 bg-primary/5",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium">
                            {segment.name}
                          </p>
                          <Badge variant="outline" className="text-[10px]">
                            {rulesCount > 0
                              ? formatSegmentRulesPreview(
                                  getSegmentRules(segment),
                                  getSegmentFilterJson(segment).logic as
                                    | "AND"
                                    | "OR",
                                )
                              : "0 rules"}
                          </Badge>
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {segment.description || "No description"}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSegment(segment);
                        }}
                        title="Update segment"
                      >
                        <PencilLine className="size-3.5" />
                      </Button>
                    </div>
                  </button>
                );
              })}
            </InfiniteScroll>
          )}

          {segmentsQuery.isFetchingNextPage && (
            <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
              <Loader2 className="mr-2 size-3 animate-spin" /> Loading more...
            </div>
          )}
        </div>
      </div>

      <SaveSegmentDialog
        open={Boolean(editingSegment)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setEditingSegment(null);
          }
        }}
        selectedAppId={selectedAppId}
        segment={editingSegment}
        rules={editingFilterJson}
      />
    </aside>
  );
}
