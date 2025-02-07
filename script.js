// Initialize Firebase
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Handle Sign-Up
document.getElementById("signup").addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Sign-up successful! You are now logged in.");
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

  auth.signInWithEmailAndPassword(email, password)
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
  auth.signOut().then(() => {
    alert("You have logged out.");
    document.getElementById("status").innerText = "Not logged in.";
  });
});

// Track Auth State Changes
auth.onAuthStateChanged((user) => {
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
    db.collection("messages").add({
      text: message,
      sender: auth.currentUser.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById("message").value = "";
  }
});

// Load Messages
function loadMessages() {
  db.collection("messages").orderBy("timestamp")
    .onSnapshot((snapshot) => {
      const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.text}</p>`;
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}
