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
    preferences?: {};
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
  preferences?: {};
}
