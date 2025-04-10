// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbni9BCJURRaVeVc13ABqeQsIODhaZZKk",
  authDomain: "simple-note-app-db50d.firebaseapp.com",
  projectId: "simple-note-app-db50d",
  storageBucket: "simple-note-app-db50d.firebasestorage.app",
  messagingSenderId: "335079002261",
  appId: "1:335079002261:web:91e24896d2efa41d678b9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export {auth, db}