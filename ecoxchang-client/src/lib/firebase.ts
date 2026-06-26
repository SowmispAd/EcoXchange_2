// Firebase initialization with environment validation
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Required Firebase environment variables
const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

let missing = false;
const missingKeys: string[] = [];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    missingKeys.push(key);
    missing = true;
  }
}

if (missing) {
  console.warn(`Firebase config warning: Missing environment variables: ${missingKeys.join(", ")}. Firebase features will be disabled.`);
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

if (!missing) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);

  // Initialize Analytics only on client side
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(firebaseApp!);
      }
    });
  }
}

export const auth = firebaseAuth;
export default firebaseApp;