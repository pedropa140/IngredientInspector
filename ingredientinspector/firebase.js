// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIYxS45hpnuEDjNbgVtgtUDCw6zqEDyDE",
  authDomain: "ingredientinspector-72711.firebaseapp.com",
  projectId: "ingredientinspector-72711",
  storageBucket: "ingredientinspector-72711.appspot.com",
  messagingSenderId: "614823071891",
  appId: "1:614823071891:web:8a8c38d37c48030f2b7d66",
  measurementId: "G-1PGF4KN78P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }
  
  export { firestore };
