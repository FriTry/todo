// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7ExwBEUEEF-qODekXJC-MqU_Xk5ApYIQ",
  authDomain: "todo-40b98.firebaseapp.com",
  projectId: "todo-40b98",
  storageBucket: "todo-40b98.appspot.com",
  messagingSenderId: "739834919750",
  appId: "1:739834919750:web:e9597c856665443f588347",
  measurementId: "G-G8CL1D7ZKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;