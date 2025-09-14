// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsuvtM7mTX4zsAsrDIuMwu0YLA1luPwjQ",
  authDomain: "week7-tianyang.firebaseapp.com",
  projectId: "week7-tianyang",
  storageBucket: "week7-tianyang.appspot.com",
  messagingSenderId: "559113398195",
  appId: "1:559113398195:web:795c8efb96334759830dc6"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore()
export default db