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

export interface FacebookLoginResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  session_id?: string | number;
  user?: { id?: string; email?: string; phone?: string };
}

export type VerifyToken = {
  status?: string;
  payload: {
    user_id?: string;
    email?: string;
    session_id?: string | null;
    token_type?: string;
  };
};

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

export type UserInfo = {
  email?: string;
  phone?: string;
  id?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  created_at?: string;
  updated_at?: string;
};

export interface UserProfileFull {
  user: {
    email?: string;
    phone?: string;
    id: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  profile?: {
    first_name?: string;
    last_name?: string;
    gender?: string;
    avatar_url?: string;
    bio?: string;
    timezone?: string;
    preferences?: object;
    user_id?: string;
  };
  auth_providers?: [];
  customer?: {
    address?: string;
    city?: string;
    country?: string;
    postal_code?: string;
    id?: number;
    user_id?: string;
    status?: string;
    verification_status?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface UpdateUserProfilePayload {
  first_name?: string;
  last_name?: string;
  gender?: string;
  avatar_url?: string;
  bio?: string;
  timezone?: string;
  preferences?: object;
}
