// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD0G0FgE-vOLXoXIEf5QtSYnNrLiNznGdQ",
    authDomain: "login-form-930c5.firebaseapp.com",
    projectId: "login-form-930c5",
    storageBucket: "login-form-930c5.appspot.com",
    messagingSenderId: "1007013620345",
    appId: "1:1007013620345:web:f9d7514004086d45af82a8"
};

// Get references to the buttons
const actionBtn = document.getElementById('action_btn');

// Create a user icon element
const userIcon = document.createElement('i');
userIcon.className = 'fas fa-user'; // Use Font Awesome or similar for the icon
userIcon.style.cursor = 'pointer'; // Optional: make it look clickable

// Function to replace buttons with the user icon
function showUserIcon() {
    if (actionBtn) {
        actionBtn.replaceWith(userIcon);
    }
}

// Check Firebase auth state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is logged in, show the user icon
        showUserIcon();
    } else {
        // User is not logged in, keep showing the login and get started buttons
        // Optionally, you can handle any reset logic here if needed
    }
});

// Optional: Add click event to user icon for showing user profile or logout options
userIcon.addEventListener('click', () => {
    // Handle click event, such as opening a profile menu or logging out
    alert('User icon clicked!'); // Replace with your logic
});
