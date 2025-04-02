
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAwe_kyo_m1APAjX3cAylr-cZkAZk7xV3s",
  authDomain: "igb-waitlist.firebaseapp.com",
  projectId: "igb-waitlist",
  storageBucket: "igb-waitlist.firebasestorage.app",
  messagingSenderId: "488430157993",
  appId: "1:488430157993:web:c939391ce741626d9de9b8",
  measurementId: "G-96TBVJ86Z9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app)