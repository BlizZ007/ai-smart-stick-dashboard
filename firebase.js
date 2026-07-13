// ==========================================================
// FIREBASE IMPORTS
// ==========================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================================
// FIREBASE CONFIG
// ==========================================================

const firebaseConfig = {

    apiKey: "AIzaSyCbc3T-z9vrLHeRT1FJ8ix9AZt_NxxQejs",

    authDomain: "ai-smart-stick.firebaseapp.com",

    databaseURL:
    "https://ai-smart-stick-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "ai-smart-stick",

    storageBucket:
    "ai-smart-stick.firebasestorage.app",

    messagingSenderId:
    "1087791965100",

    appId:
    "1:1087791965100:web:4062826af1a40159f85009"

};


// ==========================================================
// INITIALIZE FIREBASE
// ==========================================================

const app = initializeApp(

    firebaseConfig

);

const database = getDatabase(

    app

);


// ==========================================================
// EXPORT
// ==========================================================

export {

    database

};