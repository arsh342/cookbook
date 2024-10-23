document.addEventListener('DOMContentLoaded', function() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeSubscriptionBtn = subscriptionModal.querySelector('.close');
    const closeCheckoutBtn = checkoutModal.querySelector('.close');
    const closeConfirmationBtn = confirmationModal.querySelector('.close');
    const planButtons = subscriptionModal.querySelectorAll('.plan-btn');
    const dashboardSubscriptionStatus = document.getElementById('subscriptionStatus');
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethods = paymentForm.querySelectorAll('input[name="paymentMethod"]');
    const creditCardFields = document.getElementById('creditCardFields');
    const upiFields = document.getElementById('upiFields');

    let currentUser = null;
    let selectedPlan = null;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            checkUserSubscription();
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
        }
    });

    function checkUserSubscription() {
        firebase.firestore().collection('users').doc(currentUser.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const currentPlan = userData.subscriptionPlan || 'Free';
                updateSubscriptionUI(currentPlan);
            } else {
                console.log("No user data found!");
                updateSubscriptionUI('Free');
            }
        }).catch((error) => {
            console.error("Error getting user data:", error);
        });
    }

    function updateUIForLoggedInUser(subscriptionPlan) {
        subscribeBtn.textContent = 'Change Subscription';
        subscribeBtn.disabled = false;
        if (dashboardSubscriptionStatus) {
            dashboardSubscriptionStatus.textContent = `Current Plan: ${subscriptionPlan}`;
        }
    }

    function updateUIForLoggedOutUser() {
        subscribeBtn.textContent = 'Subscribe';
        subscribeBtn.disabled = true;
        if (dashboardSubscriptionStatus) {
            dashboardSubscriptionStatus.textContent = 'Please log in to view subscription status';
        }
    }

    function openSubscriptionModal() {
        if (currentUser) {
            subscriptionModal.style.display = 'block';
        } else {
            alert('Please log in to view subscription options.');
        }
    }

    function closeSubscriptionModal() {
        subscriptionModal.style.display = 'none';
    }

    function openCheckoutModal(plan) {
        selectedPlan = plan;
        if (plan === 'Free') {
            processSubscription();
        } else {
            const planPrice = getPlanPrice(plan);
            const tax = planPrice * 0.1;
            const total = planPrice + tax;

            document.getElementById('checkoutPlan').textContent = plan;
            document.getElementById('checkoutPrice').textContent = planPrice.toFixed(2);
            document.getElementById('checkoutTax').textContent = tax.toFixed(2);
            document.getElementById('checkoutTotal').textContent = total.toFixed(2);

            subscriptionModal.style.display = 'none';
            checkoutModal.style.display = 'block';

            // Reset payment form
            paymentForm.reset();
            updatePaymentFieldsVisibility();
        }
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    function getPlanPrice(plan) {
        switch (plan) {
            case 'Free':
                return 0;
            case 'Basic':
                return 9.99;
            case 'Premium':
                return 19.99;
            default:
                return 0;
        }
    }

    subscribeBtn.addEventListener('click', openSubscriptionModal);
    closeSubscriptionBtn.addEventListener('click', closeSubscriptionModal);
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
    closeConfirmationBtn.addEventListener('click', () => confirmationModal.style.display = 'none');

    window.addEventListener('click', function(event) {
        if (event.target === subscriptionModal) {
            closeSubscriptionModal();
        }
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedPlan = this.getAttribute('data-plan');
            openCheckoutModal(selectedPlan);
        });
    });

    function updatePaymentFieldsVisibility() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (selectedMethod === 'creditCard') {
            creditCardFields.style.display = 'flex';
            upiFields.style.display = 'none';
        } else if (selectedMethod === 'upi') {
            creditCardFields.style.display = 'none';
            upiFields.style.display = 'flex';
        }
    }

    paymentMethods.forEach(method => {
        method.addEventListener('change', updatePaymentFieldsVisibility);
    });

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processSubscription();
    });

    function processSubscription() {
        if (!currentUser) {
            alert('Please log in to subscribe.');
            return;
        }

        const confirmPaymentBtn = document.getElementById('confirmPayment');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.disabled = true;
            confirmPaymentBtn.textContent = 'Processing...';
        }

        // Validate payment details
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (selectedPlan !== 'Free' && !validatePaymentDetails(selectedMethod)) {
            if (confirmPaymentBtn) {
                confirmPaymentBtn.disabled = false;
                confirmPaymentBtn.textContent = 'Confirm Payment';
            }
            return;
        }

        // Simulate payment processing delay
        setTimeout(() => {
            firebase.firestore().collection('users').doc(currentUser.uid).update({
                subscriptionPlan: selectedPlan
            }).then(() => {
                if (checkoutModal) checkoutModal.style.display = 'none';
                document.getElementById('confirmedPlan').textContent = selectedPlan;
                confirmationModal.style.display = 'block';
                checkUserSubscription();
            }).catch((error) => {
                console.error("Error updating subscription:", error);
                alert("An error occurred while subscribing. Please try again.");
            }).finally(() => {
                if (confirmPaymentBtn) {
                    confirmPaymentBtn.disabled = false;
                    confirmPaymentBtn.textContent = 'Confirm Payment';
                }
            });
        }, 2000); // Simulate a 2-second processing time
    }

    function validatePaymentDetails(method) {
        if (method === 'creditCard') {
            const cardNumber = document.querySelector('#creditCardFields input[placeholder="Card Number"]').value;
            const expiry = document.querySelector('#creditCardFields input[placeholder="MM/YY"]').value;
            const cvc = document.querySelector('#creditCardFields input[placeholder="CVC"]').value;

            if (!cardNumber || !expiry || !cvc) {
                alert('Please fill in all credit card details.');
                return false;
            }
            // Add more specific validation for credit card fields if needed
        } else if (method === 'upi') {
            const upiId = document.querySelector('#upiFields input[placeholder="UPI ID"]').value;
            if (!upiId) {
                alert('Please enter a valid UPI ID.');
                return false;
            }
            // Add more specific validation for UPI ID if needed
        }
        return true;
    }

    function updateSubscriptionUI(plan) {
        const subscriptionStatus = document.getElementById('subscriptionStatus');
        const subscribeBtn = document.getElementById('subscribeBtn');
        
        if (subscriptionStatus) {
            subscriptionStatus.textContent = `Current Plan: ${plan}`;
        }
        
        if (subscribeBtn) {
            subscribeBtn.textContent = plan === 'Free' ? 'Upgrade Subscription' : 'Change Subscription';
        }
    }

    document.getElementById('closeConfirmation').addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    // Initialize payment fields visibility
    updatePaymentFieldsVisibility();
});