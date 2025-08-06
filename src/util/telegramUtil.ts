// Telegram Web App utilities and types

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat_type?: string;
    chat_instance?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    hint_color?: string;
    bg_color?: string;
    text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  ready(): void;
  expand(): void;
  close(): void;
}

// Global Telegram WebApp object
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Check if running in Telegram WebApp
export const isTelegramWebApp = (): boolean => {
  return typeof window !== "undefined" && window.Telegram?.WebApp !== undefined;
};

// Get Telegram WebApp instance
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp || null;
};

// Get current Telegram user
export const getTelegramUser = (): TelegramUser | null => {
  const webApp = getTelegramWebApp();
  return webApp?.initDataUnsafe?.user || null;
};

// Get mock Telegram user for testing
export const getMockTelegramUser = (): TelegramUser => {
  return {
    id: 123456789,
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    language_code: "en",
    is_premium: false,
    photo_url: undefined,
  };
};

// Get Telegram init data
export const getTelegramInitData = (): any => {
  const webApp = getTelegramWebApp();
  return webApp?.initDataUnsafe || null;
};

// Get Telegram color scheme
export const getTelegramColorScheme = (): "light" | "dark" => {
  const webApp = getTelegramWebApp();
  return webApp?.colorScheme || "light";
};

// Initialize Telegram WebApp
export const initializeTelegramWebApp = (): TelegramWebApp | null => {
  if (!isTelegramWebApp()) {
    console.warn("Not running in Telegram WebApp environment");
    return null;
  }

  const webApp = getTelegramWebApp();
  if (webApp) {
    webApp.ready();
    webApp.expand();
  }

  return webApp;
};
