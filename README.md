Circle Clicker Game - Next.js + Firebase

Welcome to Circle Clicker Game, a fun and interactive browser-based game built with Next.js, Firebase, and Material UI.

In this game, players click randomly appearing circles to score points within a limited time. The app also features a real-time leaderboard, email reporting, and Firebase Cloud Messaging for push notifications.

🔥 Features

⚛️ Built with Next.js (App Router)

🔐 Firebase Authentication (Email/password optional)

🔥 Firestore DB to store scores

📧 Email Reports (Send score reports via email)

📲 Push Notifications using Firebase Cloud Messaging (FCM)

🟡 Leaderboard UI using Material UI and custom styling

🧠 SSR-enabled /about page that displays global game stats like total players

🧩 Pages

/destinations

Main Gameplay Page

Circle-clicking game UI

Leaderboard with sorted top scores

Send Email Report button

EmailDialog component (to send game stats via email)

/about

SSR rendered

About the game

Total player count (fetched from Firestore)

Other game insights and statistics

🚀 Tech Stack

Next.js (App Router)

Firebase Firestore - Realtime database for storing scores

Firebase Admin SDK - Used on the backend to send push notifications

Firebase Cloud Messaging (FCM) - For push notifications

Material UI - Components and UI

Framer Motion - Circle animation

🛠 Setup & Run Locally

1. Clone the Repo

git clone https://github.com/<your-username>/circle-clicker-game.git
cd circle-clicker-game

2. Install Dependencies

npm install

3. Add Environment Variables

Create a .env.local file at the root and paste your Firebase and email config:

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-email-app-password

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

⚠️ DO NOT push this file to GitHub! It's already ignored via .gitignore.

4. Run the Dev Server

npm run dev

Open http://localhost:3000 in your browser.

✨ Coming Soon

✅ Notification trigger on high scores

✅ Score update/delete endpoints

🔒 User authentication (optional)

📱 Mobile responsive improvements

📂 Folder Highlights

├── app/
│   ├── destinations/page.tsx       # Main Game UI
│   ├── about/page.tsx             # About Page (SSR)
├── components/EmailDialog.tsx     # Email dialog popup
├── utils/firebaseConfig.ts        # Firebase client config
├── utils/firebaseAdmin.ts         # Firebase admin SDK setup
├── public/firebase-messaging-sw.js # Firebase service worker

💻 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you want to change.
