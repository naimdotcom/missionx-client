import { useDeleteCustomer } from "@/api/services/crm/crm.hook";
import type { CustomerResponse } from "@/api/services/crm/crm.types";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CustomerDetailsSheet } from "./components/CustomerDetailsSheet";
import { CustomerModal } from "./components/CustomerModal";

const CustomerActionsCell = ({ customer }: { customer: CustomerResponse }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const deleteMutation = useDeleteCustomer();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this customer?")) {
      deleteMutation.mutate(customer.id as string);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Customer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomerDetailsSheet
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        customer={customer}
      />
      <CustomerModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        customer={customer}
      />
    </>
  );
};

export const crmColumns: ColumnDef<CustomerResponse>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Username" />
    ),
    cell: ({ row }) => row.original.username || "—",
  },
  {
    id: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Name" />
    ),
    cell: ({ row }) => {
      const first = row.original.first_name || "";
      const last = row.original.last_name || "";
      const name = `${first} ${last}`.trim();
      return name || "—";
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Email" />
    ),
    cell: ({ row }) => row.original.email || "—",
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Phone" />
    ),
    cell: ({ row }) => row.original.phone || "—",
  },
  {
    accessorKey: "platform",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Platform" />
    ),
    cell: ({ row }) => {
      const platform = row.original.platform;
      if (!platform) return "—";
      return (
        <Badge variant="outline" className="capitalize">
          {platform}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Platform",
      variant: "select" as const,
      options: [
        { label: "Instagram", value: "instagram" },
        { label: "Facebook", value: "facebook" },
      ],
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Tags" />
    ),
    cell: ({ row }) => {
      const tags = row.original.tags;
      if (!tags || tags.length === 0) return "—";
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "select" as const,
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Source" />
    ),
    cell: ({ row }) => {
      const source = row.original.source;
      if (!source) return "—";
      return <span className="capitalize">{source}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) => {
      const date = row.original.created_at;
      if (!date) return "—";
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CustomerActionsCell customer={row.original} />,
  },
];
