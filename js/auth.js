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
            } else {
                currentUser = null;
                updateUIForAuthStatus(false);
            }
        });
    }

    function updateUIForAuthStatus(isLoggedIn) {
        if (isLoggedIn) {
            authButtons.style.display = 'none';
            mobileAuthButtons.style.display = 'none';
            userProfile.style.display = 'flex';
            document.getElementById('userDisplayName').textContent = currentUser.displayName || 'User';
            document.getElementById('userAvatar').src = currentUser.photoURL || '/placeholder.svg?height=40&width=40';
        } else {
            authButtons.style.display = 'flex';
            mobileAuthButtons.style.display = 'block';
            userProfile.style.display = 'none';
            dashboard.style.display = 'none';
        }
    }

    function fetchUserData() {
        firebase.firestore().collection('users').doc(currentUser.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    updateDashboardData(userData);
                } else {
                    console.log("No user data found!");
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }

    function updateDashboardData(userData) {
        document.getElementById('dashboardUserName').textContent = userData.firstName + ' ' + userData.lastName;
        document.getElementById('dashboardUserEmail').textContent = userData.email;
        document.getElementById('accountStatus').textContent = userData.accountStatus === 'paid' ? 'Premium Account' : 'Free Account';

        document.getElementById('wishlistCount').textContent = `${userData.wishlistRecipes?.length || 0} recipes`;
        document.getElementById('favoriteCount').textContent = `${userData.favoriteRecipes?.length || 0} recipes`;
        document.getElementById('sharedCount').textContent = `${userData.sharedRecipes?.length || 0} recipes`;
    }

    function toggleDashboard() {
        if (dashboard.style.display === 'none') {
            dashboard.style.display = 'block';
            fetchUserData();
        } else {
            dashboard.style.display = 'none';
        }
    }

    profileButton.addEventListener('click', toggleDashboard);

    logoutButton.addEventListener('click', function() {
        firebase.auth().signOut().then(() => {
            console.log('User signed out successfully');
            window.location.href = 'index.html'; // Redirect to home page after logout
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    });

    // Initial setup
    checkAuthStatus();
});