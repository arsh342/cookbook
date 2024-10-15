document.addEventListener('DOMContentLoaded', function() {
    const planButtons = document.querySelectorAll('.plan-btn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = checkoutModal.querySelector('.close');
    const paymentForm = document.getElementById('paymentForm');

    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedPlan = this.getAttribute('data-plan');
            openCheckoutModal(selectedPlan);
        });
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });

    function openCheckoutModal(plan) {
        const planPrice = getPlanPrice(plan);
        const tax = planPrice * 0.1;
        const total = planPrice + tax;

        document.getElementById('checkoutPlan').textContent = plan;
        document.getElementById('checkoutPrice').textContent = planPrice.toFixed(2);
        document.getElementById('checkoutTax').textContent = tax.toFixed(2);
        document.getElementById('checkoutTotal').textContent = total.toFixed(2);

        checkoutModal.style.display = 'block';
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

    function processPayment() {
        // Implement payment processing logic here
        alert('Payment processed successfully!');
        checkoutModal.style.display = 'none';
    }
});
