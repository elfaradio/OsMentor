import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2V0Sx0xrZZ2eFPhMqVeFPBa_60vrZAQU",
  authDomain: "osmentor-e7ce9.firebaseapp.com",
  projectId: "osmentor-e7ce9",
  storageBucket: "osmentor-e7ce9.firebasestorage.app",
  messagingSenderId: "716973919233",
  appId: "1:716973919233:web:93772801bfeedd0fec8400",
  measurementId: "G-V5FJ68S441",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
