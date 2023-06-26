import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCfGnf1xudlo1DeGjW5aWRFWXUMeJuc6Yo",
  authDomain: "blog-app-1e54f.firebaseapp.com",
  projectId: "blog-app-1e54f",
  storageBucket: "blog-app-1e54f.appspot.com",
  messagingSenderId: "1064574645904",
  appId: "1:1064574645904:web:5b100f4ecc76579ac24a15",
});

// Firebase storage reference
const storage = getStorage(app);
export default storage;
