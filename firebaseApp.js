// import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyDaN1-mgeISbRwi6BQI7XfxoXvbgzwEqEQ",

  authDomain: "shopify-intern-app-12894.firebaseapp.com",

  projectId: "shopify-intern-app-12894",

  storageBucket: "shopify-intern-app-12894.appspot.com",

  messagingSenderId: "313441447498",

  appId: "1:313441447498:web:8487bd347875a3c776c0b3"

};


// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;