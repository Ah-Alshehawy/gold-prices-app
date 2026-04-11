// Add your Firebase Config here:
const firebaseConfig = {
  apiKey: "AIzaSyBOF7LpvREf2KxWSskK-mRiqpC9a1OoPTQ",
  authDomain: "gold-prices-6825b.firebaseapp.com",
  databaseURL: "https://gold-prices-6825b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gold-prices-6825b",
  storageBucket: "gold-prices-6825b.firebasestorage.app",
  messagingSenderId: "186971346130",
  appId: "1:186971346130:web:5454517ceb5fb0552d490b",
  measurementId: "G-Z1K0G3E059"
};

// Initialize Firebase
let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}
