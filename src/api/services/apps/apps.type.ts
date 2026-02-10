import z from "zod";

export const CreateAppSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  short_id: z.string().optional(),
  manifest: z.record(z.string(), z.any()).optional(),
  config: z.record(z.string(), z.any()).optional(),
});

export type CreateAppPayload = z.infer<typeof CreateAppSchema>;

export interface Apps {
  apps?: App[];
  total?: number;
  page?: number;
  page_size?: number;
}

export interface App {
  name?: string;
  description?: string;
  short_id?: string;
  manifest?: Record<string, any>;
  config?: Record<string, any>;
  id?: string;
  creator_id?: string;
  created_at?: string;
  updated_at?: string;
  user_role?: string;
}

export interface AppParams {
  id?: string;
  page?: string;
  query?: string;
  page_size?: string;
  short_id?: string;
}

export interface MyAppParams {
  page?: number;
  page_size?: number;
}

export interface UpdateRolePayload {
  role: string;
  email: string;
}

export interface AppUser {
  user_id?: string;
  email?: string;
  role?: string;
}
export interface AppUsers {
  users?: AppUser[];
  total?: number;
  page?: number;
  page_size?: number;
}

export interface Role {
  role?: string;
  id?: string;
  app_id?: string;
  user_id?: string;
  user_email?: string;
}
