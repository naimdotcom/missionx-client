"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Globe,
  Calendar,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => (
  <textarea
    className={cn(
      "flex min-h-24 w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className,
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
  language?: string;
  date_of_birth?: string;
  mobile_number?: string;
}

const LANGUAGES = [
  { code: "en", name: "English (United States)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "bn", name: "বাংলা" },
];

interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

export default function ProfilePage() {
  const {
    data: profileData,
    isLoading,
    isError,
  } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    bio: "",
    gender: "",
    timezone: "",
    avatar_url: "",
    language: "en",
    date_of_birth: "",
    mobile_number: "",
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const [lastProfileUserId, setLastProfileUserId] = useState<string | null>(
    null,
  );

  // Extract profile data from the response
  const profile = profileData?.profile;
  const user = profileData?.user;
  const authProviders = profileData?.auth_providers || [];

  // Get the auth provider name from the auth_providers array
  const getAuthProvider = () => {
    if (authProviders && authProviders.length > 0) {
      const provider = authProviders[0];
      // Capitalize the first letter of provider_name
      return (
        provider.provider_name.charAt(0).toUpperCase() +
        provider.provider_name.slice(1)
      );
    }
    return "Unknown";
  };

  if (profile && user && user.id !== lastProfileUserId) {
    setLastProfileUserId(user.id);
    const preferences = profile.preferences || {};
    setFormData({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      bio: profile.bio || "",
      gender: profile.gender || "",
      timezone: profile.timezone || "",
      avatar_url: profile.avatar_url || "",
      language: preferences.language || "en",
      date_of_birth: preferences.date_of_birth || "",
      mobile_number: preferences.mobile_number || "",
    });
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value as ProfileFormData[keyof ProfileFormData],
    }));
    setSubmitStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    try {
      // Exclude avatar_url from update payload
      const { avatar_url, ...updateData } = formData;
      await updateProfile(updateData).unwrap();

      // Show success toast with Sonner
      toast.success("Profile updated successfully!", {
        description: "Your profile has been updated.",
      });

      setSubmitStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";

      // Show error toast with Sonner
      toast.error("Profile update failed", {
        description: errorMessage,
      });

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
      const preferences = profile.preferences || {};
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        timezone: profile.timezone || "",
        avatar_url: profile.avatar_url || "",
        language: preferences.language || "en",
        date_of_birth: preferences.date_of_birth || "",
        mobile_number: preferences.mobile_number || "",
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
      <Card>
        <CardContent className="flex items-center gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-foreground shrink-0" />
          <div>
            <p className="font-semibold text-foreground">
              Failed to load profile
            </p>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Profile Settings
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Manage your public presence and personal information
        </p>
      </div>

      {submitStatus.type === "success" && (
        <div className="flex items-center gap-3 bg-muted border rounded-lg p-4">
          <CheckCircle2 className="h-5 w-5 text-foreground shrink-0" />
          <p className="text-sm font-medium text-foreground">
            {submitStatus.message}
          </p>
        </div>
      )}

      {submitStatus.type === "error" && (
        <div className="flex items-center gap-3 bg-muted border rounded-lg p-4">
          <AlertCircle className="h-5 w-5 text-foreground shrink-0" />
          <p className="text-sm font-medium text-foreground">
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card - Top Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-2">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Profile"
                    className="rounded-full w-32 h-32 object-cover border border-border"
                  />
                ) : (
                  <div className="rounded-full w-32 h-32 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                    No Image
                  </div>
                )}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center max-w-xs">
                  This photo is from your {getAuthProvider()} account
                </p>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    {formData.first_name || "User"}
                    {formData.last_name && ` ${formData.last_name}`}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-neutral-600 dark:text-neutral-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border">
                    <Globe className="h-3 w-3 text-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      Signed up with {getAuthProvider()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Your name and personal details</CardDescription>
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
                  disabled={isUpdating}
                  placeholder="John"
                  className="border-border"
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
                  disabled={isUpdating}
                  placeholder="Doe"
                  className="border-border"
                />
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
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_number" className="font-medium">
                  Mobile Number
                </Label>
                <Input
                  id="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  disabled={isUpdating}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-border",
                        !formData.date_of_birth && "text-muted-foreground",
                      )}
                      disabled={isUpdating}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date_of_birth
                        ? format(new Date(formData.date_of_birth), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={
                        formData.date_of_birth
                          ? new Date(formData.date_of_birth)
                          : undefined
                      }
                      onSelect={(date) => {
                        setFormData((prev) => ({
                          ...prev,
                          date_of_birth: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        }));
                        setSubmitStatus({ type: null, message: "" });
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="font-medium">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, gender: value }));
                    setSubmitStatus({ type: null, message: "" });
                  }}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Yourself</CardTitle>
            <CardDescription>Tell us a bit about yourself</CardDescription>
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

        {/* Localization Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Localization</CardTitle>
            <CardDescription>
              Your timezone and language settings help us deliver content and
              notifications at the right time for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="font-medium">
                  Language
                </Label>
                <Select
                  value={formData.language || "en"}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, language: value }));
                    setSubmitStatus({ type: null, message: "" });
                  }}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
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
