import { useFileUpload as useMediaUpload } from "@/api/services/media/media.hook";
import { useAuthStore } from "@/stores/auth-store";
import { Upload, X, FileIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useFileUpload, formatBytes } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";

type Props = {
  onValueChange?: (files: File[]) => void;
};

function DragUploader(props: Props) {
  const mediaUploadMutation = useMediaUpload();
  const userProfile = useAuthStore((state) => state.userProfile);

  const onFilesAdded = useCallback(
    async (addedFiles: any[]) => {
      try {
        const uploadPromises = addedFiles.map(async ({ file }) => {
          if (!(file instanceof File)) return;
          try {
            await mediaUploadMutation.mutateAsync(
              {
                apiPayload: {
                  file,
                  context_id: userProfile?.profile?.user_id || "profile",
                  context_type: "app",
                },
              },
              {
                onSuccess: () => {
                  props.onValueChange?.([file]);
                },
              },
            );
          } catch (error) {
            toast.error(`Upload failed for ${file.name}`);
          }
        });
        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [props, mediaUploadMutation, userProfile?.profile?.user_id],
  );

  const [state, actions] = useFileUpload({
    maxFiles: 1,
    accept: "image/*",
    maxSize: 5 * 1024 * 1024,
    onFilesAdded,
  });

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error));
      actions.clearErrors();
    }
  }, [state.errors, actions]);

  return (
    <div className="w-full max-w-md space-y-4">
      <div
        onDragEnter={actions.handleDragEnter}
        onDragOver={actions.handleDragOver}
        onDragLeave={actions.handleDragLeave}
        onDrop={actions.handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors",
          state.isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
        )}
      >
        <input {...actions.getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 1 file, up to 5MB)
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={actions.openFileDialog}
          className="w-fit"
        >
          Browse files
        </Button>
      </div>

      {state.files.length > 0 && (
        <div className="space-y-2">
          {state.files.map((fileWithPreview) => (
            <div
              key={fileWithPreview.id}
              className="flex items-center gap-3 rounded-lg border p-2"
            >
              <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                {fileWithPreview.preview ? (
                  <img
                    src={fileWithPreview.preview}
                    alt=""
                    className="size-full rounded-md object-cover"
                  />
                ) : (
                  <FileIcon className="size-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex flex-1 flex-col min-w-0">
                <p className="truncate text-sm font-medium">
                  {fileWithPreview.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(fileWithPreview.file.size)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => actions.removeFile(fileWithPreview.id)}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DragUploader;
