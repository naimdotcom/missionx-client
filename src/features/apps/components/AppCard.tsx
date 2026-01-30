import type { App } from "@/api/services/apps/apps.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { getRoleBadgeVariant } from "../const";

type AppCardProps = {
  app: App;
  onEdit: (app: App) => void;
  onDelete: (app: App) => void;
  onViewDetails: (app: App) => void;
};

export function AppCard({
  app,
  onEdit,
  onDelete,
  onViewDetails,
}: AppCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">
              {app.name || "Untitled App"}
            </CardTitle>
            {app.short_id && (
              <CardDescription className="text-xs mt-1">
                ID: {app.short_id}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 md:h-8 md:w-8 shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(app)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(app)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(app)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
          {app.description || "No description"}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between text-xs md:text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>Users</span>
        </div>
        {app.user_role && (
          <Badge variant={getRoleBadgeVariant(app.user_role)}>
            {app.user_role}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
