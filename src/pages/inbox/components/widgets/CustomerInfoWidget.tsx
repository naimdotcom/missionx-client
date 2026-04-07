import { useCustomers } from "@/api";
import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/auth-store";
import { useMemo } from "react";
import { DEFAULT_FIELD_ICON, FIELD_ICONS } from "./field-icons.tsx";

interface CustomerInfoWidgetProps {
  selectedTicket?: ConversationTicket;
}

export function CustomerInfoWidget({
  selectedTicket,
}: CustomerInfoWidgetProps) {
  const { selectedApp } = useAuthStore();
  const initials = selectedTicket?.customer_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const customerParams = useMemo(() => {
    if (selectedApp?.id && selectedTicket?.customer_platform_id) {
      return {
        page: 1,
        limit: 1,
        app_id: selectedApp.id,
        platform_id: selectedTicket.customer_platform_id,
      };
    }
    return undefined;
  }, [selectedApp, selectedTicket]);

  const customerInfo = useCustomers(customerParams);
  const customer = customerInfo.data?.customers?.[0];
  const appFields = customerInfo.data?.app_fields?.fields || [];

  const getFieldValue = (fieldKey: string) => {
    if (!customer) return "N/A";
    return customer[fieldKey] ?? "N/A";
  };

  const formatFieldValue = (value: any) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getFieldIcon = (fieldKey: string, fieldName: string) => {
    const key = fieldKey.toLowerCase();
    const name = fieldName.toLowerCase();

    return FIELD_ICONS[key] || FIELD_ICONS[name] || DEFAULT_FIELD_ICON;
  };

  return (
    <Card className="border shadow-none overflow-hidden">
      <CardContent className="p-0">
        {/* Customer Profile Header with Gradient Background */}
        <div className="relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="relative flex items-center gap-4 p-5 border-b">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 shadow-md transition-transform hover:scale-105">
              <AvatarImage
                src={
                  customer?.profile_pic_url ||
                  selectedTicket?.customer_profile_pic
                }
                alt={selectedTicket?.customer_name}
              />
              <AvatarFallback className="text-lg font-semibold bg-linear-to-br from-primary/10 to-primary/5 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground truncate">
                {selectedTicket?.customer_name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedTicket?.channel?.account_name || "Direct Message"}
              </p>
              {customer?.email && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {customer.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* App Fields - Left side field names, Right side values */}
        <ScrollArea className="h-[calc(100vh-24rem)] min-h-75">
          <div className="divide-y">
            {appFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <svg
                    className="h-6 w-6 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground">
                  No fields configured
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add custom fields to display customer information
                </p>
              </div>
            ) : (
              appFields
                .filter((field) => field.visible !== false)
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .map((field) => {
                  const fieldValue = getFieldValue(field.key || "");
                  const displayValue = formatFieldValue(fieldValue);
                  const icon = getFieldIcon(field.key || "", field.name || "");

                  return (
                    <div
                      key={field.key || field.name}
                      className="group hover:bg-muted/30 transition-colors px-5 py-3.5"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="mt-0.5 text-muted-foreground/70 shrink-0">
                          {icon}
                        </div>

                        {/* Left Side - Field Name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
                              {field.name || field.key}
                            </p>
                          </div>
                        </div>

                        {/* Right Side - Field Value */}
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-medium text-foreground truncate">
                            {displayValue}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
