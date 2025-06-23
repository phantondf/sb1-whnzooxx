export interface LoginSite {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  enabled: boolean;
  loginType: 'single' | 'multi-page';
  userSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  notes?: string;
  lastUsed?: Date;
  favicon?: string;
}

export interface AutoLoginSettings {
  enableFloatingButton: boolean;
  floatingButtonPosition: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  keyboardShortcut: string;
  autoCloseMenu: boolean;
  showNotifications: boolean;
  delayBetweenFields: number;
}

export interface LoginStatus {
  siteId: string;
  status: 'idle' | 'logging-in' | 'success' | 'error';
  message?: string;
  timestamp?: Date;
}