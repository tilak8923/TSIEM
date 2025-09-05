import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "tsiem-yq8ox",
  "appId": "1:578088327127:web:c80a85f34a083f08705d92",
  "storageBucket": "tsiem-yq8ox.appspot.com",
  "apiKey": "AIzaSyBiVUBKu6Ckf10FuqLSfJS9r4ct-WGOXts",
  "authDomain": "tsiem-yq8ox.firebaseapp.com",
  "messagingSenderId": "578088327127"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
