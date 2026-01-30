// Constants and utilities for Apps feature

export const APP_ROLES = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
] as const;

export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

export const getRoleBadgeVariant = (
  role: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (role?.toLowerCase()) {
    case "owner":
      return "destructive";
    case "admin":
      return "default";
    case "member":
      return "secondary";
    default:
      return "outline";
  }
};
