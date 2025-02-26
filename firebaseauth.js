// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyONqoiqH8y0XCXYOsiGvJ89oe6FsgeY4",
  authDomain: "login-signup-6ca6f.firebaseapp.com",
  projectId: "login-signup-6ca6f",
  storageBucket: "login-signup-6ca6f.firebasestorage.app",
  messagingSenderId: "320094835536",
  appId: "1:320094835536:web:67ba4bcb45b1d56e3d1255"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to show messages
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign-Up Function
document.getElementById('submitSignUp').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    if (!email || !password || !firstName || !lastName) {
        showMessage('All fields are required!', 'signUpMessage');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };

            showMessage('Account Created Successfully', 'signUpMessage');

            setDoc(doc(db, "users", user.uid), userData)
                .then(() => {
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'signUpMessage');
            } else {
                showMessage('Unable to Create User', 'signUpMessage');
            }
        });
});

// Sign-In Function
document.getElementById('submitSignIn').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;  // ✅ Corrected ID
    const password = document.getElementById('password').value;  // ✅ Corrected ID

    if (!email || !password) {
        showMessage('Please enter both email and password', 'signInMessage');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login Successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 2000);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/user-not-found') {
                showMessage('Account does not Exist', 'signInMessage');
            } else if (errorCode === 'auth/wrong-password') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Login Failed: ' + error.message, 'signInMessage');
            }
        });
});
