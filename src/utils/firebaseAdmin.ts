import admin from "firebase-admin";

// Ensure the private key is properly formatted for multi-line use
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const messaging = admin.messaging();

// Function to send notifications
export const sendNotification = async (token: string, title: string, body: string) => {
  try {
    const message = {
      token,
      notification: { title, body },
    };
    
    await messaging.send(message);
    console.log("✅ Notification sent successfully!");
  } catch (error) {
    console.error("❌ Error sending notification:", error);
  }
};
