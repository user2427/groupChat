// Your Firebase config (replace with your details)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
