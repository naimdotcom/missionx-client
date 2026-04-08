import { useCustomers } from "@/api";
import { ConversationTicket } from "@/api/services/inbox/inbox.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

    if (FIELD_ICONS[key]) return FIELD_ICONS[key];
    if (FIELD_ICONS[name]) return FIELD_ICONS[name];

    const foundMatch = Object.keys(FIELD_ICONS).find(
      (iconKey) => key.includes(iconKey) || name.includes(iconKey),
    );

    return foundMatch ? FIELD_ICONS[foundMatch] : DEFAULT_FIELD_ICON;
  };

  return (
    <div className="h-full">
      <Card className="border shadow-sm flex flex-col h-full rounded-xl overflow-hidden bg-background">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Customer Profile Header */}
          <div className="flex items-center gap-4 p-6 border-b bg-muted/20">
            <Avatar className="h-16 w-16 ring-1 ring-border shadow-sm shrink-0">
              <AvatarImage
                src={
                  customer?.profile_pic_url ||
                  selectedTicket?.customer_profile_pic
                }
                alt={selectedTicket?.customer_name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg font-medium bg-background text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start min-w-0 gap-0.5">
              <h3 className="text-lg font-semibold text-foreground truncate w-full text-left">
                {selectedTicket?.customer_name || "Unknown Customer"}
              </h3>

              {customer?.email && (
                <p className="text-sm text-muted-foreground truncate w-full text-left">
                  {customer.email}
                </p>
              )}

              {selectedTicket?.channel?.account_name && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {selectedTicket?.channel?.account_name}
                </Badge>
              )}
            </div>
          </div>

          {/* App Fields */}
          <ScrollArea className="flex-1 bg-muted/10">
            <div className="p-5">
              <div className="flex flex-col gap-4">
                {appFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg bg-background">
                    <p className="text-sm font-medium text-muted-foreground">
                      No custom fields configured
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-y-4">
                    {appFields
                      .filter((field) => field.visible !== false)
                      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                      .map((field) => {
                        const fieldValue = getFieldValue(field.key || "");
                        const displayValue = formatFieldValue(fieldValue);
                        const icon = getFieldIcon(
                          field.key || "",
                          field.name || "",
                        );

                        return (
                          <div
                            key={field.key || field.name}
                            className="flex justify-between items-start gap-4 px-1"
                          >
                            <div className="flex items-center gap-2.5 text-muted-foreground shrink-0 w-36">
                              <div className="[&>svg]:w-4 [&>svg]:h-4 opacity-70">
                                {icon}
                              </div>
                              <span className="text-sm font-medium truncate">
                                {field.name || field.key}
                              </span>
                            </div>
                            <div className="text-sm text-foreground text-right wrap-break-word overflow-hidden font-medium">
                              {displayValue}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
