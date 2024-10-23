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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const googleSignInButton = document.getElementById('googleSignIn');
    const forgotPasswordLink = document.querySelector('.forgot-password a');

    let currentUser = null;

    function switchTab(activeTab, activeForm, inactiveTab, inactiveForm) {
        activeTab.classList.add('active');
        activeForm.classList.add('active');
        inactiveTab.classList.remove('active');
        inactiveForm.classList.remove('active');
    }

    loginTab.addEventListener('click', () => switchTab(loginTab, loginForm, signupTab, signupForm));
    signupTab.addEventListener('click', () => switchTab(signupTab, signupForm, loginTab, loginForm));

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    function checkAuthStatus() {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                currentUser = user;
                console.log('User is signed in:', user);
                fetchUserData(user);
                window.location.href = 'index.html'; // Redirect to main page
            } else {
                currentUser = null;
                console.log('No user is signed in.');
            }
        });
    }

    function fetchUserData(user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    updateDashboardData(userData);
                } else {
                    console.log("No user data found!");
                    createNewUserDocument(user);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }

    function createNewUserDocument(user) {
        const userData = {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            accountStatus: 'free',
            wishlistRecipes: [],
            favoriteRecipes: [],
            sharedRecipes: [],
            subscriptionPlan: 'free'
        };

        db.collection('users').doc(user.uid).set(userData)
            .then(() => {
                console.log("New user document created");
                updateDashboardData(userData);
            })
            .catch((error) => {
                console.error("Error creating new user document:", error);
            });
    }

    function updateDashboardData(userData) {
        // This function would be called on the main page, not on the login page
        console.log("User data updated:", userData);
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = loginForm.querySelector('#loginEmail').value;
        const password = loginForm.querySelector('#loginPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('User logged in successfully:', userCredential.user);
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                alert('Failed to log in. Please check your credentials and try again.');
            });
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = signupForm.querySelector('#signupEmail').value;
        const password = signupForm.querySelector('#signupPassword').value;
        const displayName = signupForm.querySelector('#signupName').value;
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('User signed up successfully:', userCredential.user);
                return userCredential.user.updateProfile({
                    displayName: displayName
                });
            })
            .then(() => {
                createNewUserDocument(auth.currentUser);
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error signing up:', error);
                alert('Failed to sign up. Please try again.');
            });
    });

    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then((result) => {
                    console.log('User signed in with Google:', result.user);
                    fetchUserData(result.user);
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Error signing in with Google:', error);
                    alert('Failed to sign in with Google. Please try again.');
                });
        });
    }

    // Forgot Password functionality
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt("Please enter your email address:");
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        alert("Password reset email sent. Please check your inbox.");
                    })
                    .catch((error) => {
                        console.error("Error sending password reset email:", error);
                        alert("Failed to send password reset email. Please try again.");
                    });
            }
        });
    }

    // Check login state on page load
    checkAuthStatus();
});