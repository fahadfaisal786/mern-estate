// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuy-3TPN3y4npSMQnRLkcB4gH8cBjrNAo",
  authDomain: "mern-estate-81977.firebaseapp.com",
  projectId: "mern-estate-81977",
  storageBucket: "mern-estate-81977.appspot.com",
  messagingSenderId: "123657944523",
  appId: "1:123657944523:web:06a6d3b8b26c103f060a4e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth, app };
