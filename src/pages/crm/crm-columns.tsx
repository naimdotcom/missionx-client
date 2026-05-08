import type { APPField, Customer } from "@/api/services/crm/crm.types";
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

export function getCustomerName(customer: Customer): string {
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

// ─── Shared rendering helpers ────────────────────────────────────────────────

export const colHeader = (label: string) => (
  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
    {label}
  </span>
);

export const textSkeleton = <Skeleton className="h-3.5 w-20" />;

function formatDate(value: unknown): string {
  if (!value) return "—";
  try {
    return format(new Date(String(value)), "MMM d, yyyy");
  } catch {
    return String(value);
  }
}

function renderDynamicValue(value: unknown, type?: string): React.ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  if (type === "date" || type === "datetime") {
    return (
      <span className="text-sm text-muted-foreground">{formatDate(value)}</span>
    );
  }

  if (type === "number") {
    return (
      <span className="text-sm tabular-nums text-muted-foreground">
        {String(value)}
      </span>
    );
  }

  if (type === "boolean") {
    return (
      <span className="text-sm text-muted-foreground">
        {value ? "Yes" : "No"}
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return <span className="text-sm text-muted-foreground">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {(value as unknown[]).slice(0, 3).map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
          >
            {String(v)}
          </span>
        ))}
        {value.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{value.length - 3}
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="line-clamp-1 text-sm text-muted-foreground">
      {String(value)}
    </span>
  );
}

// ─── Fixed columns ───────────────────────────────────────────────────────────

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
      onClick={(e) => e.stopPropagation()}
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
  header: () => colHeader("Customer"),
  enableSorting: false,
  enableHiding: false,
  enableColumnOrdering: false,
  enableResizing: true,
  size: 240,
  meta: {
    skeleton: (
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    ),
  },
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
          <AvatarFallback
            className={cn("text-[10px] font-semibold", avatarColor)}
          >
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

export const actionsColumn: DraggableColumnDef<Customer> = {
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

// ─── Dynamic column builder ──────────────────────────────────────────────────

// IDs that are always fixed — never generated dynamically.
const RESERVED_IDS = new Set([
  "select",
  "customer",
  "actions",
  "customer_name",
  "customer_profile",
]);

export function buildDynamicColumn(
  field: APPField["fields"][number],
): ColumnDef<Customer> {
  const key = field.key || field.name || "";

  return {
    id: key,
    accessorKey: key,
    header: () => colHeader(field.name || key.replace(/_/g, " ")),
    size: field.width || 140,
    enableSorting: false,
    enableResizing: true,
    meta: { skeleton: textSkeleton },
    cell: ({ row }) => renderDynamicValue(row.original[key], field.type),
  };
}

// ─── Exports for backward compatibility ─────────────────────────────────────

export { RESERVED_IDS };

export const fixedCrmColumns: ColumnDef<Customer>[] = [
  selectColumn,
  customerColumn,
];
