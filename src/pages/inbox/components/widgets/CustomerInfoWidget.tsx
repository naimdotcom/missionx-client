import { useInboxCustomer } from "@/api";
import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";

interface CustomerInfoWidgetProps {
  selectedTicket?: ConversationTicket;
}

export function CustomerInfoWidget({
  selectedTicket,
}: CustomerInfoWidgetProps) {
  const {selectedApp} = useAuthStore()
  const initials = selectedTicket?.customer_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  
  const customerInfo = useInboxCustomer({customer_id: selectedTicket?.customer_platform_id ?? '',app_id:selectedApp?.id ?? '',})

  console.log(customerInfo);
  

  return (
    <Card className="border shadow-none overflow-hidden">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Customer Information</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Profile
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg">
            <AvatarImage
              src={selectedTicket?.customer_profile_pic}
              alt={selectedTicket?.customer_name}
            />
            <AvatarFallback className="text-xl font-bold bg-primary/5 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground">
              {selectedTicket?.customer_name}
            </h3>
            <p className="text-xs font-medium text-muted-foreground">
              {selectedTicket?.channel?.account_name || "Direct Message"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
