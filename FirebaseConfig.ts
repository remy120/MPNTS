// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
//export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
// const analytics = getAnalytics(FIREBASE_APP);
