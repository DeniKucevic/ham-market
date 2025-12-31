"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const t = useTranslations("pwa");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Initialize browser detection in state
  const [isIOSSafari] = useState(() => {
    if (typeof window === "undefined") return false;
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isSafari =
      /Safari/.test(navigator.userAgent) &&
      !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    return isIOS && isSafari;
  });

  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true
    );
  });

  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === "undefined") return false;

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        return false;
      }
    }

    // Check for iOS Safari and show prompt if conditions are met
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isSafari =
      /Safari/.test(navigator.userAgent) &&
      !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    if (isIOS && isSafari && !standalone && !dismissed) {
      return true;
    }

    return false;
  });

  useEffect(() => {
    // For other browsers, wait for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
      localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md md:left-auto">
      <div className="rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("installTitle")}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t("installDescription")}
            </p>

            {isIOSSafari ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2 text-xs text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                  <span className="font-semibold">1.</span>
                  <span>{t("tapShareButton")}</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2 text-xs text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                  <span className="font-semibold">2.</span>
                  <span>{t("selectAddToHomeScreen")}</span>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                {t("install")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
