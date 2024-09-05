// Import necessary functions from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0G0FgE-vOLXoXIEf5QtSYnNrLiNznGdQ",
    authDomain: "login-form-930c5.firebaseapp.com",
    projectId: "login-form-930c5",
    storageBucket: "login-form-930c5.appspot.com",
    messagingSenderId: "1007013620345",
    appId: "1:1007013620345:web:f9d7514004086d45af82a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

// Providers for Google and Twitter
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Google Login
document.getElementById('google-Login-btn').addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem('loggedInUserId', user.uid);
            console.log(user);
            window.location.href = '/index.html';
        })
        .catch((error) => {
            console.error('Error during Google sign-in:', error);
        });
});

// Twitter Login
document.getElementById('twitter-Login-btn').addEventListener('click', () => {
    signInWithPopup(auth, twitterProvider)
        .then((result) => {
            const user = result.user;
            localStorage.setItem('loggedInUserId', user.uid);
            console.log(user);
            window.location.href = '/index.html';
        })
        .catch((error) => {
            console.error('Error during Twitter sign-in:', error);
        });
});

// Sign Up
document.getElementById('submitSignUp').addEventListener('click', (event) => {
    event.preventDefault();
    const fName = document.getElementById('fName').value;
    const lName = document.getElementById('lName').value;
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setDoc(doc(getFirestore(app), 'users', user.uid), {
                firstName: fName,
                lastName: lName,
                email: email
            });
            localStorage.setItem('loggedInUserId', user.uid);
            console.log('User signed up successfully:', user);
            document.getElementById('signup').style.display = 'none';
            document.getElementById('signIn').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error during sign-up:', error);
        });
});

// Sign In
document.getElementById('submitSignIn').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            console.log('User signed in successfully:', user);
            window.location.href = '/index.html';
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
});
