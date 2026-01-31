import { useListAppUsers } from "@/api/services/apps/apps.hook";
import type { App } from "@/api/services/apps/apps.type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { AppUsersTable } from "./app-users/AppUsersTable";
import { AssignRoleDialog } from "./app-users/AssignRoleDialog";

type AppDetailsSheetProps = {
  app: App | null;
};

export function AppDetailsSheet({ app }: AppDetailsSheetProps) {
  const [openSheet, setOpenSheet] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);

  const { data: appUsers, isLoading: isLoadingUsers } = useListAppUsers(
    app?.id || "",
    !!openSheet,
  );
  const appUsersData = appUsers;
  const users = appUsersData?.users || [];
  const displayApp = app;

  return (
    <>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto p-4 md:p-6">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="flex flex-col gap-1">
              <span>{displayApp?.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {displayApp?.description}
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            {/* App Information */}
            {/* <div className="space-y-3">
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
            </div> */}

            {/* Users & Roles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Users & Roles</h3>
                <Button
                  size="sm"
                  variant={"secondary"}
                  onClick={() => setAssignRoleOpen(true)}
                  disabled={isLoadingUsers}
                  className="text-xs md:text-sm"
                >
                  <UserPlus className="size-4" />
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

      <Button variant={"link"} onClick={() => setOpenSheet(true)}>
        {app?.name}
      </Button>
    </>
  );
}
