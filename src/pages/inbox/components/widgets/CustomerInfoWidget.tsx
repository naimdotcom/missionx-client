import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoWidgetProps {
  selectedTicket?: ConversationTicket;
}

export function CustomerInfoWidget({
  selectedTicket,
}: CustomerInfoWidgetProps) {
  const initials = selectedTicket?.customer_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={selectedTicket?.customer_profile_pic}
              alt={selectedTicket?.customer_name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {selectedTicket?.customer_name}
            </p>

            <Badge variant={"secondary"}>
              <p className="text-xs text-muted-foreground capitalize">
                {selectedTicket?.channel?.account_name}
              </p>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
