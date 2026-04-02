"use client";

import * as React from "react";
import { type Table, type Row } from "@tanstack/react-table";
import { X, Columns2 } from "lucide-react";

import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Shape for each injected action button
export interface ActionBarAction<TData> {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  // Receives the currently selected rows so you can act on them
  onClick: (rows: Row<TData>[]) => void;
  // Optional: disable this action based on selection
  disabled?: (rows: Row<TData>[]) => boolean;
  // Optional: style variant
  variant?: "default" | "destructive" | "ghost";
  // Optional: show a separator BEFORE this button
  separatorBefore?: boolean;
}

interface DataTableActionBarProps<TData> {
  table: Table<TData>;
  // Inject any number of custom actions from the parent
  actions?: ActionBarAction<TData>[];
  // Optional: which column keys to display in the "selected columns" dropdown
  // Defaults to all visible columns if omitted
  columnKeys?: (keyof TData)[];
}

export function DataTableActionBar<TData>({
  table,
  actions = [],
  columnKeys,
}: DataTableActionBarProps<TData>) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) table.toggleAllRowsSelected(false);
    },
    [table]
  );

  // Determine which columns to show in the dropdown
  const visibleColumns = table
    .getVisibleLeafColumns()
    .filter((col) => col.id !== "select" && col.id !== "actions");

  const displayColumns = columnKeys
    ? visibleColumns.filter((col) => columnKeys.includes(col.id as keyof TData))
    : visibleColumns;

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      {/* Row count */}
      <span className="text-sm font-medium tabular-nums text-foreground px-1 whitespace-nowrap">
        {rows.length} row{rows.length !== 1 ? "s" : ""} selected
      </span>

      <Separator orientation="vertical" className="h-5" />

      {/* Built-in: Select Columns dropdown — shows selected rows' data per column */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
                <Columns2 className="size-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>View data by column for selected rows</TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="center" className="max-h-72 overflow-y-auto w-56">
          {displayColumns.map((col) => (
            <React.Fragment key={col.id}>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal py-1">
                {/* Use column header string if available, else fall back to id */}
                {typeof col.columnDef.header === "string"
                  ? col.columnDef.header
                  : (col.columnDef.meta as any)?.label ?? col.id}
              </DropdownMenuLabel>
              {rows.map((row) => (
                <DropdownMenuItem key={row.id} className="text-xs py-1">
                  {/* Render the cell value for this column */}
                  {String(row.getValue(col.id) ?? "—")}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Injected custom actions */}
      {actions.map((action) => (
        <React.Fragment key={action.id}>
          {action.separatorBefore && (
            <Separator orientation="vertical" className="h-5" />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={action.variant ?? "ghost"}
                size="icon"
                className="size-7"
                disabled={action.disabled?.(rows) ?? false}
                onClick={() => action.onClick(rows)}
              >
                <action.icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        </React.Fragment>
      ))}

      <Separator orientation="vertical" className="h-5" />

      {/* Dismiss */}
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
