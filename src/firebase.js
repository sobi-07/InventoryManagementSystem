import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOd_3S44EcG7WuEbh5hO-8YlFxyRsUCfQ",
  authDomain: "shop-manager-f9cdb.firebaseapp.com",
  projectId: "shop-manager-f9cdb",
  storageBucket: "shop-manager-f9cdb.firebasestorage.app",
  messagingSenderId: "692205825735",
  appId: "1:692205825735:web:00c7327ec66053a51798e2",
  measurementId: "G-TNY9TPSSM8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);