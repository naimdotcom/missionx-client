import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { CustomerResponse } from "@/api/services/crm/crm.types";

interface CustomerDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerResponse | null;
}

export function CustomerDetailsSheet({
  open,
  onOpenChange,
  customer,
}: CustomerDetailsSheetProps) {
  if (!customer) return null;

  const fullName = `${customer.first_name || ""} ${
    customer.last_name || ""
  }`.trim();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Customer Details</SheetTitle>
          <SheetDescription>View complete customer information.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
          <div className="space-y-6 pb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {fullName || customer.username || "Unnamed"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customer.email || "No email provided"}
                </p>
              </div>
              <Badge variant={customer.is_active ? "default" : "destructive"}>
                {customer.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Phone
                  </span>
                  <p className="text-sm">{customer.phone || "—"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Username
                  </span>
                  <p className="text-sm">{customer.username || "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Platform
                  </span>
                  <p className="text-sm capitalize">{customer.platform || "—"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Source
                  </span>
                  <p className="text-sm capitalize">{customer.source || "—"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {customer.tags && customer.tags.length > 0 ? (
                    customer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Created At
                </span>
                <p className="text-sm">
                  {customer.created_at
                    ? new Date(customer.created_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
