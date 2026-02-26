
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
let auth: ReturnType<typeof getAuth> | null = null;
let firebaseInitialized = false;
let firebaseError = "";

try {
    // Check if critical keys are present
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'dummy') {
        throw new Error("Firebase API Key is missing or invalid. Please check .env.local");
    }

    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    firebaseInitialized = true;
} catch (error: any) {
    console.error("Firebase Initialization Error:", error);
    firebaseError = error.message;
}

export { auth, firebaseInitialized, firebaseError };
