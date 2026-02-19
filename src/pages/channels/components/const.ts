import { UrlChannelType } from "@/api";
import { Facebook, Instagram } from "lucide-react";
import { ElementType } from "react";

export const CHANNEL_TYPE_CONFIG: Record<
  UrlChannelType,
  {
    icon: ElementType;
    label: string;
    listLabel: string;
    platformLabel: string;
    description: string;
    cardHoverBorder: string;
    cardHoverBg: string;
    iconIdleBg: string;
    iconIdleText: string;
    iconHoverBg: string;
    iconRowBg: string;
    iconRowText: string;
    headerBg: string;
    emptyIconBg: string;
    emptyIconText: string;
    buttonActiveBg: string;
    rowHover: string;
  }
> = {
  meta: {
    icon: Facebook,
    label: "Facebook Page",
    listLabel: "Facebook Pages",
    platformLabel: "Facebook",
    description: "Connect for Messenger & Comments",
    cardHoverBorder: "hover:border-blue-500/50",
    cardHoverBg: "hover:bg-blue-50/50",
    iconIdleBg: "bg-blue-100",
    iconIdleText: "text-blue-600",
    iconHoverBg: "group-hover:bg-blue-600",
    iconRowBg: "bg-blue-50",
    iconRowText: "text-blue-600",
    headerBg: "bg-[#1877F2]",
    emptyIconBg: "bg-blue-50",
    emptyIconText: "text-blue-500",
    buttonActiveBg: "bg-[#1877F2] hover:bg-[#1877F2]/90 text-white",
    rowHover: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram Business",
    listLabel: "Instagram Accounts",
    platformLabel: "Instagram",
    description: "Connect for DMs & Comments",
    cardHoverBorder: "hover:border-pink-500/50",
    cardHoverBg: "hover:bg-pink-50/50",
    iconIdleBg: "bg-pink-100",
    iconIdleText: "text-pink-600",
    iconHoverBg: "group-hover:bg-pink-600",
    iconRowBg: "bg-pink-50",
    iconRowText: "text-pink-600",
    headerBg: "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]",
    emptyIconBg: "bg-pink-50",
    emptyIconText: "text-pink-500",
    buttonActiveBg:
      "bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white border-0",
    rowHover: "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300",
  },
};
