// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Update your existing firebase.js file to include Firestore
// Add these imports to your existing firebase.js:


import { getDatabase, ref, set, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS1Jt78RSoKZMmMSW14KHbJxWlm_ioSow",
  authDomain: "my-farm-418ca.firebaseapp.com",
  databaseURL: "https://my-farm-418ca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-farm-418ca",
  storageBucket: "my-farm-418ca.firebasestorage.app",
  messagingSenderId: "930411006394",
  appId: "1:930411006394:web:37750430ad432efb267583"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue };
