// --- LANDING PAGE LOGIC & AUTH REDIRECTION ---

document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined') {
        const auth = firebase.auth();

        // Monitor Auth State
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("User detected, redirecting to dashboard...");
                // Redirect logged-in users to the dashboard
                window.location.href = 'dashboard.html';
            } else {
                console.log("No user logged in. Landing page ready.");
            }
        });
    }

    // Google Sign-In Handler for Landing Page Buttons
    window.startLogin = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                console.log("Login successful, auth observer will redirect.");
            })
            .catch((error) => {
                console.error("Login Error:", error);
                alert("Login failed: " + error.message);
            });
    };

    // Simple Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .feature-item, .price-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});

// Add fade-in utility to document
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
