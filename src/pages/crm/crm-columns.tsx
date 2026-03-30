import type { CustomerResponse } from "@/api/services/crm/crm.types";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "~/components/reui/data-grid/data-grid-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

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
  header: ({ column }) => (
    <DataGridColumnHeader column={column} title="Customer" />
  ),
  enableHiding: false,
  enableSorting: false,
  enableResizing: true,
  size: 220,
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
        <div className="flex min-w-0 flex-col">
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

const toHeaderLabel = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const isPlainObjectValue = (value: unknown) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toDisplayValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (key.toLowerCase().includes("at")) {
    const date = new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString();
    }
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

export const getCrmColumns = (
  rows: CustomerResponse[],
): ColumnDef<CustomerResponse>[] => {
  const keySet = new Set<string>();

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => keySet.add(key));
  });

  const dynamicColumns: ColumnDef<CustomerResponse>[] = Array.from(keySet)
    .filter((key) => {
      if (key === "customer") {
        return false;
      }

      const hasObjectValue = rows.some((row) =>
        isPlainObjectValue(row[key as keyof CustomerResponse]),
      );

      return !hasObjectValue;
    })
    .map((key) => ({
      id: key,
      accessorKey: key,
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={toHeaderLabel(key)} />
      ),
      enableResizing: true,
      cell: ({ row }) =>
        toDisplayValue(key, row.original[key as keyof CustomerResponse]),
      meta: { skeleton: defaultSkeleton },
    }));

  return [customerColumn, ...dynamicColumns];
};
