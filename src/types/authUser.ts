export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  banner_url?: string;
  role: 'student' | 'teacher' | 'admin' | string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  last_login?: string; // ISO date string
  is_verified?: boolean;
  verification_token?: string;
  bio?: string;
  location?: string;
  website_url?: string;
  date_of_birth?: string; // ISO date string (YYYY-MM-DD)
  preferred_language?: string;
  status?: 'active' | 'suspended' | 'deleted' | string;
}