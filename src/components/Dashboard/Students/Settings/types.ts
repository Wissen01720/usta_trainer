export type PrivacySettings = {
  publicProfile: boolean;
  showProgress: boolean;
  shareActivity: boolean;
};

export type NotificationsSettings = {
  email: boolean;
  push: boolean;
  updates: boolean;
  newsletter: boolean;
};

export type AppearanceSettings = {
  denseMode: boolean;
  animations: boolean;
  codeTheme: 'light' | 'dark';
};

export type Settings = {
  darkMode: boolean;
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
};

export type RoleColors = {
  [key: string]: {
    primary: string;
    secondary: string;
    accent: string;
  };
};