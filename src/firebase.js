import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBEXjV9WRamsBM_OSwlKP4RZVIul3JHHcU",
    authDomain: "hiringpt-eafa7.firebaseapp.com",
    projectId: "hiringpt-eafa7",
    storageBucket: "hiringpt-eafa7.appspot.com",
    messagingSenderId: "764339380598",
    appId: "1:764339380598:web:eebbab4be9d13e41689a57"
};

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
