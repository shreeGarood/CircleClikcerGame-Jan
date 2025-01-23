import { initializeApp } from "firebase/app";
import { getFirestore ,} from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbasS_EZCaUsbHRLztV7bS8ovf2oHG1zY",
  authDomain: "circleclickergame-jan.firebaseapp.com",
  projectId: "circleclickergame-jan",
  storageBucket: "circleclickergame-jan.firebasestorage.app",
  messagingSenderId: "43245655803",
  appId: "1:43245655803:web:fd7b0d670d4006c96a425e",
  measurementId: "G-STBQV5Z403"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

