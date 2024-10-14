document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');
    const signInForm = document.getElementById('signin');
    const signUpForm = document.getElementById('signup');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    if (signUpButton && signInButton) {
        signUpButton.addEventListener('click', function () {
            signInForm.style.display = "none";
            signUpForm.style.display = "block";
        });
        signInButton.addEventListener('click', function () {
            signInForm.style.display = "block";
            signUpForm.style.display = "none";
        });
    }

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
});