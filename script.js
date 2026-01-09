// Firebase initialization is now handled via config.js

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// --- STATE MANAGEMENT ---
let user = {
    name: "Guest",
    email: "",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    isLoggedIn: false
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setupAuthObserver();

    // Setup FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleMenu() {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
            // Trigger resize for charts
            setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeSidebar) closeSidebar.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Profile Photo Upload Handling
    const avatarInput = document.getElementById('avatar-input');
    const profileImgPreview = document.getElementById('profile-img-preview');
    const headerAvatar = document.getElementById('header-avatar');

    if (avatarInput) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const base64Image = event.target.result;
                    user.photo = base64Image;
                    profileImgPreview.src = base64Image;
                    headerAvatar.src = base64Image;
                    saveUserToLocal();
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Firebase Auth State Observer
function setupAuthObserver() {
    auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            user.isLoggedIn = true;
            user.name = firebaseUser.displayName || "User";
            user.email = firebaseUser.email;
            user.photo = firebaseUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + firebaseUser.uid;

            updateUI();
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');

            setTimeout(() => {
                initCharts();
                window.dispatchEvent(new Event('resize'));
            }, 500);
        } else {
            user.isLoggedIn = false;
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('app-container').classList.add('hidden');
        }
    });
}

// Guest Login (Simulated)
function handleLogin() {
    user.isLoggedIn = true;
    user.name = "Guest User";
    user.email = "guest@skillhire.ai";
    user.photo = "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";

    updateUI();
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    initCharts();
    window.dispatchEvent(new Event('resize'));
}

function handleLogout() {
    auth.signOut().then(() => {
        localStorage.removeItem('skillhire_user');
        window.location.reload();
    });
}

// Google Login with Firebase
async function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Google Auth Error:", error);
        alert(error.message);
    }
}

function saveUserToLocal() {
    localStorage.setItem('skillhire_user', JSON.stringify(user));
}

function updateUI() {
    document.getElementById('header-username').innerText = user.name;
    document.getElementById('profile-name-display').innerText = user.name;
    document.getElementById('input-name').value = user.name;
    document.getElementById('input-email').value = user.email;
    document.getElementById('header-avatar').src = user.photo;
    document.getElementById('profile-img-preview').src = user.photo;
}

// --- NAVIGATION ---
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove('hidden');
        setTimeout(() => target.classList.add('active'), 10);
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    const titles = {
        'dashboard': 'Overview',
        'analyzer': 'AI Resume Analyzer',
        'companies': 'Market Intelligence',
        'profile': 'My Profile',
        'learning': 'Learning Roadmap',
        'faq': 'Help Center'
    };
    document.getElementById('page-title').innerText = titles[tabId] || 'Dashboard';

    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
        const overlay = document.getElementById('sidebar-overlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// --- ANALYZER LOGIC ---
function simulateUpload() {
    const zone = document.getElementById('drop-zone');
    const loader = document.getElementById('analysis-loader');
    const result = document.getElementById('analysis-result');

    zone.classList.add('hidden');
    loader.classList.remove('hidden');

    setTimeout(() => {
        loader.classList.add('hidden');
        result.classList.remove('hidden');
    }, 2500);
}

// --- PROFILE LOGIC ---
function saveProfile() {
    const newName = document.getElementById('input-name').value;
    const newRole = document.getElementById('input-role').value;

    user.name = newName;
    user.role = newRole;
    saveUserToLocal();
    updateUI();
    alert("Profile Updated Successfully!");
}

// --- CHARTS (Chart.js) ---
function initCharts() {
    const ctx1 = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Resume Score',
                data: [45, 52, 49, 68, 75, 88],
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    const ctx2 = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx2, {
        type: 'radar',
        data: {
            labels: ['Coding', 'Design', 'Communication', 'System Design', 'Cloud'],
            datasets: [{
                label: 'Current Skills',
                data: [90, 60, 80, 70, 50],
                backgroundColor: 'rgba(188, 122, 249, 0.4)',
                borderColor: '#bc7af9',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}
