import { Skeleton } from "../ui/skeleton";

function ConversationLoading() {
  return (
    <div className="flex flex-col h-full overflow-hidden min-w-0">
      {/* Header skeleton */}
      <div className="border-b px-4 py-2 flex items-center justify-between shrink-0 h-14 bg-background">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 overflow-hidden p-6 space-y-6 bg-muted/30">
        {/* Incoming */}
        <div className="flex gap-3 max-w-full">
          <Skeleton className="h-8 w-8 rounded-full shrink-0 self-end" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-10 w-56 rounded-2xl rounded-tl-none" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        {/* Incoming longer */}
        <div className="flex gap-3 max-w-full">
          <div className="w-8 shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-10 w-80 rounded-2xl rounded-tl-none" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        {/* Outgoing */}
        <div className="flex gap-3 max-w-full flex-row-reverse">
          <Skeleton className="h-8 w-8 rounded-full shrink-0 self-end" />
          <div className="space-y-1.5 items-end flex flex-col">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-10 w-64 rounded-2xl rounded-tr-none" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        {/* Incoming */}
        <div className="flex gap-3 max-w-full">
          <Skeleton className="h-8 w-8 rounded-full shrink-0 self-end" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-16 w-72 rounded-2xl rounded-tl-none" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        {/* Outgoing short */}
        <div className="flex gap-3 max-w-full flex-row-reverse">
          <div className="w-8 shrink-0" />
          <div className="space-y-1.5 items-end flex flex-col">
            <Skeleton className="h-10 w-40 rounded-2xl rounded-tr-none" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>

        {/* Incoming */}
        <div className="flex gap-3 max-w-full">
          <Skeleton className="h-8 w-8 rounded-full shrink-0 self-end" />
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-none" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
      </div>

      {/* Replier skeleton */}
      <div className="border-t p-3 bg-background space-y-2">
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default ConversationLoading;
