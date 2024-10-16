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
    const authButtons = document.getElementById('authButtons');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const userProfile = document.getElementById('userProfile');
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const googleSignInButton = document.getElementById('googleSignIn');

    let currentUser = null;

    function checkAuthStatus() {
        auth.onAuthStateChanged(function(user) {
            if (user) {
                currentUser = user;
                console.log('User is signed in:', user);
                fetchUserData(user);
                updateUIForAuthStatus(true);
                // Redirect to index.html if on fire-index.html
                if (window.location.pathname.includes('fire-index.html')) {
                    window.location.href = 'index.html';
                }
            } else {
                currentUser = null;
                console.log('No user is signed in.');
                updateUIForAuthStatus(false);
            }
        });
    }

    function updateUIForAuthStatus(isLoggedIn) {
        if (isLoggedIn) {
            if (authButtons) authButtons.style.display = 'none';
            if (mobileAuthButtons) mobileAuthButtons.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
            if (userProfile) {
                const userDisplayName = userProfile.querySelector('#userDisplayName');
                const userAvatar = userProfile.querySelector('#userAvatar');
                if (userDisplayName) userDisplayName.textContent = currentUser.displayName || 'User';
                if (userAvatar) userAvatar.src = currentUser.photoURL || '/placeholder.svg?height=40&width=40';
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (mobileAuthButtons) mobileAuthButtons.style.display = 'block';
            if (userProfile) userProfile.style.display = 'none';
            if (dashboard) dashboard.style.display = 'none';
        }
    }

    function fetchUserData(user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists)   {
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
        if (!dashboard) return;
        const dashboardUserName = dashboard.querySelector('#dashboardUserName');
        const dashboardUserEmail = dashboard.querySelector('#dashboardUserEmail');
        const accountStatus = dashboard.querySelector('#accountStatus');
        const wishlistCount = dashboard.querySelector('#wishlistCount');
        const favoriteCount = dashboard.querySelector('#favoriteCount');
        const sharedCount = dashboard.querySelector('#sharedCount');
        const dashboardSubscriptionStatus = dashboard.querySelector('#subscriptionStatus');

        if (dashboardUserName) dashboardUserName.textContent = userData.displayName || 'User';
        if (dashboardUserEmail) dashboardUserEmail.textContent = userData.email;
        if (accountStatus) accountStatus.textContent = userData.accountStatus === 'paid' ? 'Premium Account' : 'Free Account';
        if (dashboardSubscriptionStatus) dashboardSubscriptionStatus.textContent = `Current Plan: ${userData.subscriptionPlan ? userData.subscriptionPlan.charAt(0).toUpperCase() + userData.subscriptionPlan.slice(1) : 'Free'}`;
        if (wishlistCount) wishlistCount.textContent = `${userData.wishlistRecipes?.length || 0} recipes`;
        if (favoriteCount) favoriteCount.textContent = `${userData.favoriteRecipes?.length || 0} recipes`;
        if (sharedCount) sharedCount.textContent = `${userData.sharedRecipes?.length || 0} recipes`;
    }

    function toggleDashboard() {
        if (!dashboard) return;
        if (dashboard.style.display === 'none') {
            dashboard.style.display = 'block';
            fetchUserData(auth.currentUser);
        } else {
            dashboard.style.display = 'none';
        }
    }

    if (profileButton) {
        profileButton.addEventListener('click', toggleDashboard);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            auth.signOut().then(() => {
                console.log('User signed out successfully');
                window.location.href = 'fire-index.html';
            }).catch((error) => {
                console.error('Error signing out:', error);
            });
        });
    }

    if (loginForm) {
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
    }

    if (signupForm) {
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
    }

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

    // Initial setup
    checkAuthStatus();
});