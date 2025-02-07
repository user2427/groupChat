// Your Firebase config (replace with your details)
// Import and Initialize Firebase
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
const db = firebase.firestore();
const auth = firebase.auth();


// Authentication functions
function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password).catch(alert);
}

function logIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password).catch(alert);
}

function logOut() {
    auth.signOut();
}

// Send messages to Firestore
function sendMessage() {
    const message = document.getElementById("message-input").value;
    if (message.trim() !== "") {
        db.collection("messages").add({
            text: message,
            sender: auth.currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("message-input").value = "";
    }
}

// Listen for authentication changes
auth.onAuthStateChanged(user => {
    document.getElementById("chat-section").style.display = user ? "block" : "none";
});

// Load messages
db.collection("messages").orderBy("timestamp").onSnapshot(snapshot => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
        const msg = doc.data();
        messagesDiv.innerHTML += `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`;
    });
});
