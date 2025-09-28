

const firebaseConfig = {
  apiKey: "AIzaSyBmaIc7aA25g5WVP_DTGHOCEtnW1ZXuyNc",
  authDomain: "aawards.firebaseapp.com",
  databaseURL: "https://aawards-default-rtdb.firebaseio.com",
  projectId: "aawards",
  storageBucket: "aawards.firebasestorage.app",
  messagingSenderId: "839334918366",
  appId: "1:839334918366:web:81f2bbfc78fd85f046ea4f",
  measurementId: "G-Z9YLSTGHST"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
