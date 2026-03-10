import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Package } from "lucide-react";

interface Order {
  id: string;
  date: string;
  amount: string;
  status: "delivered" | "pending" | "cancelled";
  items: number;
}

interface OrderHistoryWidgetProps {
  orders: Order[];
}

const statusConfig = {
  delivered: { label: "Delivered", variant: "default" as const },
  pending: { label: "Pending", variant: "secondary" as const },
  cancelled: { label: "Cancelled", variant: "destructive" as const },
};

export function OrderHistoryWidget({ orders }: OrderHistoryWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Package className="h-4 w-4" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No orders found
          </div>
        ) : (
          <ScrollArea className="h-60 -mx-2 px-2">
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-md border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium">#{order.id}</p>
                      <Badge
                        variant={statusConfig[order.status].variant}
                        className="text-xs h-5"
                      >
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.date}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{order.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items} {order.items === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
