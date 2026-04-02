import type { Customer } from "@/api/services/crm/crm.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Activity,
  Calendar,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";

interface CustomerProfileProps {
  customer: Customer;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getPlatformColor = (platform?: string) => {
  switch (platform?.toLowerCase()) {
    case "facebook":
    case "facebook_page":
      return "bg-[#1877F2] text-white";
    case "instagram":
    case "instagram_business":
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    case "whatsapp":
      return "bg-[#25D366] text-white";
    case "twitter":
    case "x":
      return "bg-black text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function CustomerProfile({ customer }: CustomerProfileProps) {
  const customerName =
    customer.custom_metadata?.name ||
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    customer.username ||
    "Unknown";

  const profilePic =
    customer.profile_pic_url || customer.custom_metadata?.profile_pic || "";

  const joinedDate = customer.created_at
    ? format(new Date(customer.created_at), "MMM d, yyyy")
    : "Unknown";

  const lastSeen = customer.last_seen_at
    ? format(new Date(customer.last_seen_at), "MMM d, h:mm a")
    : "Never";

  return (
    <div className="border-b bg-card p-6">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="h-20 w-20 border-2 border-background shadow-lg">
            <AvatarImage src={profilePic} alt={customerName} />
            <AvatarFallback className="text-lg font-medium">
              {getInitials(customerName)}
            </AvatarFallback>
          </Avatar>
          {/* Online Status Indicator */}
          <span
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${
              customer.is_active ? "bg-green-500" : "bg-muted-foreground"
            }`}
          />
        </div>

        <h2 className="mt-3 text-lg font-semibold leading-tight">
          {customerName}
        </h2>

        {customer.username && (
          <p className="text-sm text-muted-foreground">@{customer.username}</p>
        )}

        {/* Platform Badge */}
        {customer.platform && (
          <Badge
            variant="secondary"
            className={`mt-2 ${getPlatformColor(customer.platform)}`}
          >
            {customer.platform
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Card className="border-none bg-muted/50">
          <CardContent className="flex flex-col items-center gap-1 p-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Conversations</span>
            <span className="text-sm font-semibold">
              {customer.lifetime_value || 0}
            </span>
          </CardContent>
        </Card>
        <Card className="border-none bg-muted/50">
          <CardContent className="flex flex-col items-center gap-1 p-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Status</span>
            <span
              className={`text-sm font-semibold ${
                customer.is_active ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {customer.is_active ? "Active" : "Inactive"}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Contact Info */}
      <div className="mt-4 space-y-2">
        {customer.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.locale && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="uppercase">{customer.locale}</span>
          </div>
        )}
      </div>

      {/* Meta Info */}
      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Joined {joinedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3.5 w-3.5" />
          <span>Last seen {lastSeen}</span>
        </div>
      </div>
    </div>
  );
}
