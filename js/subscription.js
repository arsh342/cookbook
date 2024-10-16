document.addEventListener('DOMContentLoaded', function() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const mobileSubscribeBtn = document.getElementById('mobileSubscribeBtn');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeSubscriptionBtn = subscriptionModal.querySelector('.close');
    const closeCheckoutBtn = checkoutModal.querySelector('.close');
    const planButtons = subscriptionModal.querySelectorAll('.plan-btn');
    const newsletterBtn = document.querySelector('.btn-light');
    const dashboardSubscriptionStatus = document.getElementById('subscriptionStatus');
    const paymentForm = document.getElementById('paymentForm');

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
                updateUIForLoggedInUser(userData.subscriptionPlan || 'free', userData.isSubscribedToNewsletter || false);
            } else {
                console.log("No user data found!");
                updateUIForLoggedInUser('free', false);
            }
        }).catch((error) => {
            console.error("Error getting user data:", error);
        });
    }

    function updateUIForLoggedInUser(subscriptionPlan, isSubscribedToNewsletter) {
        subscribeBtn.textContent = 'Change Subscription';
        subscribeBtn.disabled = false;
        if (mobileSubscribeBtn) {
            mobileSubscribeBtn.textContent = 'Change Subscription';
            mobileSubscribeBtn.disabled = false;
        }
        if (dashboardSubscriptionStatus) {
            dashboardSubscriptionStatus.textContent = `Current Plan: ${subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)}`;
        }
        updateNewsletterButtonStatus(isSubscribedToNewsletter);
    }

    function updateUIForLoggedOutUser() {
        subscribeBtn.textContent = 'Subscribe';
        subscribeBtn.disabled = true;
        if (mobileSubscribeBtn) {
            mobileSubscribeBtn.textContent = 'Subscribe';
            mobileSubscribeBtn.disabled = true;
        }
        if (dashboardSubscriptionStatus) {
            dashboardSubscriptionStatus.textContent = 'Please log in to view subscription status';
        }
        updateNewsletterButtonStatus(false);
    }

    function updateNewsletterButtonStatus(isSubscribed) {
        if (newsletterBtn) {
            if (isSubscribed) {
                newsletterBtn.textContent = 'Unsubscribe from Newsletter';
            } else {
                newsletterBtn.textContent = 'Subscribe to Newsletter';
            }
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
        const planPrice = getPlanPrice(plan);
        const tax = planPrice * 0.1;
        const total = planPrice + tax;

        document.getElementById('checkoutPlan').textContent = plan;
        document.getElementById('checkoutPrice').textContent = planPrice.toFixed(2);
        document.getElementById('checkoutTax').textContent = tax.toFixed(2);
        document.getElementById('checkoutTotal').textContent = total.toFixed(2);

        subscriptionModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    }

    function closeCheckoutModal() {
        checkoutModal.style.display = 'none';
    }

    function getPlanPrice(plan) {
        switch (plan) {
            case 'free':
                return 0;
            case 'tier1':
                return 9.99;
            case 'tier2':
                return 19.99;
            default:
                return 0;
        }
    }

    subscribeBtn.addEventListener('click', openSubscriptionModal);
    if (mobileSubscribeBtn) {
        mobileSubscribeBtn.addEventListener('click', openSubscriptionModal);
    }
    closeSubscriptionBtn.addEventListener('click', closeSubscriptionModal);
    closeCheckoutBtn.addEventListener('click', closeCheckoutModal);

    window.addEventListener('click', function(event) {
        if (event.target === subscriptionModal) {
            closeSubscriptionModal();
        }
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    });

    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedPlan = this.getAttribute('data-plan');
            openCheckoutModal(selectedPlan);
        });
    });

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });

    function processPayment() {
        if (!currentUser) {
            alert('Please log in to subscribe.');
            return;
        }

        // Here you would typically integrate with a payment gateway
        // For this example, we'll just simulate a successful payment

        firebase.firestore().collection('users').doc(currentUser.uid).update({
            subscriptionPlan: selectedPlan
        }).then(() => {
            alert(`You have successfully subscribed to the ${selectedPlan} plan!`);
            closeCheckoutModal();
            checkUserSubscription();
        }).catch((error) => {
            console.error("Error updating subscription:", error);
            alert("An error occurred while subscribing. Please try again.");
        });
    }

    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function() {
            if (!currentUser) {
                alert('Please log in to subscribe to the newsletter.');
                return;
            }

            firebase.firestore().collection('users').doc(currentUser.uid).get().then((doc) => {
                const userData = doc.data();
                const isCurrentlySubscribed = userData.isSubscribedToNewsletter || false;
                
                firebase.firestore().collection('users').doc(currentUser.uid).update({
                    isSubscribedToNewsletter: !isCurrentlySubscribed
                }).then(() => {
                    if (isCurrentlySubscribed) {
                        alert('You have successfully unsubscribed from our newsletter.');
                    } else {
                        alert('You have successfully subscribed to our newsletter!');
                    }
                    checkUserSubscription();
                }).catch((error) => {
                    console.error("Error updating newsletter subscription:", error);
                    alert("An error occurred. Please try again.");
                });
            }).catch((error) => {
                console.error("Error getting user data:", error);
                alert("An error occurred. Please try again.");
            });
        });
    }
});