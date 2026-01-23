// Workspace and organization types

export interface Workspace {
  id: string;
  name: string;
  avatarUrl?: string;
  organizationId: string;
  description?: string;
  settings: WorkspaceSettings;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSettings {
  defaultAssignmentMode: "round-robin" | "manual" | "skill-based";
  autoCloseInactiveDays?: number;
  businessHours?: {
    enabled: boolean;
    timezone: string;
    schedule: Record<string, { start: string; end: string }>;
  };
  slaTargets?: {
    firstResponseMinutes: number;
    resolutionHours: number;
  };
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "admin" | "agent" | "viewer";
  skills?: string[];
  isOnline: boolean;
  lastActiveAt?: string;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: "admin" | "agent" | "viewer";
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}
