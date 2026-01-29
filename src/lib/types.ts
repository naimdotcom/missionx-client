export interface TokenData {
  access_token: string;
  refresh_token?: string;
  session_id?: string;
  expires_in: number;
  refresh_expires_in?: number;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  [key: string]: unknown;
}

export interface Session {
  session_id: string;
  user_id: string;
  email?: string;
  created_at: string;
  last_activity: string;
  expires_in?: number;
  user_agent?: string;
  ip_address?: string;
  is_current?: boolean;
}

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  timezone?: string;
  preferences?: Record<string, unknown>;
}

export interface AuthProvider {
  provider_name: string;
  provider_id: string;
}

export interface Customer {
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  status?: string;
  verification_status?: string;
}

export interface FullUserData {
  user: User;
  profile?: UserProfile;
  auth_providers?: AuthProvider[];
  customer?: Customer;
}
