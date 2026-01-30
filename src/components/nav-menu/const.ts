import {
  Activity,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Inbox,
  Store,
} from "lucide-react";

export const MAIN_NAV_ITEMS = {
  user: undefined,
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inbox",
      url: "inbox",
      icon: Inbox,
      isActive: true,
    },
    { title: "Channels", url: "channels", icon: Activity },
    { title: "Apps", url: "apps", icon: Store },
  ],
};
