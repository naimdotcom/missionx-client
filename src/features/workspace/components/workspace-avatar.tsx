// Workspace avatar component

import { cn } from "~/lib/utils";
import { Workspace } from "~/types/workspace";

interface WorkspaceAvatarProps {
  workspace: Workspace;
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  onClick?: () => void;
}

export const WorkspaceAvatar = ({
  workspace,
  size = "md",
  selected = false,
  onClick,
}: WorkspaceAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full flex items-center justify-center font-semibold",
        "transition-all duration-200 hover:scale-110",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        sizeClasses[size],
        selected
          ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
          : "bg-muted text-muted-foreground hover:bg-muted/80",
      )}
      title={workspace.name}
    >
      {workspace.avatarUrl ? (
        <img
          src={workspace.avatarUrl}
          alt={workspace.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        getInitials(workspace.name)
      )}
    </button>
  );
};
