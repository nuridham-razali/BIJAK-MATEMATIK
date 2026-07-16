import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseAppletConfig from "../../firebase-applet-config.json";

// Get config from global object injected by the system, or fallback to the local config
const firebaseConfig = (window as any).__FIREBASE_CONFIG__ && Object.keys((window as any).__FIREBASE_CONFIG__).length > 0
  ? (window as any).__FIREBASE_CONFIG__
  : firebaseAppletConfig;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseAppletConfig.firestoreDatabaseId || "(default)");
