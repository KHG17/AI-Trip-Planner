import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDecBtmcZK2Vx0bci53xrRnNbbhweh95nk",
  authDomain: "ai-trip-planner-dc490.firebaseapp.com",
  projectId: "ai-trip-planner-dc490",
  storageBucket: "ai-trip-planner-dc490.firebasestorage.app",
  messagingSenderId: "284075721621",
  appId: "1:284075721621:web:976b46e8ed3d46734c6c9c",
  measurementId: "G-HNFXBV9STB"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);