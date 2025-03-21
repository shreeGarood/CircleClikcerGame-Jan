importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyBKjVo2dg4eImew9mHKWvvGFnxLCPKGKSQ",
  authDomain: "circleclicker-v2.firebaseapp.com",
  projectId: "circleclicker-v2",
  storageBucket: "circleclicker-v2.firebasestorage.app",
  messagingSenderId: "74169825587",
  appId: "1:74169825587:web:b552d2b0db12b9d0aa2646",
  measurementId: "G-7YQCDK2JNP",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/globe.svg", // Add a valid icon in the public folder
  });
});
