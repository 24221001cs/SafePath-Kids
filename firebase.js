// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpPjNgJqrAIKJ2WjSLesp9vjQHTp2OKvA",
  authDomain: "safekids-6baeb.firebaseapp.com",
  projectId: "safekids-6baeb",
  storageBucket: "safekids-6baeb.firebasestorage.app",
  messagingSenderId: "948442488351",
  appId: "1:948442488351:web:ad2203d8a14e75f5c5ff2a",
  measurementId: "G-1NPCD4Q3C7"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
