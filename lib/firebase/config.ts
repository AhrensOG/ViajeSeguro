import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const apiKey = process.env.APIKEY_FIREBASE;
const authDomain = process.env.AUTHDOMAIN_FIREBASE;
const projectId = process.env.PROJECT_ID_FIREBASE;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.MESSAGIN_SENDER_ID_FIREBASE;
const appId = process.env.APP_ID_FIREBASE;
const measurementId = process.env.MEASUREMENT_ID_FIREBASE;

const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Storage
const storage = getStorage(app);

export { app, storage };
