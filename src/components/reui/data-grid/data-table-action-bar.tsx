import { type Row, type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";

import { ActionBar } from "@/components/ui/action-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  columnKeys: _columnKeys,
}: DataTableActionBarProps<TData>) {
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) table.toggleAllRowsSelected(false);
    },
    [table],
  );

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      {/* Row count */}
      <span className="text-sm font-medium tabular-nums text-foreground px-1 whitespace-nowrap">
        {rows.length} row{rows.length !== 1 ? "s" : ""} selected
      </span>

      <Separator orientation="vertical" className="h-5" />

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
