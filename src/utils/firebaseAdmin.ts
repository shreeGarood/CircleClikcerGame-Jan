import admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Correctly load serviceAccountKey.json
const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const messaging = admin.messaging();

// Function to send push notifications
export const sendNotification = async (token: string, title: string, body: string) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    await messaging.send(message);
    console.log("✅ Notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};
