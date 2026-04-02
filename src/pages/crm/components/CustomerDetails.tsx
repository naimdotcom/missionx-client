import type { Customer } from "@/api/services/crm/crm.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Clock,
  Edit,
  FileText,
  Globe,
  Mail,
  Phone,
  Plus,
  Save,
  Settings,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

interface CustomerDetailsProps {
  customer: Customer;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(customer.notes || "");

  const customerName =
    customer.custom_metadata?.name ||
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    customer.username ||
    "Unknown";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  };

  const formatTimezone = (tz?: number) => {
    if (tz === undefined) return "N/A";
    const sign = tz >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(tz));
    const minutes = (Math.abs(tz) % 1) * 60;
    return `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ""}`;
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DetailRow
                icon={<User className="h-4 w-4" />}
                label="Full Name"
                value={customerName}
              />
              <Separator />
              {customer.first_name && (
                <>
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="First Name"
                    value={customer.first_name}
                  />
                  <Separator />
                </>
              )}
              {customer.last_name && (
                <>
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="Last Name"
                    value={customer.last_name}
                  />
                  <Separator />
                </>
              )}
              {customer.username && (
                <>
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="Username"
                    value={`@${customer.username}`}
                  />
                  <Separator />
                </>
              )}
              {customer.email && (
                <>
                  <DetailRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={customer.email}
                  />
                  <Separator />
                </>
              )}
              {customer.phone && (
                <>
                  <DetailRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={customer.phone}
                  />
                  <Separator />
                </>
              )}
              {customer.gender && (
                <>
                  <DetailRow
                    icon={<User className="h-4 w-4" />}
                    label="Gender"
                    value={
                      customer.gender.charAt(0).toUpperCase() +
                      customer.gender.slice(1)
                    }
                  />
                  <Separator />
                </>
              )}
              {customer.locale && (
                <>
                  <DetailRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Locale"
                    value={customer.locale.toUpperCase()}
                  />
                  <Separator />
                </>
              )}
              {customer.timezone !== undefined && (
                <>
                  <DetailRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Timezone"
                    value={formatTimezone(customer.timezone)}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Platform Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" />
                Platform Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {customer.platform && (
                <>
                  <DetailRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Platform"
                    value={customer.platform
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  />
                  <Separator />
                </>
              )}
              {customer.platform_id && (
                <>
                  <DetailRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Platform ID"
                    value={customer.platform_id}
                  />
                  <Separator />
                </>
              )}
              {customer.app_id && (
                <>
                  <DetailRow
                    icon={<Globe className="h-4 w-4" />}
                    label="App ID"
                    value={customer.app_id}
                  />
                  <Separator />
                </>
              )}
              {customer.source && (
                <>
                  <DetailRow
                    icon={<Globe className="h-4 w-4" />}
                    label="Source"
                    value={customer.source}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                >
                  {isEditingNotes ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this customer..."
                    className="min-h-30"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotes(customer.notes || "");
                      }}
                    >
                      <X className="mr-2 h-3.5 w-3.5" />
                      Cancel
                    </Button>
                    <Button size="sm">
                      <Save className="mr-2 h-3.5 w-3.5" />
                      Save Notes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {notes || "No notes added yet. Click edit to add notes."}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Tag
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.tags && customer.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button className="ml-1 rounded-full hover:bg-muted-foreground/20">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags assigned yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Created"
                value={formatDate(customer.created_at)}
              />
              <Separator />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Last Updated"
                value={formatDate(customer.updated_at)}
              />
              <Separator />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Last Interaction"
                value={formatDate(customer.last_interaction_at)}
              />
              <Separator />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Last Seen"
                value={formatDate(customer.last_seen_at)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attributes Tab */}
        <TabsContent value="attributes" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Custom Attributes
                </div>
                <Button variant="ghost" size="sm">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Attribute
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer.attributes &&
              Object.keys(customer.attributes).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(customer.attributes).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{key}</p>
                        <p className="text-xs text-muted-foreground">
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Settings className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No custom attributes</p>
                  <p className="text-xs text-muted-foreground">
                    Add custom attributes to store additional customer data
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Custom Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.custom_metadata &&
              Object.keys(customer.custom_metadata).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(customer.custom_metadata).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{key}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No custom metadata available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Status</p>
                  <p className="text-xs text-muted-foreground">
                    Whether this customer is currently active
                  </p>
                </div>
                <Badge variant={customer.is_active ? "default" : "secondary"}>
                  {customer.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Blocked Status</p>
                  <p className="text-xs text-muted-foreground">
                    Whether this customer has been blocked
                  </p>
                </div>
                <Badge
                  variant={customer.is_blocked ? "destructive" : "secondary"}
                >
                  {customer.is_blocked ? "Blocked" : "Not Blocked"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Assigned Agent</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.assigned_to ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                    {customer.assigned_to
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {customer.assigned_to}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Assigned Agent
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    No agent assigned
                  </p>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Assign Agent
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lifetime Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${customer.lifetime_value?.toLocaleString() || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Total customer lifetime value
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
