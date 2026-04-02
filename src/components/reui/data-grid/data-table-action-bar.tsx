"use client";

import * as React from "react";
import { type Table } from "@tanstack/react-table";
import { Trash2, X } from "lucide-react";

import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Replace `TData` with your actual row type (e.g. Task, User, Product)
interface DataTableActionBarProps<TData> {
  table: Table<TData>;
}

export function DataTableActionBar<TData>({
  table,
}: DataTableActionBarProps<TData>) {
  // Get all currently selected rows
  const rows = table.getFilteredSelectedRowModel().rows;

  // Close the bar and deselect all rows
  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table]
  );

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      {/* Row count badge */}
      <span className="text-sm font-medium tabular-nums text-foreground px-1">
        {rows.length} selected
      </span>

      <Separator orientation="vertical" className="h-5" />

      {/* Example action: Delete */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              // TODO: implement your delete logic here
              // e.g. deleteRows(rows.map(r => r.original.id))
              console.log("Delete rows:", rows.map((r) => r.original));
              table.toggleAllRowsSelected(false);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete selected rows</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-5" />

      {/* Dismiss / deselect all */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => table.toggleAllRowsSelected(false)}
          >
            <X className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Deselect all</TooltipContent>
      </Tooltip>
    </ActionBar>
  );
}
