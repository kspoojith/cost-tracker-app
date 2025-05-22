// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAM-JgHzI_qPg7tTAat6250xd4LxqaxgKE",
  authDomain: "project-cost-tracker-5f96c.firebaseapp.com",
  projectId: "project-cost-tracker-5f96c",
  storageBucket: "project-cost-tracker-5f96c.appspot.com",
  messagingSenderId: "3300359395",
  appId: "1:3300359395:web:19f1aaf2f62f343e8999d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db
export const auth = getAuth(app);
export const db = getFirestore(app);  // Export Firestore DB instance
