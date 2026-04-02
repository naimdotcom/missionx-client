import type { Customer } from "@/api/services/crm/crm.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataGridColumnHeader } from "~/components/reui/data-grid/data-grid-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Checkbox } from "~/components/ui/checkbox";

type DraggableColumnDef<TData> = ColumnDef<TData> & {
  enableColumnOrdering?: boolean;
};

const customerSkeleton = (
  <div className="flex items-center gap-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <Skeleton className="h-4 w-20" />
  </div>
);

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const selectColumn: DraggableColumnDef<Customer> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected()
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all rows"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableResizing: false,
  enableHiding: false,
  enableColumnOrdering: false,
  size: 48,
};

export const customerColumn: DraggableColumnDef<Customer> = {
  id: "customer",
  header: ({ column }) => (
    <DataGridColumnHeader column={column} title="Customer" />
  ),
  enableSorting: false,
  enableHiding: false,
  enableColumnOrdering: false,
  enableResizing: true,
  size: 220,
  meta: { skeleton: customerSkeleton },
  cell: ({ row }) => {
    const customer = row.original;
    const customerName =
      customer.custom_metadata?.name || customer.username || "Unknown";
    const profilePic =
      customer.profile_pic_url || customer.custom_metadata?.profile_pic || "";

    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profilePic} alt={customerName} />
          <AvatarFallback className="text-[10px]">
            {getInitials(customerName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col">
          {customer.id ? (
            <Link
              to="/crm/$customerId"
              params={{ customerId: customer.id }}
              onClick={(event) => event.stopPropagation()}
              className="line-clamp-1 font-medium text-foreground transition-colors hover:text-primary hover:underline"
            >
              {customerName}
            </Link>
          ) : (
            <span className="line-clamp-1 font-medium text-foreground">
              {customerName}
            </span>
          )}
        </div>
      </div>
    );
  },
};

export const fixedCrmColumns: ColumnDef<Customer>[] = [
  selectColumn,
  customerColumn,
];
