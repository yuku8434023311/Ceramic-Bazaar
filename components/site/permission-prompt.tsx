"use client";

import { useEffect } from "react";

export function PermissionPrompt() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register Service Worker for offline screen caching
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Offline Service Worker registered"))
        .catch(() => {});
    }

    // 2. Auto-prompt Location & Push Notification permissions on App Open
    const requestPermissions = async () => {
      // Auto Request Notification Permission on App Open
      if ("Notification" in window && Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (err) {
          console.warn("Notification permission error", err);
        }
      }

      // Auto Request Location Permission on App Open
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log("GPS Location granted on launch", pos.coords);
          },
          (err) => {
            console.warn("GPS Location launch prompt", err.message);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }
    };

    // Trigger permission prompts 1.5 seconds after app launch
    const timer = setTimeout(() => {
      requestPermissions();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
