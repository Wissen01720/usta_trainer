export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  website_url: string;
  date_of_birth: string;
  preferred_language: string;
  role: string;
}

export interface Settings {
  darkMode: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
    newsletter: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showProgress: boolean;
    shareActivity: boolean;
  };
  appearance: {
    denseMode: boolean;
    animations: boolean;
    codeTheme: "light" | "dark";
  };
}

export interface RoleColors {
  primary: string;
  secondary?: string;
  accent?: string;
}