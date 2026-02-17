import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  apiKey: "AIzaSyBTH1wxfg13CTpklKXasqL-6vUTNyo67mA",
  authDomain: "knowmigo-mvp.firebaseapp.com",
  projectId: "knowmigo-mvp",
  storageBucket: "knowmigo-mvp.firebasestorage.app",
  messagingSenderId: "263563861662",
  appId: "1:263563861662:web:c97ce70700e3617aa9658f",
  measurementId: "G-HZ3V8SGP62",
  
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = typeof window !== "undefined" ? getAuth(app) : null;

// // Add this function to safely handle auth operations
// export const getAuthInstance = () => {
//   if (typeof window === "undefined") return null;
//   return getAuth(app);
// };
