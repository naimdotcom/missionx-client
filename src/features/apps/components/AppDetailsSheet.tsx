import {
  useGetAppDetails,
  useListAppUsers,
} from "@/api/services/apps/apps.hook";
import type { App, AppUsers } from "@/api/services/apps/apps.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { getRoleBadgeVariant } from "../const";
import { AppUsersTable } from "./app-users/AppUsersTable";
import { AssignRoleDialog } from "./app-users/AssignRoleDialog";

type AppDetailsSheetProps = {
  app: App | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AppDetailsSheet({
  app,
  open,
  onOpenChange,
}: AppDetailsSheetProps) {
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);

  const { data: appDetails } = useGetAppDetails(
    app?.id || "",
    !!app?.id && open,
  );
  const { data: appUsers, isLoading: isLoadingUsers } = useListAppUsers(
    app?.id || "",
    !!app?.id && open,
  );

  const appDetailsData = appDetails as App | undefined;
  const appUsersData = appUsers as AppUsers | undefined;
  const users = appUsersData?.users || [];
  const displayApp = appDetailsData || app;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto p-4 md:p-6">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-lg md:text-xl">
              {displayApp?.name || "App Details"}
            </SheetTitle>
            {displayApp?.short_id && (
              <SheetDescription className="text-xs md:text-sm">
                ID: {displayApp.short_id}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="space-y-6">
            {/* App Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Information</h3>
              <div className="space-y-2 text-xs md:text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Description</div>
                  <div>{displayApp?.description || "No description"}</div>
                </div>

                {displayApp?.user_role && (
                  <div>
                    <div className="text-muted-foreground mb-1">Your Role</div>
                    <Badge variant={getRoleBadgeVariant(displayApp.user_role)}>
                      {displayApp.user_role}
                    </Badge>
                  </div>
                )}

                {displayApp?.created_at && (
                  <div>
                    <div className="text-muted-foreground mb-1">Created</div>
                    <div>
                      {new Date(displayApp.created_at).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Users & Roles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Users & Roles</h3>
                <Button
                  size="sm"
                  onClick={() => setAssignRoleOpen(true)}
                  disabled={isLoadingUsers}
                  className="text-xs md:text-sm"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-2" />
                  Add User
                </Button>
              </div>

              <AppUsersTable
                appId={app?.id || ""}
                users={users}
                isLoading={isLoadingUsers}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AssignRoleDialog
        appId={app?.id || null}
        open={assignRoleOpen}
        onOpenChange={setAssignRoleOpen}
      />
    </>
  );
}
