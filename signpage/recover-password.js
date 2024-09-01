// Import necessary functions from Firebase SDK
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Initialize Firebase (make sure this matches your firebaseauth.js setup)
const auth = getAuth();

document.getElementById('submitRecoverPassword').addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('recoverEmail').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Email sent
            showMessage('Password reset email sent. Please check your inbox.', 'recoverMessage');
        })
        .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            let message = 'An error occurred. Please try again later.';
            if (errorCode === 'auth/invalid-email') {
                message = 'Invalid email address.';
            } else if (errorCode === 'auth/user-not-found') {
                message = 'No user found with this email.';
            }
            showMessage(message, 'recoverMessage');
        });
});

function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 500);
    }, 5000);
}
