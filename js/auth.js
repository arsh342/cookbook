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
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function() {
    const authButtons = document.getElementById('authButtons');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const userProfile = document.getElementById('userProfile');
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');
    const dashboard = document.getElementById('dashboard');

    let currentUser = null;

    function checkAuthStatus() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                currentUser = user;
                fetchUserData();
                updateUIForAuthStatus(true);
                // Redirect to index.html if on fire-index.html
                if (window.location.pathname.includes('fire-index.html')) {
                    window.location.href = 'index.html';
                }
            } else {
                currentUser = null;
                updateUIForAuthStatus(false);
            }
        });
    }

    function updateUIForAuthStatus(isLoggedIn) {
        if  (isLoggedIn) {
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

    function fetchUserData() {
        if (!currentUser) return;
        firebase.firestore().collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    updateDashboardData(userData);
                } else {
                    console.log("No user data found!");
                    createNewUserDocument(currentUser);
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

        firebase.firestore().collection('users').doc(user.uid).set(userData)
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
        const dashboardSubscriptionStatus = dashboard.querySelector('#dashboardSubscriptionStatus');

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
            fetchUserData();
        } else {
            dashboard.style.display = 'none';
        }
    }

    if (profileButton) {
        profileButton.addEventListener('click', toggleDashboard);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            firebase.auth().signOut().then(() => {
                console.log('User signed out successfully');
                window.location.href = 'fire-index.html';
            }).catch((error) => {
                console.error('Error signing out:', error);
            });
        });
    }

    // Initial setup
    checkAuthStatus();
});