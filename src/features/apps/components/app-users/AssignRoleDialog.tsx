import { useAssignAppRole } from "@/api/services/apps/apps.hook";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { APP_ROLES } from "../../const";

type AssignRoleDialogProps = {
  appId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AssignRoleDialog({
  appId,
  open,
  onOpenChange,
}: AssignRoleDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const assignRole = useAssignAppRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appId || !email.trim() || !role) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await assignRole.mutateAsync({ id: appId, payload: { email, role } });
      toast.success("Role assigned successfully");
      setEmail("");
      setRole("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to assign role");
      console.error(error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail("");
      setRole("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Add a new user to this app and assign them a role.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {APP_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={assignRole.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={assignRole.isPending}>
              {assignRole.isPending ? "Assigning..." : "Assign Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
