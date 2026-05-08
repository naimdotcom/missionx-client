import { useSegments } from "@/api/services/crm/crm.hook";
import type {
  JSONFilter,
  SegmentResponse,
} from "@/api/services/crm/crm.types";
import InfiniteScroll from "@/components/shared/InfinityScroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { SaveSegmentDialog } from "./SaveSegmentDialog";

const SEGMENTS_PAGE_SIZE = 20;

const SEGMENT_DOT_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

function getSegmentDotColor(index: number): string {
  return SEGMENT_DOT_COLORS[index % SEGMENT_DOT_COLORS.length];
}

const getSegmentsFromPage = (page: unknown): SegmentResponse[] => {
  if (Array.isArray(page)) return page as SegmentResponse[];
  if (!page || typeof page !== "object") return [];
  const source =
    (page as Record<string, unknown>).data ??
    (page as Record<string, unknown>).items ??
    (page as Record<string, unknown>).results ??
    (page as Record<string, unknown>).segments;
  return Array.isArray(source) ? (source as SegmentResponse[]) : [];
};

function getSegmentRuleCount(segment: SegmentResponse): number {
  const data = segment.filters || (segment as Record<string, unknown>).filter_json;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const rules = (parsed as Record<string, unknown>).rules;
        return Array.isArray(rules) ? rules.length : 0;
      }
      return 0;
    } catch {
      return 0;
    }
  }
  if (Array.isArray(data)) return data.length;
  if (data && typeof data === "object") {
    const rules = (data as Record<string, unknown>).rules;
    return Array.isArray(rules) ? rules.length : 0;
  }
  return 0;
}

interface CustomerSegmentsSidebarProps {
  selectedAppId?: string;
  activeSegmentId?: string | null;
  onSelectSegment: (segmentId: string | null) => void;
}

export function CustomerSegmentsSidebar({
  selectedAppId,
  activeSegmentId,
  onSelectSegment,
}: CustomerSegmentsSidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  const emptyRules: JSONFilter = { logic: "AND", rules: [] };

  return (
    <aside className="flex h-full w-[224px] shrink-0 flex-col border-r bg-background">
      {/* Header */}
      <div className="px-3 pb-2 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground">
          Segments
        </p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/60">
          Saved filters
        </p>
      </div>

      {/* Segment list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1">
        {segmentsQuery.isLoading && (
          <div className="space-y-1 py-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        )}

        {!segmentsQuery.isLoading && segments.length === 0 && (
          <div className="px-2 py-8 text-center">
            <p className="text-xs text-muted-foreground">No segments yet</p>
            <p className="mt-1 text-[11px] text-muted-foreground/60">
              Create one below
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
            rootMargin="200px"
          >
            {segments.map((segment, index) => {
              const isActive = segment.id === activeSegmentId;
              const dotColor = getSegmentDotColor(index);
              const ruleCount = getSegmentRuleCount(segment);

              return (
                <button
                  key={segment.id}
                  type="button"
                  onClick={() =>
                    onSelectSegment(isActive ? null : segment.id)
                  }
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-secondary",
                    isActive && "bg-secondary",
                  )}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {segment.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                    {ruleCount}
                  </span>
                </button>
              );
            })}
          </InfiniteScroll>
        )}

        {segmentsQuery.isFetchingNextPage && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="size-3 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* New segment button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus className="size-3.5" />
          New segment
        </Button>
      </div>

      <SaveSegmentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        selectedAppId={selectedAppId}
        segment={null}
        rules={emptyRules}
        onSaved={() => {
          void segmentsQuery.refetch();
        }}
      />
    </aside>
  );
}
