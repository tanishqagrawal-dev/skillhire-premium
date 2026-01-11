// --- LANDING PAGE LOGIC & AUTH REDIRECTION ---
console.log("Landing JS Loaded successfully!");

window.onerror = function (msg, url, line) {
    console.error("Global Error: " + msg + "\n" + url + ":" + line);
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available
    if (typeof firebase !== 'undefined') {
        const auth = firebase.auth();

        // Monitor Auth State
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("User detected, redirecting to dashboard...");
                // Redirect logged-in users to the dashboard
                window.location.href = 'pages/dashboard.html';
            } else {
                console.log("No user logged in. Landing page ready.");
            }
        });
    }

    // Redirect to Auth Page
    window.startLogin = () => {
        window.location.href = 'pages/auth.html';
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

    document.querySelectorAll('.card, .feature-item, .price-card, .founder-card').forEach(el => {
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

// --- THEME LOGIC ---
function toggleTheme() {
    const isLight = document.body.dataset.theme === 'light';
    const newTheme = isLight ? 'dark' : 'light';

    document.body.dataset.theme = newTheme;
    localStorage.setItem('skilmatrix_theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const isLight = document.body.dataset.theme === 'light';
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        const icon = isLight ? 'moon' : 'sun';
        // Basic lucide re-render approach (or innerHTML swap)
        btn.innerHTML = `<i data-lucide="${icon}"></i>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// Initialize Theme on Load (Outside DOMContentLoaded to avoid FOUC if possible, but JS file usually loads late)
const savedTheme = localStorage.getItem('skilmatrix_theme') || 'dark';
document.body.dataset.theme = savedTheme;
updateThemeIcon();

// --- FOUNDER MODAL LOGIC ---
const founderData = {
    tanishq: {
        name: "Tanishq Agrawal",
        role: "Frontend, UI/UX, Marketing & Features",
        img: "assets/tanishq.jpg",
        bio: "The driving force behind the platform's visual identity, user experience, and strategic growth. Tanishq leads Frontend Engineering and UI/UX Design, bridging the gap between complex code and beautiful interfaces. He also spearheads Digital Marketing strategies and oversees Feature Innovation to ensure the product constantly evolves.",
        social: {
            github: "https://github.com/tanishqagrawal-dev",
            linkedin: "https://www.linkedin.com/in/tanishq-agrawal-91a505335",
            instagram: "https://www.instagram.com/tanishq_agrawal_11?igsh=YmtibTEwcDFsd3No"
        },
        skills: ["Frontend Developer", "UI/UX Design", "React & Modern JS", "Digital Marketing", "Product Strategy"]
    },
    yash: {
        name: "Yash Jain",
        role: "Cloud, Backend & Security",
        img: "assets/yash.jpg",
        bio: "The architect of our digital infrastructure. Yash specializes in Cloud Engineering and Backend Development, ensuring our systems are robust and scalable. He maintains a rigorous focus on Cloud & System Security and DevOps practices to guarantee 24/7 uptime and military-grade data protection.",
        social: {
            github: "https://github.com/Yash-Jain2006",
            linkedin: "https://www.linkedin.com/in/yash-jain-jan2006",
            instagram: "https://www.instagram.com/yashjain0601"
        },
        skills: ["Cloud Engineer", "Cloud Architecture", "Backend Developer", "Cloud & System Security", "Dev Ops"]
    },
    anoop: {
        name: "Anoop Verma",
        role: "Lead AI & Backend Developer",
        img: "assets/anoop.jpg",
        bio: "The mind behind the machine. Anoop architects the complex AI models and backend logic that power the 'brain' of Skill Matrix. From natural language processing to predictive analytics, he transforms raw data into actionable career intelligence for our users.",
        social: {
            github: "https://github.com/MakoShar",
            linkedin: "https://www.linkedin.com/in/anoop-verma-12078b322",
            instagram: "https://www.instagram.com/aiden_4178?igsh=MXd2N3dtaXVkdzF2YQ=="
        },
        skills: ["Artificial Intelligence", "Python & Backend", "Machine Learning", "Data Structures", "Algorithm Design"]
    }
};

window.openFounder = function (id) {
    const data = founderData[id];
    if (!data) return;

    const modal = document.getElementById('founder-modal');
    const content = document.getElementById('founder-modal-content');

    // Populate Data
    document.getElementById('modal-img').src = data.img;
    document.getElementById('modal-name').textContent = data.name;
    document.getElementById('modal-role').textContent = data.role;
    document.getElementById('modal-bio').textContent = data.bio;

    // Populate Skills
    const skillsContainer = document.getElementById('modal-skills');
    skillsContainer.innerHTML = data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');

    // Populate Socials
    document.getElementById('link-github').href = data.social.github;
    document.getElementById('link-linkedin').href = data.social.linkedin;
    document.getElementById('link-instagram').href = data.social.instagram;

    // Show Modal
    modal.classList.add('active');
    // slight delay for content animation
    setTimeout(() => {
        content.classList.add('active');
    }, 10);

    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

window.closeFounder = function () {
    const modal = document.getElementById('founder-modal');
    const content = document.getElementById('founder-modal-content');

    content.classList.remove('active');
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }, 300);
}

// Close on outside click for Founder Modal
document.getElementById('founder-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'founder-modal') {
        window.closeFounder();
    }
});

// --- PLAN SELECTION MODAL LOGIC ---
const plansData = {
    free: {
        name: "Free Starter",
        price: "₹0 <span>/mo</span>",
        features: [
            "Basic Resume Analysis (3/mo)",
            "1 Mock Interview Session",
            "Basic Skill Roadmap",
            "Community Forum Access",
            "Limited AI Chat Support"
        ]
    },
    premium: {
        name: "Premium Student",
        price: "₹199 <span>/mo</span>",
        features: [
            "Unlimited Resume Scans & ATS Checks",
            "Unlimited AI Mock Interviews",
            "Deep Interview Feedback & Analysis",
            "Full Personalized Learning Roadmap",
            "Company-Specific Insights",
            "Ad-free Experience"
        ]
    },
    pro: {
        name: "Pro Intensive",
        price: "₹499 <span>/mo</span>",
        features: [
            "Everything in Premium",
            "1-on-1 Human Career Coaching (1/mo)",
            "Manual Resume Review by Expert",
            "Priority Support (24/7)",
            "Verified Skill Badge Certification"
        ]
    },
    campus: {
        name: "Campus / Teams",
        price: "Custom",
        features: [
            "Full access for entire Batch/College",
            "Admin Dashboard for TPO",
            "Student Progress Tracking",
            "Bulk Resume Export & Filtering",
            "Custom Onboarding Workshop"
        ]
    }
};

window.openPlanModal = (planId) => {
    const plan = plansData[planId];
    if (!plan) return;

    // Populate Modal Content
    document.getElementById('modal-plan-name').textContent = plan.name;
    document.getElementById('modal-plan-price').innerHTML = plan.price;

    // Generate Features List
    const featuresContainer = document.querySelector('.modal-features-list');
    featuresContainer.innerHTML = plan.features.map(feature => `
        <div class="modal-feature-item">
            <i data-lucide="check-circle-2"></i>
            <span>${feature}</span>
        </div>
    `).join('');

    // Refresh icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Show Modal
    const modal = document.getElementById('plan-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closePlanModal = () => {
    document.getElementById('plan-modal').classList.remove('active');
    document.body.style.overflow = '';
};

// Close on outside click for Plan Modal
document.getElementById('plan-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'plan-modal') {
        closePlanModal();
    }
});

// Navigate to Auth with Cleanup
window.gridToAuth = () => {
    closePlanModal();
    setTimeout(() => {
        window.location.href = 'pages/auth.html';
    }, 100);
};

// Force Cleanup on Page Show/Restore (Fixes BF Cache Hangs)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from cache
        console.log("Page restored from cache - cleaning up...");
    }
    document.body.style.overflow = ''; // Always enable scroll on load
    document.getElementById('plan-modal')?.classList.remove('active');
    document.getElementById('founder-modal')?.classList.remove('active');
});

// Mobile Menu Toggle
// Mobile/Sidebar Menu Toggle
window.toggleMobileMenu = function () {
    console.log("Toggle Sidebar Clicked");
    const sidebar = document.getElementById('mobile-sidebar');
    let backdrop = document.querySelector('.sidebar-backdrop');

    // Create backdrop if not exists
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.onclick = window.toggleMobileMenu; // Click/Tap outside to close
        document.body.appendChild(backdrop);
    }

    if (sidebar) {
        sidebar.classList.toggle('active');
        backdrop.classList.toggle('active');

        // Prevent body scroll if active
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    } else {
        console.error("Sidebar menu not found!");
    }

    if (window.lucide) {
        lucide.createIcons();
    }
}
