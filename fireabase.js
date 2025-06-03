// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyNSH3noolCZf7Wr2BI_Ipl4i00QRtYrA",
  authDomain: "stats-fd7b0.firebaseapp.com",
  projectId: "stats-fd7b0",
  storageBucket: "stats-fd7b0.firebasestorage.app",
  messagingSenderId: "761872628142",
  appId: "1:761872628142:web:fd7a99a611a76bf846703f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
