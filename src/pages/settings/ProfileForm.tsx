import { useFileUpload } from "@/api/services/upload/upload.hook";
import { useUpdateUserProfile } from "@/api/services/users/users.hooks";
import { TextareaField, TextField } from "@/components/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";
import { useForm } from "@tanstack/react-form";
import { Camera, Loader } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

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
      {/* Form Fields Section */}
      <div className="grid grid-cols-3 gap-6 items-start ">
        <div className="space-y-6 col-span-2">
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

        <div>
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <FileUpload
            userID={userProfile?.user.id || "profile"}
            userName={displayName}
            onUploadSuccess={(fileUrl) =>
              form.setFieldValue("avatar_url", fileUrl)
            }
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
        {updateProfileMutation.isPending && <Spinner />}
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
  children?: ReactNode;
}

export function FileUpload({
  currentAvatarUrl,
  userName = "User",
  userID,
  onUploadSuccess,
  onUploadError,
  children,
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
    <div className="flex items-center justify-between gap-8">
      {/* Profile Picture Section */}
      <div className="relative shrink-0">
        {/* Large circular avatar */}
        <div className="relative w-40 h-40">
          <Avatar className="w-full h-full ring-2 ring-border shadow-lg">
            <AvatarImage src={preview || currentAvatarUrl} alt={userName} />
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Camera button at bottom-left */}
          <Button
            type="button"
            size={"icon"}
            variant={"secondary"}
            onClick={() => inputRef.current?.click()}
            disabled={fileUploadMutation.isPending}
            className="absolute bottom-0 left-1 rounded-full"
          >
            {fileUploadMutation.isPending ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
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

      {/* Info section (right side with form fields) */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
