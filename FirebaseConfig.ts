// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhjpF-HCUo9oLyROOKL_aGJ_SpyFllMEw",
  authDomain: "mpnts-e074a.firebaseapp.com",
  projectId: "mpnts-e074a",
  storageBucket: "mpnts-e074a.appspot.com",
  messagingSenderId: "876030158611",
  appId: "1:876030158611:web:1570d8facbe397bb4c9ce6",
  measurementId: "G-YT11KLLPR8"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
//export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const analytics = getAnalytics(FIREBASE_APP);