import { useFileUpload } from "@/api/services/upload/upload.hook";
import { useAuthStore } from "@/stores/auth-store";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadProps,
  FileUploadTrigger,
} from "../ui/file-upload";

type Props = {
  onValueChange?: (files: File[]) => void;
};
function DragUploader(props: Props) {
  const uploadMutation = useFileUpload();
  const userProfile = useAuthStore((state) => state.userProfile);
  const [files, setFiles] = useState<File[]>([]);

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        // Process each file individually
        const uploadPromises = files.map(async (file) => {
          try {
            await uploadMutation.mutateAsync(
              {
                apiPayload: {
                  file,
                  context_id: userProfile?.profile?.user_id || "profile", // Use user's profile ID or "profile" as default context_id for profile uploads
                  context_type: "app",
                },
              },
              {
                onSuccess: () => {
                  props.onValueChange?.([file]);
                },
              },
            );

            onProgress(file, 100);
            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed"),
            );
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      } catch (error) {
        // This handles any error that might occur outside the individual upload processes
        console.error("Unexpected error during upload:", error);
      }
    },
    [props, uploadMutation, userProfile?.profile?.user_id],
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      maxFiles={1}
      value={files}
      accept="image/*"
      onUpload={onUpload}
      onValueChange={setFiles}
      maxSize={5 * 1024 * 1024}
      className="w-full max-w-md"
      onFileReject={onFileReject}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 1 file, up to 5MB)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}

export default DragUploader;
