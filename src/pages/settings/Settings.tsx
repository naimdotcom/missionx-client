import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Palette,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { AppearanceForm } from "./AppearanceForm";
import { ProfileForm } from "./ProfileForm";

export default function Settings({ initialTab }: { initialTab?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialTab ?? "profile");

  return (
    <div className="flex flex-col space-y-6 p-6 pb-16 md:p-10">
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
        className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0"
      >
        <aside className="lg:w-1/5">
          <TabsList className="bg-transparent flex flex-row lg:flex-col items-start justify-start h-auto w-full space-y-0 lg:space-y-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2"
            >
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>

            <TabsTrigger
              value="appearance"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2"
            >
              <Palette size={18} />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2"
            >
              <Bell size={18} />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2"
            >
              <Shield size={18} />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>

            <TabsTrigger
              value="advanced"
              className="w-full justify-start gap-2 data-[state=active]:bg-muted hover:bg-muted/50 transition-all px-4 py-2"
            >
              <SettingsIcon size={18} />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="flex-1 lg:max-w-2xl">
          <TabsContent value="profile" className="m-0 space-y-6">
            {/* <div>
              <h3 className="text-lg font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
              </p>
            </div>
            <Separator /> */}
            <ProfileForm />
          </TabsContent>

          <TabsContent value="appearance" className="m-0 space-y-6">
            {/* <div>
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize the appearance of the app. Automatically switch
                between day and night themes.
              </p>
            </div>
            <Separator /> */}
            <AppearanceForm />
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
  );
}
