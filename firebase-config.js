// ============================================================
// MESS MANAGER - FIREBASE CONFIGURATION
// ============================================================
// Step 1: Go to https://console.firebase.google.com
// Step 2: Create a project (or use existing)
// Step 3: Go to Project Settings > General > Your apps
// Step 4: Add a Web App > Copy the config object below
// Step 5: Go to Authentication > Sign-in method > Enable:
//         - Email/Password
//         - Google
// Step 6: Go to Realtime Database > Create Database > Start in test mode
// ============================================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
