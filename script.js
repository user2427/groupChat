// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNljvAvyNF2wVIhK2qOXsTl-qlF1rJ-wA",
  authDomain: "groupchat-9a7fe.firebaseapp.com",
  databaseURL: "https://groupchat-9a7fe-default-rtdb.firebaseio.com",
  projectId: "groupchat-9a7fe",
  storageBucket: "groupchat-9a7fe.firebasestorage.app",
  messagingSenderId: "418527928620",
  appId: "1:418527928620:web:ad7bcf0a7a2f9fdf784c89",
  measurementId: "G-T7S6LRQ32T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle Sign-Up
document.getElementById("signup").addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Sign-up successful!");
      document.getElementById("status").innerText = "Logged in as: " + userCredential.user.email;
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Handle Login
document.getElementById("login").addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      document.getElementById("status").innerText = "Logged in as: " + userCredential.user.email;
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Handle Logout
document.getElementById("logout").addEventListener("click", function () {
  signOut(auth).then(() => {
    alert("You have logged out.");
    document.getElementById("status").innerText = "Not logged in.";
  });
});

// Track Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("status").innerText = "Logged in as: " + user.email;
    loadMessages();
  } else {
    document.getElementById("status").innerText = "Not logged in.";
    document.getElementById("chat-box").innerHTML = "";
  }
});

// Handle Sending Messages
document.getElementById("send").addEventListener("click", function () {
  const message = document.getElementById("message").value;
  if (message.trim() !== "" && auth.currentUser) {
    addDoc(collection(db, "messages"), {
      text: message,
      sender: auth.currentUser.email,
      timestamp: serverTimestamp()
    });
    document.getElementById("message").value = "";
  }
});

// Load Messages
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.text}</p>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
