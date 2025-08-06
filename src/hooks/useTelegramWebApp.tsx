import { useState, useEffect } from "react";
import {
  initializeTelegramWebApp,
  getTelegramUser,
  isTelegramWebApp,
  getMockTelegramUser,
  TelegramUser,
  getTelegramInitData,
  getTelegramColorScheme,
} from "@src/util/telegramUtil";

interface UseTelegramWebAppReturn {
  user: TelegramUser | null;
  isReady: boolean;
  isLoading: boolean;
  isTelegram: boolean;
  colorScheme: "light" | "dark";
  initData: any;
  error: string | null;
}

/**
 * Custom hook for managing Telegram WebApp state
 */
export const useTelegramWebApp = (): UseTelegramWebAppReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const [initData, setInitData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if running in Telegram WebApp
        const telegramWebApp = isTelegramWebApp();
        setIsTelegram(telegramWebApp);

        if (telegramWebApp) {
          console.log("Running in Telegram WebApp");

          // Initialize Telegram WebApp
          const initialized = initializeTelegramWebApp();

          if (initialized) {
            // Get user data from Telegram
            const tgUser = getTelegramUser();
            const tgInitData = getTelegramInitData();
            const tgColorScheme = getTelegramColorScheme();

            setInitData(tgInitData);
            setColorScheme(tgColorScheme);

            if (tgUser) {
              setUser(tgUser);
              console.log("Telegram User Data loaded:", tgUser);
            } else {
              console.log("No Telegram user data available, using mock data");
              setUser(getMockTelegramUser());
            }
          } else {
            setError("Failed to initialize Telegram WebApp");
            setUser(getMockTelegramUser());
          }
        } else {
          console.log(
            "Not running in Telegram WebApp, using mock data for development"
          );
          setUser(getMockTelegramUser());
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error during Telegram WebApp initialization:", err);
        setError(errorMessage);
        setUser(getMockTelegramUser());
      } finally {
        setIsReady(true);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return {
    user,
    isReady,
    isLoading,
    isTelegram,
    colorScheme,
    initData,
    error,
  };
};

/**
 * Hook for Telegram WebApp theme management
 */
export const useTelegramTheme = () => {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (isTelegramWebApp()) {
      const scheme = getTelegramColorScheme();
      setColorScheme(scheme);

      // Listen for theme changes (if supported)
      const handleThemeChange = () => {
        const newScheme = getTelegramColorScheme();
        setColorScheme(newScheme);
      };

      // Note: Theme change listener might not be available in all versions
      try {
        // @ts-ignore - This might not be available in all SDK versions
        window.Telegram?.WebApp?.onEvent?.("themeChanged", handleThemeChange);

        return () => {
          // @ts-ignore
          window.Telegram?.WebApp?.offEvent?.(
            "themeChanged",
            handleThemeChange
          );
        };
      } catch (error) {
        console.log("Theme change listener not available");
      }
    }
  }, []);

  return { colorScheme };
};

export default useTelegramWebApp;
