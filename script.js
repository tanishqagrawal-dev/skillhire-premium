// Firebase initialization is now handled via config.js

// Declare variables to prevent reference errors if init fails
var auth;
var db;

// Safe Firebase Initialization
try {
    if (typeof firebaseConfig !== 'undefined' && typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log("Firebase initialized successfully.");
    } else {
        console.error("Firebase Config or SDK not found.");
    }
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

// --- STATE MANAGEMENT ---
let user = {
    name: "Guest",
    email: "",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    isLoggedIn: false
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Only setup auth observer if auth is initialized
    if (auth) {
        setupAuthObserver();
    } else {
        console.warn("Auth not initialized, skipping observer setup.");
    }

    // Setup FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            if (answer) {
                answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleMenu() {
        if (!sidebar) return;

        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');
            const mainContent = document.querySelector('.main-content');
            if (mainContent) mainContent.classList.toggle('expanded');
            // Trigger resize for charts
            setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeSidebar) closeSidebar.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
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
                    if (profileImgPreview) profileImgPreview.src = base64Image;
                    if (headerAvatar) headerAvatar.src = base64Image;
                    saveUserToLocal();
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Guest Login (Simulated) - GLOBAL FUNCTION
window.handleLogin = function () {
    console.log("Guest Login Clicked");
    alert("Guest Login Activated"); // Debug alert
    user.isLoggedIn = true;
    user.name = "Guest User";
    user.email = "guest@skillhire.ai";
    user.photo = "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";

    updateUI();

    // UI Transitions
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');

    if (loginScreen) loginScreen.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');

    setTimeout(() => {
        initCharts();
        window.dispatchEvent(new Event('resize'));
    }, 100);
};

// Google Login with Firebase
async function handleGoogleLogin() {
    if (!auth) {
        alert("Firebase Auth is not initialized. Check console for errors.");
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Google Auth Error:", error);
        alert(error.message);
    }
}

function handleLogout() {
    if (auth) {
        auth.signOut().then(() => {
            localStorage.removeItem('skillhire_user');
            window.location.reload();
        });
    } else {
        localStorage.removeItem('skillhire_user');
        window.location.reload();
    }
}

// Firebase Auth State Observer
function setupAuthObserver() {
    if (!auth) return;

    auth.onAuthStateChanged(async (firebaseUser) => {
        const loginScreen = document.getElementById('login-screen');
        const appContainer = document.getElementById('app-container');

        if (firebaseUser) {
            user.isLoggedIn = true;
            user.name = firebaseUser.displayName || "User";
            user.email = firebaseUser.email;
            user.uid = firebaseUser.uid;
            user.photo = firebaseUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + firebaseUser.uid;

            // Load additional data from Firestore
            try {
                if (db) {
                    const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
                    if (userDoc.exists) {
                        const cloudData = userDoc.data();
                        user = { ...user, ...cloudData };
                    } else {
                        // Initialize new user in Firestore
                        await db.collection('users').doc(firebaseUser.uid).set({
                            name: user.name,
                            email: user.email,
                            photo: user.photo,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                }
            } catch (error) {
                console.error("Firestore Load Error:", error);
            }

            updateUI();
            if (loginScreen) loginScreen.classList.add('hidden');
            if (appContainer) appContainer.classList.remove('hidden');

            setTimeout(() => {
                initCharts();
                window.dispatchEvent(new Event('resize'));
            }, 500);
        } else {
            // Only force show login screen if we are not manually toggling it
            // This prevents a race condition, but for now standard behavior is fine
            user.isLoggedIn = false;
            // Note: We don't automatically show login screen here to allow Guest Mode to work if needed, 
            // but strict auth observer usually overrides. 
            // In this app, Guest Login is just local state. 
            // If auth state is "null", it might re-show login screen if we are not careful.

            // If we are currently in "Guest Mode", user.isLoggedIn might be true from handleLogin
            // But this observer fires on load. 
            // We will let the Default Logic apply, but handleLogin overrides the UI classes manually.
        }
    });
}

function saveUserToLocal() {
    localStorage.setItem('skillhire_user', JSON.stringify(user));
    if (user.isLoggedIn && user.uid && db) {
        syncUserWithFirestore();
    }
}

async function syncUserWithFirestore() {
    if (!db || !user.uid) return;
    try {
        await db.collection('users').doc(user.uid).set({
            name: user.name,
            email: user.email,
            photo: user.photo,
            role: user.role || "",
            atsScore: user.atsScore || 88,
            lastSync: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("Cloud Sync Successful");
    } catch (error) {
        console.error("Cloud Sync Error:", error);
    }
}

function updateUI() {
    const ids = ['header-username', 'profile-name-display', 'input-name', 'input-email', 'header-avatar', 'profile-img-preview'];

    const elements = ids.map(id => document.getElementById(id));

    if (elements[0]) elements[0].innerText = user.name;
    if (elements[1]) elements[1].innerText = user.name;
    if (elements[2]) elements[2].value = user.name;
    if (elements[3]) elements[3].value = user.email;
    if (elements[4]) elements[4].src = user.photo;
    if (elements[5]) elements[5].src = user.photo;
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
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = titles[tabId] || 'Dashboard';

    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }
}

// --- ANALYZER LOGIC ---
async function handleResumeAnalysis() {
    const resumeText = document.getElementById('resume-text').value;
    if (!resumeText || resumeText.length < 50) {
        alert("Please paste your full resume text (at least 50 characters).");
        return;
    }

    if (typeof geminiConfig === 'undefined' || !geminiConfig || !geminiConfig.apiKey || geminiConfig.apiKey === "YOUR_GEMINI_API_KEY") {
        alert("Gemini API Key is missing. Please update config.js.");
        return;
    }

    const zone = document.getElementById('drop-zone');
    const loader = document.getElementById('analysis-loader');
    const result = document.getElementById('analysis-result');

    if (zone) zone.classList.add('hidden');
    if (loader) loader.classList.remove('hidden');

    try {
        const analysis = await analyzeWithGemini(resumeText);
        displayAnalysisResults(analysis);
        if (loader) loader.classList.add('hidden');
        if (result) result.classList.remove('hidden');
    } catch (error) {
        console.error("Analysis Failed:", error);
        alert("AI Analysis failed. Please try again.");
        if (loader) loader.classList.add('hidden');
        if (zone) zone.classList.remove('hidden');
    }
}

async function analyzeWithGemini(text) {
    const API_KEY = geminiConfig.apiKey;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const prompt = `
    You are an expert ATS (Applicant Tracking System) Resmue Analyzer. 
    Analyze the following resume text. 
    Provide the output strictly in the following JSON format (no markdown code blocks):
    {
        "score": 85,
        "strengths": ["Skill 1", "Skill 2"],
        "missing_skills": ["Missing 1", "Missing 2"],
        "summary": "One sentence summary of the candidate."
    }
    
    Resume Text:
    ${text}
    `;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const jsonString = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
}

function displayAnalysisResults(data) {
    const scoreCircle = document.querySelector('.circular-chart.green .circle');
    const percentageText = document.querySelector('.percentage');

    if (scoreCircle && percentageText) {
        const radius = 15.9155;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (data.score / 100) * circumference;

        scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        scoreCircle.style.strokeDashoffset = offset;
        percentageText.innerText = `${data.score}%`;
    }

    const strengthsList = data.strengths.map(s => `<li><i data-lucide="check"></i> ${s}</li>`).join('');
    const missingList = data.missing_skills.map(s => `<li><i data-lucide="x"></i> ${s}</li>`).join('');

    const goodUl = document.querySelector('.feedback-item.good ul');
    const badUl = document.querySelector('.feedback-item.bad ul');

    if (goodUl) goodUl.innerHTML = strengthsList;
    if (badUl) badUl.innerHTML = missingList;

    if (typeof lucide !== 'undefined') lucide.createIcons();

    user.atsScore = data.score;
    saveUserToLocal();
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
    const ctx1 = document.getElementById('lineChart');
    if (ctx1) {
        new Chart(ctx1.getContext('2d'), {
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
    }

    const ctx2 = document.getElementById('radarChart');
    if (ctx2) {
        new Chart(ctx2.getContext('2d'), {
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
}

// --- MARKET INTELLIGENCE (Gemini Powered) ---
async function fetchMarketData() {
    if (typeof geminiConfig === 'undefined' || !geminiConfig || !geminiConfig.apiKey || geminiConfig.apiKey === "YOUR_GEMini_API_KEY") {
        alert("Gemini API Key is missing. Please update config.js.");
        return;
    }

    const tbody = document.getElementById('market-data-body');
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;"><div class="spinner"></div><p>AI is scanning the market...</p></td></tr>`;

    const userSkills = user.skills ? user.skills.join(', ') : "React, JavaScript, Node.js";
    const prompt = `
    You are a Real-Time Job Market Analyzer. 
    Based on the following skills: "${userSkills}", list 5 top companies actively hiring for relevant roles.
    For each company, estimate the ATS Cutoff Score (0-100) and provide a status (Eligible or Upskill).
    
    Provide the output strictly in the following JSON format:
    {
        "market_data": [
            {
                "company": "Company Name",
                "role": "Job Role",
                "cutoff": 85,
                "status": "Eligible", // or "Upskill" or "Not Ready"
                "logo_url": "https://logo.clearbit.com/company.com" // Estimate the domain for logo
            }
        ]
    }
    `;

    try {
        const API_KEY = geminiConfig.apiKey;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;
        const jsonString = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const marketData = JSON.parse(jsonString).market_data;

        renderMarketTable(marketData);

    } catch (error) {
        console.error("Market Data Error:", error);
        if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger);">Failed to fetch market data. Try again.</td></tr>`;
    }
}

function renderMarketTable(data) {
    const tbody = document.getElementById('market-data-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');

        let badgeClass = 'success';
        if (item.status === 'Upskill') badgeClass = 'warning';
        if (item.status === 'Not Ready') badgeClass = 'danger';

        let scoreClass = 'score-high';
        if (item.cutoff < 85) scoreClass = 'score-med';
        if (item.cutoff < 75) scoreClass = 'score-low';

        row.innerHTML = `
            <td class="company-name">
                <img src="${item.logo_url}" class="co-logo" onerror="this.src='https://ui-avatars.com/api/?name=${item.company}&background=random'">
                ${item.company}
            </td>
            <td>${item.role}</td>
            <td class="${scoreClass}">${item.cutoff}%</td>
            <td><span class="badge ${badgeClass}">${item.status}</span></td>
            <td><button class="btn-sm">Apply</button></td>
        `;
        tbody.appendChild(row);
    });
}

// --- LEARNING PATH LOGIC ---
function toggleTask(card, taskId) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
    }
    updateProgress();
}

async function updateProgress() {
    const checkboxes = document.querySelectorAll('.learning-grid input[type="checkbox"]');
    const total = checkboxes.length;
    let checked = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) checked++;
    });

    const percent = Math.floor((checked / total) * 100);

    // Update UI
    const progressText = document.getElementById('progress-text');
    const learningProgress = document.getElementById('learning-progress');

    if (progressText) progressText.innerText = `${percent}%`;
    if (learningProgress) learningProgress.style.width = `${percent}%`;

    // Sync to Firestore
    if (user.isLoggedIn && user.uid && db) {
        try {
            await db.collection('users').doc(user.uid).update({
                learningProgress: percent,
                completedTasks: Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.id)
            });
            console.log("Progress Synced");
        } catch (error) {
            console.error("Sync Error:", error);
        }
    }
}