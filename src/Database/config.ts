// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvAxBoQ_fs7LaLPVBYCwAzaUjuX8EQFKE",
  authDomain: "specchtotextesp32.firebaseapp.com",
  databaseURL: "https://specchtotextesp32-default-rtdb.firebaseio.com",
  projectId: "specchtotextesp32",
  storageBucket: "specchtotextesp32.appspot.com",
  messagingSenderId: "1059805444528",
  appId: "1:1059805444528:web:bddb2a8bbf2ee56dd9be75",
  measurementId: "G-29RTXQ388W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database };
