import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCCjvVOg3vQB6By5fEflpjBxoLTPjaIeAs",
  authDomain: "mpnt-ee713.firebaseapp.com",
  databaseURL:
    "https://mpnt-ee713-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mpnt-ee713",
  storageBucket: "mpnt-ee713.appspot.com",
  messagingSenderId: "909518777607",
  appId: "1:909518777607:web:d6e5e8f6fa159daeb4a9a2",
};

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: reactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
