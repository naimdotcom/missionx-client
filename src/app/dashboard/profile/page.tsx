"use client";

import { useEffect, useState } from "react";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploader } from "@/components/media-uploader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => (
  <textarea
    className={cn(
      "flex min-h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-50 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

interface ProfileFormData {
  first_name: string;
  last_name: string;
  bio: string;
  gender: string;
  timezone: string;
  avatar_url: string;
}

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError } = useGetMyProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    bio: "",
    gender: "",
    timezone: "",
    avatar_url: "",
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const [lastProfileId, setLastProfileId] = useState<string | null>(null);

  if (profile && profile.id !== lastProfileId) {
    setLastProfileId(profile.id);
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      bio: profile.bio || "",
      gender: profile.gender || "",
      timezone: profile.timezone || "",
      avatar_url: profile.avatar_url || "",
    });
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value as ProfileFormData[keyof ProfileFormData],
    }));
    setSubmitStatus({ type: null, message: "" });
  };

  const handleAvatarUpload = (path: string, url: string) => {
    setFormData((prev) => ({ ...prev, avatar_url: url }));
    setSubmitStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    try {
      await updateProfile(formData).unwrap();
      setSubmitStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setSubmitStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to update profile",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        timezone: profile.timezone || "",
        avatar_url: profile.avatar_url || "",
      });
      setSubmitStatus({ type: null, message: "" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20">
        <CardContent className="flex items-center gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100">
              Failed to load profile
            </p>
            <p className="text-sm text-red-800 dark:text-red-200">
              Please try refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Profile Settings
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Manage your personal information
        </p>
      </div>

      {submitStatus.type === "success" && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            {submitStatus.message}
          </p>
        </div>
      )}

      {submitStatus.type === "error" && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm font-medium text-red-900 dark:text-red-100">
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg">Profile Picture</CardTitle>
            <CardDescription>
              Upload a photo to personalize your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <MediaUploader
                onUploadComplete={handleAvatarUpload}
                initialValue={formData.avatar_url}
                bucket="public"
              />
            </div>
          </CardContent>
        </Card>

        {/* Name Information */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg">Name</CardTitle>
            <CardDescription>Your full name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="font-medium">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jane"
                  disabled={isUpdating}
                  className="border-neutral-200 dark:border-neutral-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="font-medium">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  disabled={isUpdating}
                  className="border-neutral-200 dark:border-neutral-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Share something about yourself..."
              disabled={isUpdating}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formData.bio.length}/500 characters
            </p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="font-medium">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-50 disabled:opacity-50"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="font-medium">
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  placeholder="UTC, Asia/Dhaka"
                  disabled={isUpdating}
                  className="border-neutral-200 dark:border-neutral-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button disabled={isUpdating} className="gap-2">
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
