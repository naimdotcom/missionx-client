import { useCustomer } from "@/api";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ConversationTimeline } from "./components/ConversationTimeline";
import { CustomerDetails } from "./components/CustomerDetails";
import { CustomerProfile } from "./components/CustomerProfile";

export default function CustomerDetailPage() {
  const params = useParams({ strict: false });
  const customerId = params.customerId;
  const { selectedApp } = useAuthStore();

  const { data: customer, isLoading } = useCustomer(
    customerId!,
    selectedApp!.id,
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading customer details...
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-muted-foreground">
          Customer not found
        </p>
        <Button asChild variant="outline">
          <Link to="/crm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CRM
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b px-6 py-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/crm">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Customer Details</h1>
          <p className="text-sm text-muted-foreground">
            View customer information and conversation history
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Profile & Conversations */}
        <div className="flex w-96 flex-col border-r bg-muted/30">
          <CustomerProfile customer={customer} />
          <div className="flex-1 overflow-y-auto">
            <ConversationTimeline customer={customer} />
          </div>
        </div>

        {/* Right Panel - Details */}
        <div className="flex-1 overflow-y-auto bg-background">
          <CustomerDetails customer={customer} />
        </div>
      </div>
    </div>
  );
}
