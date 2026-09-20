"use client";

import { useCallback, useEffect, useState } from "react";

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
};

export type HapticType =
  | "light"
  | "medium"
  | "heavy"
  | "rigid"
  | "soft"
  | "success"
  | "error"
  | "warning"
  | "selection";

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

function getWebApp() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.Telegram?.WebApp;
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    function init() {
      const webApp = getWebApp();
      if (!webApp) {
        return false;
      }

      webApp.ready();
      webApp.expand();
      setUser(webApp.initDataUnsafe?.user ?? null);
      return true;
    }

    if (init()) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (init()) {
        window.clearInterval(intervalId);
      }
    }, 50);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const hapticFeedback = useCallback((type: HapticType = "light") => {
    const haptic = getWebApp()?.HapticFeedback;
    if (!haptic) {
      return;
    }

    try {
      if (type === "success" || type === "error" || type === "warning") {
        haptic.notificationOccurred(type);
        return;
      }

      if (type === "selection") {
        haptic.selectionChanged();
        return;
      }

      haptic.impactOccurred(type);
    } catch {
      // Старые клиенты Telegram могут не поддерживать HapticFeedback.
    }
  }, []);

  return { user, hapticFeedback };
}
