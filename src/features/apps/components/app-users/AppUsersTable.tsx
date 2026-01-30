import { useDeleteAppRole, useUpdateRole } from "@/api/services/apps/apps.hook";
import type { AppUser } from "@/api/services/apps/apps.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { APP_ROLES, getRoleBadgeVariant } from "../../const";

type AppUsersTableProps = {
  appId: string;
  users: AppUser[];
  isLoading: boolean;
};

export function AppUsersTable({ appId, users, isLoading }: AppUsersTableProps) {
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteAppRole();

  const handleRoleChange = async (email: string, newRole: string) => {
    try {
      await updateRole.mutateAsync({
        id: appId,
        payload: { email, role: newRole },
      });
      toast.success("Role updated");
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm("Remove this user?")) return;

    try {
      await deleteRole.mutateAsync({ id: appId, email });
      toast.success("User removed");
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-10 md:h-12 bg-muted animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-6 md:py-8 text-xs md:text-sm text-muted-foreground">
        No users yet. Add users to manage roles.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-xs md:text-sm">
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[40px] md:w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.user_id || user.email || index}
              className="text-xs md:text-sm"
            >
              <TableCell className="truncate">{user.email}</TableCell>
              <TableCell>
                <Select
                  value={user.role || ""}
                  onValueChange={(value) =>
                    user.email && handleRoleChange(user.email, value)
                  }
                  disabled={updateRole.isPending}
                >
                  <SelectTrigger className="w-[100px] md:w-[130px] text-xs md:text-sm">
                    <SelectValue>
                      {user.role && (
                        <Badge
                          variant={getRoleBadgeVariant(user.role)}
                          className="text-xs"
                        >
                          {user.role}
                        </Badge>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {APP_ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => user.email && handleDeleteUser(user.email)}
                  disabled={deleteRole.isPending}
                  className="h-7 w-7 md:h-8 md:w-8"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
