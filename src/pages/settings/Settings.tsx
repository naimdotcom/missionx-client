import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  AppWindow,
  Image,
  Palette,
  User
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
    <div className="flex flex-col w-full">
      <div className="flex flex-col space-y-4 md:space-y-6 p-4 sm:p-6 md:p-10 flex-1">
        <div className="space-y-0.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings, UI preferences, and CX solution
            configurations.
          </p>
        </div>
        <Separator />

        <Tabs
          value={value}
          onValueChange={(v) => {
            setValue(v);
            navigate({ href: `/settings/${v}` });
          }}
          className="grid grid-cols-1 md:grid-cols-[250px_1fr] space-x-6"
        >
          <div>
            <TabsList className="bg-transparent flex flex-row md:flex-col items-start justify-start h-auto w-full gap-1 md:gap-0 md:space-y-1 overflow-x-auto md:overflow-visible border-b md:border-b-0 border-border pb-3 md:pb-0 -mx-4 sm:-mx-6 px-4 sm:px-6 md:mx-0 md:px-0">
              <TabsTrigger
                value="profile"
                className="w-full justify-start gap-2 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all px-3 py-2 shrink-0 whitespace-nowrap rounded-md text-sm"
              >
                <User size={16} />
                <span>Profile</span>
              </TabsTrigger>

              <TabsTrigger
                value="appearance"
                className="w-full justify-start gap-2 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all px-3 py-2 shrink-0 whitespace-nowrap rounded-md text-sm"
              >
                <Palette size={16} />
                <span>Appearance</span>
              </TabsTrigger>

              <TabsTrigger
                value="media"
                className="w-full justify-start gap-2 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all px-3 py-2 shrink-0 whitespace-nowrap rounded-md text-sm"
              >
                <Image size={16} />
                <span>Media</span>
              </TabsTrigger>

              <TabsTrigger
                value="apps"
                className="w-full justify-start gap-2 data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all px-3 py-2 shrink-0 whitespace-nowrap rounded-md text-sm"
              >
                <AppWindow size={16} />
                <span>Apps</span>
              </TabsTrigger>

            </TabsList>
          </div>

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
              <div className="flex items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-lg text-muted-foreground text-sm text-center">
                Notification settings are coming soon.
              </div>
            </TabsContent>

            <TabsContent value="security" className="m-0 space-y-6">
              <div className="flex items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-lg text-muted-foreground text-sm text-center">
                Security and password settings are coming soon.
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="m-0 space-y-6">
              <div className="flex items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-lg text-muted-foreground text-sm text-center">
                Advanced system settings are coming soon.
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
