import { useFileUpload } from "@/api/services/upload/upload.hook";
import { useUpdateUserProfile } from "@/api/services/users/users.hooks";
import { TextareaField, TextField } from "@/components/form";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import { Upload, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export function ProfileForm() {
  const updateProfileMutation = useUpdateUserProfile();
  const userProfile = useAuthStore((state) => state.userProfile);

  const form = useForm({
    defaultValues: {
      bio: userProfile?.profile?.bio || "",
      last_name: userProfile?.profile?.last_name || "",
      avatar_url: userProfile?.profile?.avatar_url || "",
      first_name: userProfile?.profile?.first_name || "",
    },
    onSubmit: (values) => {
      updateProfileMutation.mutate({
        bio: values.value.bio,
        last_name: values.value.last_name,
        first_name: values.value.first_name,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      <div className="grid grid-cols-2 gap-4">
        <form.Field
          name="first_name"
          children={(field) => (
            <TextField
              field={field}
              label="First Name"
              placeholder="John"
              description="The first name of your app"
            />
          )}
        />
        <form.Field
          name="last_name"
          children={(field) => (
            <TextField
              field={field}
              label="Last Name"
              placeholder="Doe"
              description="The last name of your app"
            />
          )}
        />
      </div>

      <form.Field
        name="bio"
        children={(field) => (
          <TextareaField
            field={field}
            label="Bio"
            placeholder="Tell us a little bit about yourself"
          />
        )}
      />

      <form.Field
        name="avatar_url"
        children={(field) => (
          <div>
            <Label htmlFor={field.name} className="text-sm font-medium">
              Avatar URL
            </Label>
            <ProfileUploader
              onValueChange={(files) =>
                field.handleChange(
                  files[0] ? URL.createObjectURL(files[0]) : "",
                )
              }
            />
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
              <p className="text-xs font-medium text-destructive mt-1">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
          </div>
        )}
      />

      <Button variant={"secondary"} type="submit">
        {updateProfileMutation.isPending && <Spinner />}
        {updateProfileMutation.isPending ? "Updating..." : "Update profile"}
      </Button>
    </form>
  );
}

type ProfileUploaderProps = {
  onValueChange?: (files: File[]) => void;
};
function ProfileUploader(props: ProfileUploaderProps) {
  const uploadMutation = useFileUpload();
  const userProfile = useAuthStore((state) => state.userProfile);
  const [files, setFiles] = React.useState<File[]>([]);

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        // Process each file individually
        const uploadPromises = files.map(async (file) => {
          try {
            await uploadMutation.mutateAsync(
              {
                payload: {
                  file,
                  app_id: userProfile?.profile?.user_id || "profile", // Use user's profile ID or "profile" as default app_id for profile uploads
                },
                options: {
                  onUploadProgress: (progressEvent: any) => {
                    const progress = progressEvent.total
                      ? Math.round(
                          (progressEvent.loaded * 100) / progressEvent.total,
                        )
                      : Math.round(
                          (progressEvent.loaded * 100) / (file.size || 1),
                        );

                    onProgress(file, Math.min(progress, 99)); // Keep at 99 until onSuccess
                  },
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
    [uploadMutation],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
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
