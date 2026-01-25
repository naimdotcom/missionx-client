// Authentication service types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  expires_in: number;
  token_type: string;
  user?: {
    id?: string;
    phone?: string;
    email?: string;
  };
  access_token: string;
  refresh_token: string;
  refresh_expires_in?: number;
  session_id?: string | number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}
