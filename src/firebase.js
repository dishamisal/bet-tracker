import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmNGpgIS47DMZ_-_lSIHiRDcg9_nO1R5A",
  authDomain: "bet-tracker-3d700.firebaseapp.com",
  projectId: "bet-tracker-3d700",
  storageBucket: "bet-tracker-3d700.firebasestorage.app",
  messagingSenderId: "369132631380",
  appId: "1:369132631380:web:52e874427a4d8b966304c1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
