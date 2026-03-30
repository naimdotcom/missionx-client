import type { CustomerResponse } from "@/api/services/crm/crm.types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

const defaultSkeleton = <Skeleton className="h-10 w-30" />;

const customerSkeleton = (
  <div className="flex items-center gap-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <Skeleton className="h-4 w-20" />
  </div>
);

const getMetadataRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
};

const getString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const customerColumn: ColumnDef<CustomerResponse> = {
  id: "customer",
  header: "Customer",
  enableHiding: false,
  enableResizing: true,
  size: 200,
  meta: { skeleton: customerSkeleton },
  cell: ({ row }) => {
    const customer = row.original;
    const customMetadata = getMetadataRecord(customer.custom_metadata);

    const firstName =
      customer.first_name || getString(customMetadata.first_name);
    const lastName = customer.last_name || getString(customMetadata.last_name);
    const fullName =
      `${firstName} ${lastName}`.trim() || customer.username || "Unknown";

    const profilePic =
      customer.profile_pic_url || getString(customMetadata.profile_pic_url);

    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profilePic} alt={fullName} />
          <AvatarFallback className="text-[10px]">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="line-clamp-1 font-medium text-foreground">
            {fullName}
          </span>
          {customer.username && customer.username !== fullName && (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              @{customer.username}
            </span>
          )}
        </div>
      </div>
    );
  },
};

type DynamicColumnConfig = {
  id:
    | "email"
    | "phone"
    | "platform"
    | "tags"
    | "is_active"
    | "source"
    | "created_at";
  header: string;
  render: (customer: CustomerResponse) => ReactNode;
};

const dynamicColumnConfigs: DynamicColumnConfig[] = [
  { id: "email", header: "Email", render: (customer) => customer.email || "—" },
  { id: "phone", header: "Phone", render: (customer) => customer.phone || "—" },
  {
    id: "platform",
    header: "Platform",
    render: (customer) => {
      if (!customer.platform) {
        return "—";
      }

      return (
        <Badge variant="secondary" className="capitalize">
          {customer.platform}
        </Badge>
      );
    },
  },
  {
    id: "tags",
    header: "Tags",
    render: (customer) => {
      if (!customer.tags || customer.tags.length === 0) {
        return "—";
      }

      return (
        <div className="flex flex-wrap gap-1">
          {customer.tags.map((tag) => (
            <StatusBadge key={tag} variant="outline" className="text-xs">
              {tag}
            </StatusBadge>
          ))}
        </div>
      );
    },
  },
  {
    id: "source",
    header: "Source",
    render: (customer) =>
      customer.source ? (
        <span className="capitalize">{customer.source}</span>
      ) : (
        "—"
      ),
  },
  {
    id: "created_at",
    header: "Created",
    render: (customer) =>
      customer.created_at
        ? new Date(customer.created_at).toLocaleDateString()
        : "—",
  },
];

const createDynamicColumn = ({
  id,
  header,
  render,
}: DynamicColumnConfig): ColumnDef<CustomerResponse> => ({
  id,
  header,
  accessorKey: id,
  enableResizing: true,
  cell: ({ row }) => render(row.original),
  meta: { skeleton: defaultSkeleton },
});

export const crmColumns: ColumnDef<CustomerResponse>[] = [
  customerColumn,
  ...dynamicColumnConfigs.map(createDynamicColumn),
];
