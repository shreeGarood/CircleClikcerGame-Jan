import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/utils/firebaseConfig";

const VAPID_KEY = "BEmSjak9G5_HNsgmCSmjkAS-AE7EUGPsJHVzUzMFlU5hs-s9_XFod85kxVn25SALrLQlffe11mmKJH2kclxMzKA "; // Get this from Firebase Console > Cloud Messaging > Web Push certificates

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("🔔 Notification permission granted.");

      // ✅ Register service worker manually
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("📜 Service Worker Registered:", registration);

      // ✅ Get FCM token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
      console.log("🔥 FCM Token:", token);
      return token;
    } else {
      console.warn("🚫 Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting notification permission:", error);
  }
};

// ✅ Listen for messages in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground Notification Received:", payload);
      resolve(payload);
    });
  });
