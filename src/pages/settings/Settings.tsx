import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  AppWindow,
  Bell,
  Image,
  Palette,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { AppearanceForm } from "./AppearanceForm";
import { AppsSettings } from "./AppsSettings";
import { MediaSettings } from "./MediaSettings";
import { ProfileForm } from "./ProfileForm";

export default function Settings({ initialTab }: { initialTab?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialTab ?? "profile");

  return (
    <div className="flex flex-col w-screen -m-[24px] md:-m-[40px] md:w-auto md:m-0">
      <div className="flex flex-col space-y-6 p-6 md:p-10 flex-1">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings, UI preferences, and CX solution
            configurations.
          </p>
        </div>
        <Separator className="my-6" />

        <Tabs
          value={value}
          onValueChange={(v) => {
            setValue(v);
            // Update URL when tab changes
            navigate({ href: `/settings/${v}` });
          }}
          className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0 w-full"
        >
          <aside className="md:w-48 lg:w-1/5 shrink-0 -mx-6 md:mx-0 px-6 md:px-0">
          <TabsList className="bg-transparent flex flex-row md:flex-col items-start justify-start h-auto w-full space-x-4 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -m-6 md:m-0 p-6 md:p-0">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <User size={18} />
              <span className="inline">Profile</span>
            </TabsTrigger>

            <TabsTrigger
              value="appearance"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <Palette size={18} />
              <span className="inline">Appearance</span>
            </TabsTrigger>

            <TabsTrigger
              value="media"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <Image size={18} />
              <span className="inline">Media</span>
            </TabsTrigger>

            <TabsTrigger
              value="apps"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <AppWindow size={18} />
              <span className="inline">Apps</span>
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <Bell size={18} />
              <span className="inline">Notifications</span>
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <Shield size={18} />
              <span className="inline">Security</span>
            </TabsTrigger>

            <TabsTrigger
              value="advanced"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2 shrink-0 whitespace-nowrap"
            >
              <SettingsIcon size={18} />
              <span className="inline">Advanced</span>
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="flex-1 w-full min-w-0">
          <TabsContent value="profile" className="m-0 space-y-6">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="appearance" className="m-0 space-y-6">
            <AppearanceForm />
          </TabsContent>

          <TabsContent value="media" className="m-0 space-y-6">
            <MediaSettings />
          </TabsContent>

          <TabsContent value="apps" className="m-0 space-y-6">
            <AppsSettings />
          </TabsContent>

          <TabsContent value="notifications" className="m-0 space-y-6">
            <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
              Notification settings are coming soon.
            </div>
          </TabsContent>

          <TabsContent value="security" className="m-0 space-y-6">
            <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
              Security and password settings are coming soon.
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="m-0 space-y-6">
            <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
              Advanced system settings are coming soon.
            </div>
          </TabsContent>
        </div>
        </Tabs>
      </div>
    </div>
  );
}
