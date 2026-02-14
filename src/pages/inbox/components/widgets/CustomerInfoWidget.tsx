import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, MapPin, Phone, Tag } from "lucide-react";

interface CustomerInfo {
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  joinedDate?: string;
  tags?: string[];
  totalOrders?: number;
  totalSpent?: string;
}

interface CustomerInfoWidgetProps {
  customer: CustomerInfo;
}

export function CustomerInfoWidget({ customer }: CustomerInfoWidgetProps) {
  const initials = customer.name
    .split(" ")
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
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{customer.name}</p>
            <p className="text-xs text-muted-foreground">Customer</p>
          </div>
        </div>

        <Separator />

        {/* Contact Details */}
        <div className="space-y-2.5">
          {customer.email && (
            <div className="flex items-start gap-2 text-xs">
              <Mail className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-muted-foreground break-all">
                {customer.email}
              </span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-2 text-xs">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">{customer.phone}</span>
            </div>
          )}
          {customer.location && (
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{customer.location}</span>
            </div>
          )}
          {customer.joinedDate && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                Joined {customer.joinedDate}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {customer.tags && customer.tags.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Stats */}
        {(customer.totalOrders || customer.totalSpent) && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-center">
              {customer.totalOrders !== undefined && (
                <div className="space-y-1">
                  <p className="text-lg font-semibold">
                    {customer.totalOrders}
                  </p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
              )}
              {customer.totalSpent && (
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{customer.totalSpent}</p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
