export interface CreateAppPayload {
  name?: string;
  description?: string;
  short_id?: string;
  manifest?: object;
  config?: object;
}

export interface Apps {
  apps?: App[];
  total?: number;
  skip?: number;
  limit?: number;
}

export interface App {
  name?: string;
  description?: string;
  short_id?: string;
  manifest?: object;
  config?: object;
  id?: string;
  creator_id?: string;
  created_at?: string;
  updated_at?: string;
  user_role?: string;
}

export interface AppParams {
  q?: string;
  skip?: number;
  limit?: number;
}
