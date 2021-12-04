import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "zumtube-42a23.firebaseapp.com",
    projectId: "zumtube-42a23",
    storageBucket: "zumtube-42a23.appspot.com",
    messagingSenderId: "647751206724",
    appId: "1:647751206724:web:4e21aedb68843dffca7911",
    measurementId: "G-HTJ3MJLCQ1"
}

export const firebaseApp = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth();
export const db = getFirestore();
