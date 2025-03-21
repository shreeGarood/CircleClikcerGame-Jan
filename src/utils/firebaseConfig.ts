import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBKjVo2dg4eImew9mHKWvvGFnxLCPKGKSQ",
  authDomain: "circleclicker-v2.firebaseapp.com",
  projectId: "circleclicker-v2",
  storageBucket: "circleclicker-v2.firebasestorage.app",
  messagingSenderId: "74169825587",
  appId: "1:74169825587:web:b552d2b0db12b9d0aa2646",
  measurementId: "G-7YQCDK2JNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Ensure Firebase Messaging is only initialized on the client-side
export let messaging: any = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { app, getToken, onMessage };
