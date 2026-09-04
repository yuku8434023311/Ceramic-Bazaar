"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function NotificationHandler() {
  useEffect(() => {
    const initNotifications = async () => {
      if (typeof window === "undefined") return;
      const win = window as any;
      const isCapacitor = !!win.Capacitor;

      if (isCapacitor) {
        // Native Android Push Notifications via Capacitor
        try {
          const { PushNotifications } = await import("@capacitor/push-notifications");
          
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === "prompt") {
            permStatus = await PushNotifications.requestPermissions();
          }

          if (permStatus.receive === "granted") {
            await PushNotifications.register();
          }

          // Register Dual Custom Voice Channels on Android
          try {
            // Channel 1: Order Updates Voice Channel ("Order update from Electro Bazaar")
            await PushNotifications.createChannel({
              id: "electro_bazaar_order_channel",
              name: "Order Updates (Voice)",
              description: "Plays 'Order update from Electro Bazaar' female voice announcement",
              sound: "electro_bazaar_order_update",
              importance: 5,
              visibility: 1,
              vibration: true,
            });

            // Channel 2: Promo & General Voice Channel ("New message from Electro Bazaar")
            await PushNotifications.createChannel({
              id: "electro_bazaar_promo_channel",
              name: "Offers & Messages (Voice)",
              description: "Plays 'New message from Electro Bazaar' female voice announcement",
              sound: "electro_bazaar_new_message",
              importance: 5,
              visibility: 1,
              vibration: true,
            });
          } catch (channelErr) {
            console.warn("Could not create custom notification channels:", channelErr);
          }

          // Helper function for foreground audio playback
          const playVoiceSound = (isOrderUpdate: boolean) => {
            try {
              const soundFile = isOrderUpdate
                ? "/audio/electro_bazaar_order_update.mp3"
                : "/audio/electro_bazaar_new_message.mp3";
              const audio = new Audio(soundFile);
              audio.play().catch((err) => console.warn("Foreground audio play error:", err));
            } catch (err) {
              console.warn("Voice audio playback error:", err);
            }
          };

          // Listeners
          await PushNotifications.addListener("registration", (token) => {
            console.log("Capacitor registration success, token:", token.value);
            fetch("/api/notifications/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: token.value, platform: "android" })
            }).catch(e => console.error("Failed to register Capacitor token in DB:", e));
          });

          await PushNotifications.addListener("registrationError", (err) => {
            console.error("Capacitor registration error:", err);
          });

          // Handle click action in app (deep linking)
          await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
            console.log("Push notification action performed:", action);
            const data = action.notification.data;
            const clickAction = data?.click_action || data?.url;
            if (clickAction) {
              window.location.href = clickAction;
            }
          });

          // Handle foreground notification in app (show toast + play female voice audio)
          await PushNotifications.addListener("pushNotificationReceived", (notification) => {
            console.log("Push notification received in foreground:", notification);
            const title = notification.title || "New Notification";
            const body = notification.body || "";
            const clickAction = notification.data?.click_action || notification.data?.url || "";
            
            const isOrder = Boolean(
              notification.data?.type === "ORDER_UPDATE" ||
              notification.data?.orderId ||
              title.toLowerCase().includes("order") ||
              body.toLowerCase().includes("order")
            );

            playVoiceSound(isOrder);

            toast(title, {
              description: body,
              action: clickAction ? {
                label: "View",
                onClick: () => {
                  window.location.href = clickAction;
                }
              } : undefined,
              duration: 6000,
            });
          });
        } catch (err) {
          console.error("Error loading Capacitor push notifications:", err);
        }
      } else {
        // Web Push Notifications via standard Web Service Worker & FCM
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
        const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        if (!apiKey || !projectId || !messagingSenderId || !appId || !vapidKey) {
          console.warn("⚠️ Firebase public config env variables are not set. Web Push Notifications are disabled.");
          return;
        }

        try {
          if (!("serviceWorker" in navigator)) {
            console.warn("Service Worker not supported in this browser.");
            return;
          }

          if (typeof window !== "undefined" && "Notification" in window) {
            let permission = Notification.permission;
            if (permission === "default") {
              permission = await Notification.requestPermission();
            }
            if (permission !== "granted") {
              console.warn("Web Notification permission not granted:", permission);
              return;
            }
          }

          const swUrl = `/firebase-messaging-sw.js?apiKey=${apiKey}&projectId=${projectId}&messagingSenderId=${messagingSenderId}&appId=${appId}`;
          const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
          console.log("FCM Service Worker registered successfully");

          const { initializeApp } = await import("firebase/app");
          const { getMessaging, getToken, onMessage } = await import("firebase/messaging");

          const firebaseApp = initializeApp({
            apiKey,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId,
            appId
          });

          const messaging = getMessaging(firebaseApp);

          const playVoiceSound = (isOrderUpdate: boolean) => {
            try {
              const soundFile = isOrderUpdate
                ? "/audio/electro_bazaar_order_update.mp3"
                : "/audio/electro_bazaar_new_message.mp3";
              const audio = new Audio(soundFile);
              audio.play().catch((err) => console.warn("Web voice audio play error:", err));
            } catch (err) {
              console.warn("Web voice audio error:", err);
            }
          };
          
          // Listen to foreground notifications on Web
          onMessage(messaging, (payload) => {
            console.log("Web foreground message received:", payload);
            const title = payload.notification?.title || "New Notification";
            const body = payload.notification?.body || "";
            const clickAction = payload.data?.click_action || payload.data?.url || "";

            const isOrder = Boolean(
              payload.data?.type === "ORDER_UPDATE" ||
              payload.data?.orderId ||
              title.toLowerCase().includes("order") ||
              body.toLowerCase().includes("order")
            );

            playVoiceSound(isOrder);

            toast(title, {
              description: body,
              action: clickAction ? {
                label: "View",
                onClick: () => {
                  window.location.href = clickAction;
                }
              } : undefined,
              duration: 6000,
            });
          });

          const token = await getToken(messaging, { serviceWorkerRegistration: reg, vapidKey });

          if (token) {
            console.log("Web FCM token obtained:", token);
            await fetch("/api/notifications/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token, platform: "web" })
            });
          }
        } catch (err) {
          console.error("Error setting up Web Push Notifications:", err);
        }
      }
    };

    initNotifications();
  }, []);

  return null;
}
