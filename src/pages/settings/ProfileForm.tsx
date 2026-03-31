import { useFileUpload } from "@/api/services/media/media.hook";
import { useUpdateUserProfile } from "@/api/services/users/users.hooks";
import { TextareaField, TextField } from "@/components/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import { Camera, Loader } from "lucide-react";
import { useRef, useState } from "react";

export function ProfileForm() {
  const updateProfileMutation = useUpdateUserProfile();
  const userProfile = useAuthStore((state) => state.userProfile);
  const userEmail = useAuthStore((state) => state.userProfile?.user?.email);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const form = useForm({
    defaultValues: {
      bio: userProfile?.profile?.bio || "",
      last_name: userProfile?.profile?.last_name || "",
      avatar_url: userProfile?.profile?.avatar_url || "",
      first_name: userProfile?.profile?.first_name || "",
    },
    onSubmit: (values) => {
      // Clear any pending save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      updateProfileMutation.mutate(
        {
          bio: values.value.bio,
          last_name: values.value.last_name,
          first_name: values.value.first_name,
          avatar_url: values.value.avatar_url,
        },
        {
          onSuccess: () => {
            // Optionally show success message
          },
        },
      );
    },
  });

  const displayName = userProfile?.profile?.first_name
    ? `${userProfile.profile.first_name} ${userProfile.profile.last_name || ""}`.trim()
    : userEmail || "User";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8"
      onChange={(e) => console.log(e.currentTarget.name)}
    >
      {/* Avatar — centered on mobile, top-right column on desktop */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <h3 className="text-sm font-medium text-muted-foreground">Profile Picture</h3>
        <FileUpload
          userID={userProfile?.user.id || "profile"}
          userName={displayName}
          onUploadSuccess={(fileUrl) => form.setFieldValue("avatar_url", fileUrl)}
          currentAvatarUrl={form.state.values.avatar_url}
        />
      </div>

      {/* Form Fields + Avatar (desktop side-by-side) */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:items-start">
        {/* Form fields — full width on mobile, 2/3 on desktop */}
        <div className="space-y-5 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <form.Field
              name="first_name"
              children={(field) => (
                <TextField
                  field={field}
                  label="First Name"
                  placeholder="John"
                  description="Your first name"
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
                  description="Your last name"
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
                description="Brief bio (max 160 characters)"
              />
            )}
          />
        </div>

        {/* Avatar column — hidden on mobile (shown above), visible on desktop */}
        <div className="hidden md:flex flex-col items-start gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">Profile Picture</h3>
          <FileUpload
            userID={userProfile?.user.id || "profile"}
            userName={displayName}
            onUploadSuccess={(fileUrl) => form.setFieldValue("avatar_url", fileUrl)}
            currentAvatarUrl={form.state.values.avatar_url}
          />
        </div>
      </div>

      <Button
        variant="default"
        type="submit"
        className="w-full sm:w-auto"
        disabled={updateProfileMutation.isPending}
      >
        {updateProfileMutation.isPending && <Spinner className="mr-2" />}
        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

interface FileUploadProps {
  currentAvatarUrl?: string;
  userName?: string;
  userID: string;
  onUploadSuccess: (fileUrl: string) => void;
  onUploadError?: (error: Error) => void;
}

export function FileUpload({
  currentAvatarUrl,
  userName = "User",
  userID,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileUploadMutation = useFileUpload();
  const [preview, setPreview] = useState<string | undefined>(currentAvatarUrl);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onUploadError?.(new Error("Please select an image file"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.(new Error("File size must be less than 5MB"));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    fileUploadMutation.mutate(
      {
        apiPayload: {
          file,
          context_id: userID,
          context_type: "user",
          sub_type: "user_info",
        },
      },
      {
        onSuccess: (response) => {
          const fileUrl = response.public_url;
          if (fileUrl) {
            onUploadSuccess(fileUrl);
          }
        },
        onError: (error: Error) => {
          onUploadError?.(error);
        },
      },
    );

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle */}
      <div className="relative">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32">
          <Avatar className="w-full h-full ring-2 ring-border shadow-md">
            <AvatarImage src={preview || currentAvatarUrl} alt={userName} />
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Camera button */}
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={fileUploadMutation.isPending}
            className="absolute bottom-0 left-0 rounded-full shadow"
          >
            {fileUploadMutation.isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>

          {/* Hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={fileUploadMutation.isPending}
            className="hidden"
          />
        </div>

        {/* Loading overlay */}
        {fileUploadMutation.isPending && (
          <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
            <Spinner className="text-white" />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Click the camera icon to upload
      </p>
    </div>
  );
}
