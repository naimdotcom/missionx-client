import type { Customer } from "@/api/services/crm/crm.types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type DraggableColumnDef<TData> = ColumnDef<TData> & {
  enableColumnOrdering?: boolean;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-orange-100 text-orange-700",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCustomerName(customer: Customer): string {
  return (
    customer?.attributes?.customer?.customer_name ||
    [customer.first_name, customer.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    customer.username ||
    "Unknown"
  );
}

type CustomerStatus = "active" | "vip" | "lead" | "inactive";

function getCustomerStatus(customer: Customer): CustomerStatus {
  const tags = (customer.tags || []).map((t) => t.toLowerCase());
  if (tags.includes("vip")) return "vip";
  if (tags.includes("lead")) return "lead";
  if (customer.is_active === false) return "inactive";
  return "active";
}

const STATUS_CONFIG: Record<
  CustomerStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  vip: {
    label: "VIP",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  lead: {
    label: "Lead",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

function formatJoinedDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "MMM d, yyyy");
  } catch {
    return "—";
  }
}

// ─── Skeletons ───────────────────────────────────────────────────────────────

const customerSkeleton = (
  <div className="flex items-center gap-3">
    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
    <div className="space-y-1.5">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="h-3 w-36" />
    </div>
  </div>
);

const textSkeleton = <Skeleton className="h-3.5 w-20" />;

// ─── Column definitions ──────────────────────────────────────────────────────

const colHeader = (label: string) => (
  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
    {label}
  </span>
);

const selectColumn: DraggableColumnDef<Customer> = {
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
      onClick={(e) => e.stopPropagation()}
    />
  ),
  enableSorting: false,
  enableResizing: false,
  enableHiding: false,
  enableColumnOrdering: false,
  size: 48,
};

const customerColumn: DraggableColumnDef<Customer> = {
  id: "customer",
  header: () => colHeader("Customer"),
  enableSorting: false,
  enableHiding: false,
  enableColumnOrdering: false,
  enableResizing: true,
  size: 240,
  meta: { skeleton: customerSkeleton },
  cell: ({ row }) => {
    const customer = row.original;
    const name = getCustomerName(customer);
    const email = customer.email;
    const profilePic =
      customer?.attributes?.customer?.customer_profile_pic ||
      customer.profile_pic_url;
    const avatarColor = getAvatarColor(name);

    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={profilePic} alt={name} />
          <AvatarFallback className={cn("text-[10px] font-semibold", avatarColor)}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          {customer.id ? (
            <Link
              to="/crm/$customerId"
              params={{ customerId: customer.id }}
              onClick={(e) => e.stopPropagation()}
              className="line-clamp-1 text-sm font-medium text-foreground hover:text-primary hover:underline"
            >
              {name}
            </Link>
          ) : (
            <span className="line-clamp-1 text-sm font-medium">{name}</span>
          )}
          {email && (
            <span className="line-clamp-1 text-xs text-muted-foreground">
              {email}
            </span>
          )}
        </div>
      </div>
    );
  },
};

const phoneColumn: DraggableColumnDef<Customer> = {
  id: "phone",
  accessorKey: "phone",
  header: () => colHeader("Phone"),
  size: 148,
  enableSorting: false,
  meta: { skeleton: textSkeleton },
  cell: ({ row }) => (
    <span className="text-sm text-muted-foreground">
      {row.original.phone || "—"}
    </span>
  ),
};

const statusColumn: DraggableColumnDef<Customer> = {
  id: "status",
  header: () => colHeader("Status"),
  size: 110,
  enableSorting: false,
  meta: { skeleton: <Skeleton className="h-5 w-16 rounded-full" /> },
  cell: ({ row }) => {
    const status = getCustomerStatus(row.original);
    const config = STATUS_CONFIG[status];
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
          config.className,
        )}
      >
        {config.label}
      </span>
    );
  },
};

const totalOrdersColumn: DraggableColumnDef<Customer> = {
  id: "total_orders",
  header: () => colHeader("Total orders"),
  size: 120,
  enableSorting: false,
  meta: { skeleton: textSkeleton },
  cell: ({ row }) => {
    const customer = row.original;
    const value =
      (customer["total_orders"] as number | undefined) ??
      (customer.lifetime_value !== undefined ? customer.lifetime_value : undefined);
    return (
      <span className="text-sm tabular-nums text-muted-foreground">
        {value !== undefined ? String(value) : "—"}
      </span>
    );
  },
};

const joinedColumn: DraggableColumnDef<Customer> = {
  id: "joined",
  accessorKey: "created_at",
  header: () => colHeader("Joined"),
  size: 120,
  enableSorting: false,
  meta: { skeleton: textSkeleton },
  cell: ({ row }) => (
    <span className="text-sm text-muted-foreground">
      {formatJoinedDate(row.original.created_at)}
    </span>
  ),
};

const actionsColumn: DraggableColumnDef<Customer> = {
  id: "actions",
  header: () => null,
  size: 52,
  enableSorting: false,
  enableResizing: false,
  enableHiding: false,
  enableColumnOrdering: false,
  cell: ({ row }) => {
    const customer = row.original;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 opacity-0 group-hover/row:opacity-100 data-[state=open]:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {customer.id && (
            <DropdownMenuItem asChild>
              <Link
                to="/crm/$customerId"
                params={{ customerId: customer.id }}
                className="flex items-center gap-2"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const crmColumns: ColumnDef<Customer>[] = [
  selectColumn,
  customerColumn,
  phoneColumn,
  statusColumn,
  totalOrdersColumn,
  joinedColumn,
  actionsColumn,
];

// Kept for backward compatibility with any other imports
export const fixedCrmColumns: ColumnDef<Customer>[] = [
  selectColumn,
  customerColumn,
];
