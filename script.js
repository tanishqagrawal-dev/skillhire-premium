// Firebase initialization is now handled via config.js

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

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
    auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            user.isLoggedIn = true;
            user.name = firebaseUser.displayName || "User";
            user.email = firebaseUser.email;
            user.uid = firebaseUser.uid; // Add UID to user object
            user.photo = firebaseUser.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + firebaseUser.uid;

            // Load additional data from Firestore
            try {
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
            } catch (error) {
                console.error("Firestore Load Error:", error);
            }

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
    if (user.isLoggedIn && user.uid) {
        syncUserWithFirestore();
    }
}

async function syncUserWithFirestore() {
    try {
        await db.collection('users').doc(user.uid).set({
            name: user.name,
            email: user.email,
            photo: user.photo,
            role: user.role || "",
            atsScore: user.atsScore || 88, // Placeholder for now
            lastSync: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log("Cloud Sync Successful");
    } catch (error) {
        console.error("Cloud Sync Error:", error);
    }
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
// --- GEMINI AI ANALYZER ---
async function handleResumeAnalysis() {
    const resumeText = document.getElementById('resume-text').value;
    if (!resumeText || resumeText.length < 50) {
        alert("Please paste your full resume text (at least 50 characters).");
        return;
    }

    if (!geminiConfig || geminiConfig.apiKey === "YOUR_GEMINI_API_KEY") {
        alert("Gemini API Key is missing. Please update config.js.");
        return;
    }

    const zone = document.getElementById('drop-zone');
    const loader = document.getElementById('analysis-loader');
    const result = document.getElementById('analysis-result');

    zone.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const analysis = await analyzeWithGemini(resumeText);
        displayAnalysisResults(analysis);
        loader.classList.add('hidden');
        result.classList.remove('hidden');
    } catch (error) {
        console.error("Analysis Failed:", error);
        alert("AI Analysis failed. Please try again.");
        loader.classList.add('hidden');
        zone.classList.remove('hidden');
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

    // Clean up markdown block if present
    const jsonString = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
}

function displayAnalysisResults(data) {
    // Update Score
    const scoreCircle = document.querySelector('.circular-chart.green .circle');
    const percentageText = document.querySelector('.percentage');
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (data.score / 100) * circumference;

    scoreCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    scoreCircle.style.strokeDashoffset = offset;
    percentageText.innerText = `${data.score}%`;

    // Update Feedback
    const strengthsList = data.strengths.map(s => `<li><i data-lucide="check"></i> ${s}</li>`).join('');
    const missingList = data.missing_skills.map(s => `<li><i data-lucide="x"></i> ${s}</li>`).join('');

    document.querySelector('.feedback-item.good ul').innerHTML = strengthsList;
    document.querySelector('.feedback-item.bad ul').innerHTML = missingList;

    // Refresh Icons
    lucide.createIcons();

    // Update User State
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

// --- MARKET INTELLIGENCE (Gemini Powered) ---
async function fetchMarketData() {
    if (!geminiConfig || !geminiConfig.apiKey || geminiConfig.apiKey === "YOUR_GEMINI_API_KEY") {
        alert("Gemini API Key is missing. Please update config.js.");
        return;
    }

    const tbody = document.getElementById('market-data-body');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem;"><div class="spinner"></div><p>AI is scanning the market...</p></td></tr>`;

    const userSkills = user.skills ? user.skills.join(', ') : "React, JavaScript, Node.js"; // Fallback to default if no skills yet
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
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--danger);">Failed to fetch market data. Try again.</td></tr>`;
    }
}

function renderMarketTable(data) {
    const tbody = document.getElementById('market-data-body');
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
    document.getElementById('progress-text').innerText = `${percent}%`;
    document.getElementById('learning-progress').style.width = `${percent}%`;

    // Sync to Firestore
    if (user.isLoggedIn && user.uid) {
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