// --- STATE MANAGEMENT ---
let user = {
    name: "Guest",
    email: "",
    isLoggedIn: false
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    checkLogin();

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
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    // Close sidebar when clicking menu items on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});

// --- AUTH FUNCTIONS ---
function handleLogin() {
    // Simulate API Call
    setTimeout(() => {
        user.isLoggedIn = true;
        user.name = "Alex Johnson";
        user.email = "alex.j@skillgap.ai";
        user.photo = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex";

        saveUserToLocal();
        updateUI();
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        initCharts(); // Render graphs only after login
    }, 1000);
}

function handleLogout() {
    user.isLoggedIn = false;
    localStorage.removeItem('skillgap_user');
    window.location.reload();
}

function checkLogin() {
    const savedUser = localStorage.getItem('skillgap_user');
    if (savedUser) {
        user = JSON.parse(savedUser);
        if (user.isLoggedIn) {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            updateUI();
            setTimeout(initCharts, 500); // Small delay for DOM to settle
        }
    }
}

function saveUserToLocal() {
    localStorage.setItem('skillgap_user', JSON.stringify(user));
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
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));

    // Deactivate nav items
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show Target
    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove('hidden');
        setTimeout(() => target.classList.add('active'), 10); // Fade in trick
    }

    // Highlight Nav
    event.currentTarget.classList.add('active');

    // Update Title
    const titles = {
        'dashboard': 'Overview',
        'analyzer': 'AI Resume Analyzer',
        'companies': 'Market Intelligence',
        'profile': 'My Profile',
        'learning': 'Learning Roadmap',
        'faq': 'Help Center'
    };
    document.getElementById('page-title').innerText = titles[tabId] || 'Dashboard';
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
    // Line Chart (Performance)
    const ctx1 = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Resume Score',
                data: [45, 52, 49, 68, 75, 88],
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
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

    // Radar Chart (Skills)
    const ctx2 = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx2, {
        type: 'radar',
        data: {
            labels: ['Coding', 'Design', 'Communication', 'System Design', 'Cloud'],
            datasets: [{
                label: 'Current Skills',
                data: [90, 60, 80, 70, 50],
                backgroundColor: 'rgba(168, 85, 247, 0.4)',
                borderColor: '#a855f7',
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

