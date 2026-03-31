import { useAllMedia, useDeleteMedia } from "@/api/services/media/media.hook";
import { Media } from "@/api/services/media/media.type";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { FileIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function MediaSettings() {
  const queryClient = useQueryClient();
  const { userProfile } = useAuthStore();
  const { data: mediaResponse, isLoading } = useAllMedia({
    context_type: "user",
    context_id: userProfile?.user.id || "",
  });
  const deleteMedia = useDeleteMedia();

  const media = mediaResponse?.items || [];

  const handleDelete = (item: Media) => {
    if (!item.id || !item.file_path) return;

    deleteMedia.mutate(
      { apiPayload: { media_id: item.id, filepath: item.file_path } },
      {
        onSuccess: () => {
          toast.success("Media deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["media"] });
        },
        onError: () => {
          toast.error("Failed to delete media");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
        <p>No media found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden group">
          <div className="relative">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              {item.media_type === "image" ? (
                <img
                  src={item.public_url}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileIcon className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </AspectRatio>
            <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDelete(item)}
                disabled={deleteMedia.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(item.file_size || 0)} • {item.media_type}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1 shrink-0"
              >
                {item.mime_type?.split("/")[1] || "file"}
              </Badge>
            </div>
            {item.metadata?.compression?.savings_percent && (
              <p className="text-[10px] text-green-600 mt-1">
                Saved {item.metadata.compression.savings_percent}% via
                compression
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
