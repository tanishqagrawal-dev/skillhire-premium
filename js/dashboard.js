// Firebase initialization is now handled via config.js

// Declare variables to prevent reference errors if init fails
var auth;
var db;

// Safe Firebase Initialization
try {
    if (typeof firebaseConfig !== 'undefined' && typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        // Enable detailed logging
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(() => console.log("Auth Persistence set to LOCAL"))
            .catch((error) => console.error("Auth Persistence Error:", error));

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
            setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
        }
    }
    // Expose for usage
    window.closeMobileMenu = function () {
        if (typeof handleMenuClose === 'function') handleMenuClose();
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeSidebar) closeSidebar.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    // Helper to close menu (Mobile: close fully, Desktop: collapse)
    function handleMenuClose() {
        if (!sidebar) return;

        if (window.innerWidth <= 768) {
            // Mobile: Close fully
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
            }
        } else {
            // Desktop: Auto-collapse if user wants it "same" as mobile (interactive)
            // If they mean "close" as in "get out of the way", collapsing is the way.
            if (!sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                const mainContent = document.querySelector('.main-content');
                if (mainContent) mainContent.classList.add('expanded');
                setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
            }
        }
    }

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

    // Initialize Market Data
    initMarketData();
});

// Guest Login (Simulated) - GLOBAL FUNCTION
window.handleLogin = function () {
    console.log("Guest Login Clicked");
    alert("Guest Login Activated"); // Debug alert
    user.isLoggedIn = true;
    user.name = "Test User";
    user.email = "testuser@gmail.com";
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
        checkAuthStatus();
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error("Google Auth Error:", error);
        if (error.code === 'auth/popup-closed-by-user') {
            return; // Ignore
        }
        if (error.code === 'auth/popup-blocked') {
            alert("Popup blocked! Please allow popups for this site.");
            return;
        }
        alert("Google Login Error: " + error.message);
    }
}

// Email Login
async function handleEmailLogin() {
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    if (!auth) {
        checkAuthStatus();
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error("Email Auth Error:", error);
        alert("Login Failed: " + error.message);
    }
}

function checkAuthStatus() {
    let msg = "Firebase Auth is not initialized.\n";
    if (typeof firebaseConfig === 'undefined') msg += "- firebaseConfig is MISSING\n";
    else msg += "- firebaseConfig is loaded\n";

    if (typeof firebase === 'undefined') msg += "- firebase SDK is MISSING\n";
    else msg += "- firebase SDK is loaded\n";

    alert(msg + "\nPlease verify config.js and network connection.");
}

function handleLogout() {
    if (auth) {
        auth.signOut().then(() => {
            localStorage.removeItem('skillhire_user');
            localStorage.removeItem('skillhire_guest');
            window.location.href = '../index.html';
        });
    } else {
        localStorage.removeItem('skillhire_user');
        localStorage.removeItem('skillhire_guest');
        window.location.href = '../index.html';
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
        } else if (localStorage.getItem('skillhire_guest') === 'true') {
            console.log("Guest mode active, staying on dashboard.");
            user.isLoggedIn = false;
            user.name = "Test User";
            user.photo = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"; // Matching likely seed or keeping consistent

            updateUI();
            if (loginScreen) loginScreen.classList.add('hidden');
            if (appContainer) appContainer.classList.remove('hidden');

            setTimeout(() => {
                initCharts();
                window.dispatchEvent(new Event('resize'));
            }, 500);
        } else {
            console.log("No authenticated user or guest flag, redirecting to landing page...");
            window.location.href = '../index.html';
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
    const ids = ['header-username', 'profile-name-display', 'input-name', 'input-email', 'header-avatar', 'profile-img-preview', 'settings-avatar-big'];

    const elements = ids.map(id => document.getElementById(id));

    if (elements[0]) elements[0].innerText = user.name;
    if (elements[1]) elements[1].innerText = user.name;
    if (elements[2]) elements[2].value = user.name;
    if (elements[3]) elements[3].value = user.email;
    if (elements[4]) elements[4].src = user.photo;
    if (elements[5]) elements[5].src = user.photo;
    if (elements[6]) elements[6].src = user.photo;
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
        'faq': 'Help Center',
        'resume-builder': 'Resume Builder',
        'interview-prep': 'Mock Interview',
        'dsa-practice': 'DSA Practice',
        'roadmap': 'Career Roadmap',
        'settings': 'Settings'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = titles[tabId] || 'Dashboard';

    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // Close menu (Mobile or Desktop based on request)
    if (typeof handleMenuClose === 'function') {
        handleMenuClose();
    } else if (typeof closeMobileMenu === 'function') {
        closeMobileMenu();
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
// --- MARKET INTELLIGENCE & COMPANY INSIGHTS ---

const companyInsightsData = {
    "Amazon": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        desc: "Global E-commerce & Cloud Computing Leader",
        cutoff: 84,
        roles: [
            {
                title: "AI/ML Solutions Engineer",
                package: "35-75 LPA",
                skills: ["Python", "TensorFlow", "PyTorch", "AWS SageMaker", "Generative AI"],
                experience: "2-8 years",
                description: "Strong ML and cloud experience with scalable AI systems"
            },
            {
                title: "Cloud Infrastructure Engineer",
                package: "30-70 LPA",
                skills: ["AWS", "Serverless", "Networking", "Terraform", "CDK"],
                experience: "3-8 years",
                description: "Expertise in AWS architecture and infrastructure"
            },
            {
                title: "Full-Stack Developer",
                package: "28-55 LPA",
                skills: ["Node.js", "React", "TypeScript", "API Design", "GraphQL"],
                experience: "2-6 years",
                description: "Strong full-stack and cloud development skills"
            },
            {
                title: "Cybersecurity Engineer",
                package: "28-60 LPA",
                skills: ["Identity Management", "Zero Trust", "SIEM", "Cloud Security Audits"],
                experience: "2-7 years",
                description: "Proven experience in cloud security and risk management"
            },
            {
                title: "Site Reliability Engineer (SRE)",
                package: "30-65 LPA",
                skills: ["Kubernetes", "Multi-Cloud", "Monitoring", "Go/Python"],
                experience: "2-7 years",
                description: "Reliability and performance at scale"
            }
        ],
        process: [
            { title: "Online Assessment", content: "DSA + Leadership Principles scenarios" },
            { title: "Technical Rounds", content: "2-3 Rounds focusing on DSA, System Design and Barking" },
            { title: "Bar Raiser", content: "Heavy focus on Amazon Leadership Principles (LP)" }
        ],
        cultureDetail: {
            wlb: "Varies by team; emphasizes impact and collaboration.",
            environment: "Engineering-driven with focus on quality and scale.",
            style: "Hybrid/remote options vary; async-friendly on many teams.",
            values: ["Customer focus", "Ownership", "High standards", "Learning mindset"],
            benefits: "Competitive pay, equity, health coverage, learning budget.",
            growth: "Clear levels, mentorship, and mobility across teams.",
            dynamics: "Autonomous teams with strong collaboration norms.",
            perks: ["Learning stipend", "Wellness benefits", "Flexible PTO", "Top-tier hardware"]
        },
        aboutDetail: {
            overview: "Engineering-led company with global products and platforms.",
            areas: ["Cloud", "Consumer", "Enterprise", "AI/ML"],
            presence: "Global offices and distributed teams across regions.",
            india: "Large engineering presence with product and platform teams.",
            stack: {
                languages: ["TypeScript", "Java", "Python", "C++"],
                frameworks: ["React", "Node.js", "Spring", "gRPC"],
                databases: ["PostgreSQL", "MySQL", "DynamoDB/Bigtable"],
                cloud: ["AWS", "GCP", "Azure"],
                tools: ["Kubernetes", "Terraform", "Prometheus", "Grafana"]
            },
            innovations: "Focus on reliability, performance, and responsible AI."
        },
        culture: "Customer Obsession, Ownership, and Frugality. High performance environment.",
        about: "Amazon is guided by four principles: customer obsession, passion for invention, and long-term thinking.",
        insights: [
            { icon: "💡", title: "Pro Tip", content: "Practice on realistic problems; validate edge cases." },
            { icon: "⚡", title: "Hiring Speed", content: "Usually fast (2-4 weeks) from first contact." }
        ]
    },
    "Google": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        desc: "World Leader in Search and AI Technology",
        cutoff: 92,
        roles: [
            {
                title: "Frontend Engineer",
                package: "32-65 LPA",
                skills: ["JavaScript", "TypeScript", "React/Angular", "Web Performance", "Accessibility"],
                experience: "2-6 years",
                description: "Deep understanding of web internals and UI architecture"
            },
            {
                title: "Security Engineer",
                package: "35-70 LPA",
                skills: ["Pentesting", "Networking", "Cloud Security", "Vulnerability Research"],
                experience: "3-7 years",
                description: "Protecting users and infrastructure at global scale"
            }
        ],
        process: [
            { title: "Phone Screen", content: "Initial technical screening (45 mins)" },
            { title: "Onsite Rounds", content: "4-5 Rounds of DSA and Googleyness (Leadership)" }
        ],
        culture: "Innovation driven. High emphasis on psychological safety and engineering excellence.",
        about: "Google's mission is to organize the world's information.",
        insights: [{ icon: "🔍", title: "Focus", content: "Algorithms and Data Structures are key here." }]
    },
    "Microsoft": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        desc: "Empowering every person and every organization on the planet",
        cutoff: 89,
        roles: [
            {
                title: "Software Engineer",
                package: "30-60 LPA",
                skills: ["Azure", "C#", ".NET", "SQL Server", "System Design"],
                experience: "1-5 years",
                description: "Building the next generation of productivity tools"
            }
        ],
        process: [{ title: "Codility Test", content: "Initial coding round" }, { title: "Technical Interview", content: "Problem solving and design" }],
        cultureDetail: {
            wlb: "High priority on work-life balance; flexible hours.",
            environment: "Growth mindset culture with heavy focus on learning.",
            style: "Collaborative and product-focused development.",
            values: ["Growth Mindset", "Diversity & Inclusion", "One Microsoft", "Making a Difference"],
            benefits: "Excellent healthcare, gym allowance, and donation matching.",
            growth: "Standardized levels (59-80) with clear promotion criteria.",
            dynamics: "Matrix organization with heavy cross-team collaboration.",
            perks: ["Volunteering time off", "Learning stipends", "Surface device discounts", "On-site healthcare"]
        },
        aboutDetail: {
            overview: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
            areas: ["Cloud (Azure)", "Productivity (Office 365)", "Gaming (Xbox)", "Hardware (Surface)"],
            presence: "HQ in Redmond, WA; offices globally.",
            india: "Major engineering centers in Bangalore, Hyderabad, and Noida.",
            stack: {
                languages: ["C#", "TypeScript", "C++", "Python", "SQL"],
                frameworks: [".NET Core", "React", "Azure Functions", "PowerShell"],
                databases: ["Azure SQL", "Cosmos DB", "SQL Server"],
                cloud: ["Microsoft Azure"],
                tools: ["VS Code", "GitHub Actions", "Azure DevOps"]
            },
            innovations: "Leaders in Cloud computing, OS development, and Enterprise AI."
        },
        culture: "Growth Mindset. Diverse and Inclusive.",
        about: "Microsoft Corporation is an American multinational technology company.",
        insights: [{ icon: "☁️", title: "Azure", content: "Knowing Azure is a huge plus." }]
    },
    "Meta": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
        desc: "Giving people the power to build community",
        cutoff: 90,
        roles: [
            {
                title: "Product Engineer",
                package: "35-70 LPA",
                skills: ["React", "GraphQL", "Product Sense", "Cross-functional Collaboration"],
                experience: "3-8 years",
                description: "Focus on user experience and rapid iteration"
            }
        ],
        process: [{ title: "Coding Round", content: "Fast-paced DSA questions" }, { title: "Product Design", content: "System design with user focus" }],
        cultureDetail: {
            wlb: "Move fast; heavy focus on personal ownership.",
            environment: "Product-centric with extreme speed of deployment.",
            style: "Hackathons and continuous code reviews.",
            values: ["Move fast", "Build social value", "Be open", "Live in the future"],
            benefits: "Competitive equity (RSUs), fertility benefits, wellness stipends.",
            growth: "Impact-based promotions; horizontal movement encouraged.",
            dynamics: "Highly iterative teams with minimal bureaucracy.",
            perks: ["Equity grants", "Remote work stipend", "Mental health support", "Innovation labs"]
        },
        aboutDetail: {
            overview: "Meta builds technologies that help people connect, find communities, and grow businesses.",
            areas: ["Instagram", "WhatsApp", "Facebook", "Reality Labs (VR/AR)"],
            presence: "Palo Alto HQ with global engineering centers.",
            india: "Large presence in Hyderabad and Gurgaon.",
            stack: {
                languages: ["PHP/Hack", "C++", "Python", "JavaScript/React"],
                frameworks: ["React Native", "PyTorch", "GraphQL", "Flow"],
                databases: ["MySQL", "Cassandra", "RocksDB", "Presto"],
                cloud: ["Custom Data Centers", "Internal Cloud Systems"],
                tools: ["Buck", "Mercurial", "Phabricator"]
            },
            innovations: "Creators of React, PyTorch, and Llama (LLMs)."
        },
        culture: "Move Fast. Be Bold.",
        about: "Meta is a social technology company.",
        insights: [{ icon: "🚀", title: "Speed", content: "High emphasis on quick problem solving." }]
    },
    "Netflix": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        desc: "The world's leading streaming entertainment service",
        cutoff: 95,
        roles: [
            {
                title: "Sr. UI Engineer",
                package: "45-90 LPA",
                skills: ["React", "Node.js", "Performance Optimization", "High-scale UI"],
                experience: "5-10 years",
                description: "Building the most loved UI in the world"
            }
        ],
        process: [{ title: "Culture Interview", content: "Famous 'No Rules Rules' culture fit" }, { title: "Deep Dive", content: "Technical focus with senior peers" }],
        cultureDetail: {
            wlb: "High performance. Expectation to work hard when needed.",
            environment: "Unfiltered feedback; focus on 'dream team'.",
            style: "Context, not Control - engineers have extreme autonomy.",
            values: ["Freedom & Responsibility", "Judgment", "Communication", "Impact"],
            benefits: "Unmatched top-of-market compensation (cash focus).",
            growth: "Impact-driven; no specific headcount for levels.",
            dynamics: "Highly technical individual contributors with high ownership.",
            perks: ["Top-tier compensation", "Unlimited vacation", "Free Netflix", "Premium relocation"]
        },
        aboutDetail: {
            overview: "Netflix is the world's leading streaming entertainment service.",
            areas: ["Streaming", "Content Production", "Gaming", "Ads"],
            presence: "Los Gatos, CA; offices in Amsterdam, Seoul, London, and Mumbai.",
            india: "Expanding hub in Mumbai for content and engineering.",
            stack: {
                languages: ["Java", "JavaScript", "Python", "Node.js"],
                frameworks: ["React", "Spring Boot", "Node.js", "Vector"],
                databases: ["Cassandra", "PostgreSQL", "MySQL", "EVCache"],
                cloud: ["Amazon Web Services (AWS)"],
                tools: ["Spinnaker", "Titus (K8s alternative)", "Kafka", "Elasticsearch"]
            },
            innovations: "Pioneers of Chaos Engineering and large-scale microservices."
        },
        culture: "Freedom and Responsibility. Context, not Control.",
        about: "Netflix is an American media services provider.",
        insights: [{ icon: "🎭", title: "Culture", content: "Reading the Netflix Culture memo is mandatory." }]
    },
    "Apple": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        desc: "Innovation in the palm of your hand",
        cutoff: 86,
        roles: [
            {
                title: "iOS Engineer",
                package: "35-75 LPA",
                skills: ["Swift", "SwiftUI", "CoreData", "Metal", "iOS SDK"],
                experience: "2-6 years",
                description: "Crafting premium mobile experiences"
            }
        ],
        process: [{ title: "Technical Screen", content: "Focus on Swift and Core OS" }, { title: "Onsite", content: "Collaborative design and coding" }],
        cultureDetail: {
            wlb: "Varies; focus on high-quality output and secrecy.",
            environment: "Design-first culture where engineering meets art.",
            style: "Deeply vertical teams with immense focus on detail.",
            values: ["Privacy", "Accessibility", "Inclusion", "Environment"],
            benefits: "Comprehensive plan; employee purchase discounts.",
            growth: "Technical tracks from ICT2 to ICT6+.",
            dynamics: "Highly collaborative within teams; silos across orgs.",
            perks: ["Product discounts", "Commuter benefits", "Health clinics", "Gym grants"]
        },
        aboutDetail: {
            overview: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables and accessories.",
            areas: ["iPhone", "Mac", "iPad", "Services", "Wearables"],
            presence: "Cupertino, CA; global retail and engineering presence.",
            india: "Large engineering centers in Hyderabad and Bangalore.",
            stack: {
                languages: ["Swift", "Objective-C", "C++", "C", "Python"],
                frameworks: ["SwiftUI", "Foundation", "Core ML", "Combine"],
                databases: ["CloudKit", "SQLite", "PostgreSQL"],
                cloud: ["iCloud (Custom/AWS/GCP)"],
                tools: ["Xcode", "Git", "Internal automation"]
            },
            innovations: "Pioneers of modern smartphone computing and custom silicon (M1/M2)."
        },
        culture: "Design and Detail oriented. Secrecy and Excellence.",
        about: "Apple is an American multinational technology company.",
        insights: [{ icon: "📱", title: "Hardware", content: "Understanding hardware interactions is valued." }]
    },
    "Accenture": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
        desc: "Delivering on the promise of technology and human ingenuity",
        cutoff: 78,
        roles: [{ title: "Cloud Consultant", package: "15-35 LPA", skills: ["Cloud Migration", "Strategy", "Client Mgmt"], experience: "2-5 years", description: "Helping clients move to the cloud" }],
        process: [{ title: "Cognitive Assessment", content: "Logic and reasoning" }, { title: "Technical Interview", content: "Case studies and tech stack" }],
        cultureDetail: {
            wlb: "Defined by project demands; emphasis on professional growth.",
            environment: "Consulting-led with heavy focus on client satisfaction.",
            style: "Structured, process-oriented, and global collaboration.",
            values: ["Client Value Creation", "One Global Network", "Integrity", "Stewardship"],
            benefits: "Global health insurance, employee share purchase plan.",
            growth: "Defined career levels from Analyst to Managing Director.",
            dynamics: "Project-based teams with rotating leadership and peers.",
            perks: ["Certifications budget", "Performance bonuses", "Employee discounts", "Global mobility"]
        },
        aboutDetail: {
            overview: "Accenture is a global professional services company with leading capabilities in digital, cloud, and security.",
            areas: ["Consulting", "Strategy", "Technology", "Operations"],
            presence: "Dublin HQ; offices in 120 countries.",
            india: "Largest presence in Bangalore, Mumbai, Chennai, and Delhi.",
            stack: {
                languages: ["Java", "Python", "JavaScript", "C#"],
                frameworks: ["Spring Boot", "React", "Angular", "Node.js"],
                databases: ["Oracle", "PostgreSQL", "MongoDB"],
                cloud: ["AWS", "Microsoft Azure", "Google Cloud"],
                tools: ["ServiceNow", "Salesforce", "Jira", "Jenkins"]
            },
            innovations: "Leaders in Enterprise transformation and Cloud First strategy."
        },
        culture: "Collaborative and client-focused.",
        about: "Accenture is a global professional services company.",
        insights: [{ icon: "🤝", title: "Consulting", content: "Communication skills are as important as tech." }]
    },
    "Adobe": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Adobe_Corporate_logo.svg",
        desc: "Changing the world through digital experiences",
        cutoff: 83,
        roles: [{ title: "Creative Software Eng", package: "25-50 LPA", skills: ["C++", "Graphics", "React"], experience: "2-6 years", description: "Empowering creators everywhere" }],
        process: [{ title: "Coding Test", content: "Competitive level DSA" }, { title: "Technical Rounds", content: "Domain specific knowledge" }],
        cultureDetail: {
            wlb: "Consistently ranked as one of the best for work-life balance.",
            environment: "People-first and inclusive with high creative energy.",
            style: "Collaboration-driven with a focus on polished UI/UX.",
            values: ["Genuine", "Exceptional", "Innovative", "Involved"],
            benefits: "Wellness programs, sabbaticals, and donation matching.",
            growth: "Career levels from Software Engineer 1 to Principal Scientist.",
            dynamics: "Product-focused squads with mixed engineering/design roles.",
            perks: ["Adobe Creative Cloud", "Sabbatical leaves", "Pet insurance", "Commuter stipends"]
        },
        aboutDetail: {
            overview: "Adobe provides content creation and document management software segments.",
            areas: ["Creative Cloud", "Experience Cloud", "Document Cloud"],
            presence: "San Jose, CA; global engineering sites.",
            india: "Large presence in Noida and Bangalore.",
            stack: {
                languages: ["C++", "JavaScript", "Objective-C", "Java", "Python"],
                frameworks: ["React", "Blink", "Skia", "Spectrum UI"],
                databases: ["Cassandra", "MongoDB", "MySQL"],
                cloud: ["Azure", "AWS"],
                tools: ["GitHub", "Jenkins", "Kubernetes"]
            },
            innovations: "Creators of PDF, Photoshop, and leaders in Digital Experience."
        },
        culture: "Creativity and Community.",
        about: "Adobe is an American multinational computer software company.",
        insights: [{ icon: "🎨", title: "Creativity", content: "Adobe loves people who build side projects." }]
    },
    "Nvidia": {
        logo: "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg",
        desc: "The world leader in AI computing",
        cutoff: 88,
        roles: [{ title: "GPU Kernel Engineer", package: "40-85 LPA", skills: ["CUDA", "C++", "Parallel Computing"], experience: "3-8 years", description: "Driving the future of AI hardware" }],
        process: [{ title: "Tech Screen", content: "Heavy C++/CUDA focus" }, { title: "Onsite", content: "High-level math and parallel design" }],
        cultureDetail: {
            wlb: "Hardworking environment; driven by massive engineering goals.",
            environment: "Intense but intellectually rewarding; 'One Nvidia'.",
            style: "Fast-paced execution with extreme technical depth.",
            values: ["Innovation", "Excellence", "Intellectual Honesty", "One Team"],
            benefits: "Competitive base and RSU grants; great health plans.",
            growth: "Fast-tracked roles for top performers in AI/Graphics.",
            dynamics: "Highly technical individual contributors in a flat hierarchy.",
            perks: ["RSU Grants", "Learning resources", "On-site food", "Advanced workstations"]
        },
        aboutDetail: {
            overview: "Nvidia specializes in the design of graphics processing units (GPUs) and AI computing chips.",
            areas: ["Gaming", "Data Center", "Professional Visualization", "Automotive"],
            presence: "Santa Clara, CA; presence in 15+ countries.",
            india: "Centers in Bangalore, Pune, and Hyderabad.",
            stack: {
                languages: ["C++", "Python", "C", "CUDA", "Verilog"],
                frameworks: ["TensorRT", "PyTorch", "vulkan", "DirectX"],
                databases: ["PostgreSQL", "MongoDB"],
                cloud: ["AWS", "Custom Clouds"],
                tools: ["Ansible", "Kubernetes", "Linux Kernel"]
            },
            innovations: "Invented the GPU; leaders in Deep Learning and Ray Tracing."
        },
        culture: "Intelligent and Fearless.",
        about: "Nvidia is a technology company that designs GPUs.",
        insights: [{ icon: "🏎️", title: "Scale", content: "Thinking in terms of massive parallelism is required." }]
    },
    "OpenAI": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
        desc: "Building safe and beneficial AGI",
        cutoff: 94,
        roles: [{ title: "Research Engineer", package: "50-120 LPA", skills: ["PyTorch", "LLMs", "Distributed Systems"], experience: "3-10 years", description: "Advancing the frontier of AI" }],
        process: [{ title: "Research Challenge", content: "Solving complex AI problems" }, { title: "Technical Onsite", content: "Interviewing with world-class engineers" }],
        cultureDetail: {
            wlb: "Intense; mission-driven with high expectations.",
            environment: "Intellectually rigorous with top AI researchers.",
            style: "Fast-moving, research-heavy, and highly collaborative.",
            values: ["AGI Focus", "Safety", "Scale", "Beneficial to Humanity"],
            benefits: "Unmatched talent density and impact-driven equity.",
            growth: "Opportunity to lead world-first AI projects.",
            dynamics: "Hybrid research-engineering teams with extreme focus.",
            perks: ["Subsidized travel", "Research compute", "Mental wellness", "Technical fellowships"]
        },
        aboutDetail: {
            overview: "OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.",
            areas: ["Large Language Models", "Reinforcement Learning", "AI Safety", "Deployment"],
            presence: "San Francisco, CA.",
            india: "No direct HQ; collaborative research presence.",
            stack: {
                languages: ["Python", "C++", "Rust", "Go"],
                frameworks: ["PyTorch", "Trident", "Triton"],
                databases: ["Redis", "PostgreSQL", "MongoDB"],
                cloud: ["Microsoft Azure"],
                tools: ["Kubernetes", "Ray", "Docker"]
            },
            innovations: "Creators of GPT-4, DALL-E, and RLHF methodologies."
        },
        culture: "Mission-driven. Extremely high bar.",
        about: "OpenAI is an AI research and deployment company.",
        insights: [{ icon: "🧠", title: "Frontier", content: "Staying updated with latest AI papers is a must." }]
    },
    "Tesla": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
        desc: "Accelerating the world's transition to sustainable energy",
        cutoff: 91,
        roles: [{ title: "Autopilot Software Eng", package: "45-85 LPA", skills: ["C++", "PyTorch", "Computer Vision"], experience: "3-8 years", description: "Developing self-driving technology" }],
        process: [{ title: "Technical Screen", content: "Deep dive into C++ and Math" }, { title: "Manager Round", content: "Project deep dives" }],
        cultureDetail: {
            wlb: "Intense; known for long hours and high-speed execution.",
            environment: "Engineering-first, 'no-nonsense' results-driven culture.",
            style: "First principles thinking applied to every problem.",
            values: ["First Principles", "Be Bold", "Accelerate", "High Integrity"],
            benefits: "Competitive salary and substantial stock options.",
            growth: "Opportunity to work on industry-defining technology.",
            dynamics: "Fast-paced, iterative, and high personal accountability.",
            perks: ["Employee car lease", "Stock grants", "Global travel", "On-site charging"]
        },
        aboutDetail: {
            overview: "Tesla designs and manufactures electric vehicles, battery energy storage from home to grid-scale, and solar products.",
            areas: ["Electric Vehicles", "Energy Storage", "Solar Energy", "AI & Robotics"],
            presence: "Austin, TX (HQ); global Gigafactories.",
            india: "Emerging hubs in Bangalore and Pune.",
            stack: {
                languages: ["C++", "Python", "Lua", "Verilog"],
                frameworks: ["PyTorch", "React", "Linux Kernel", "Docker"],
                databases: ["PostgreSQL", "ClickHouse", "InfluxDB"],
                cloud: ["Custom On-prem", "AWS"],
                tools: ["Bazel", "Git", "Advanced Math Libraries"]
            },
            innovations: "Leaders in Self-driving AI and Sustainable Energy storage."
        },
        culture: "Hardcore. First principles thinking.",
        about: "Tesla builds electric vehicles and clean energy products.",
        insights: [{ icon: "🚗", title: "Autopilot", content: "Deep knowledge of low-level optimization is key." }]
    },
    "SpaceX": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg",
        desc: "Making humanity multi-planetary",
        cutoff: 93,
        roles: [{ title: "Starlink Software Eng", package: "40-80 LPA", skills: ["C++", "Networking", "Embedded Systems"], experience: "2-7 years", description: "Building global satellite internet" }],
        process: [{ title: "Technical Quiz", content: "Advanced physics and coding" }, { title: "Onsite", content: "Intense technical problem solving" }],
        cultureDetail: {
            wlb: "Very intense; mission-driven work with high impact.",
            environment: "Hardcore engineering with extreme talent density.",
            style: "Fast-moving, iterative, and hardware-focused software.",
            values: ["Mars Focus", "Simplify", "Iterate Fast", "Integrity"],
            benefits: "Great healthcare and unique mission-driven equity.",
            growth: "Lead critical rocket or satellite missions.",
            dynamics: "Highly technical individual contributors with cross-org visibility.",
            perks: ["Rocket launch viewings", "On-site food", "Technical stipends", "Mission awards"]
        },
        aboutDetail: {
            overview: "SpaceX designs, manufactures and launches advanced rockets and spacecraft.",
            areas: ["Rockets (Falcon 9/Starship)", "Satellites (Starlink)", "Human Spaceflight"],
            presence: "Hawthorne, CA; Starbase (Texas).",
            india: "Collaborative research and limited satellite trials.",
            stack: {
                languages: ["C++", "C", "Python", "JavaScript"],
                frameworks: ["React", "Angular", "gRPC"],
                databases: ["Postgres", "Redis"],
                cloud: ["Custom Ground Infrastructure", "AWS"],
                tools: ["Linux RT Patch", "Internal Testing Tools"]
            },
            innovations: "First reusable orbital rocket; world's largest satellite constellation."
        },
        culture: "Mission focused. Fast paced.",
        about: "SpaceX designs, manufactures and launches advanced rockets.",
        insights: [{ icon: "🚀", title: "Mars", content: "Passion for space exploration is a requirement." }]
    },
    "IBM": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
        desc: "Innovating the future of hybrid cloud and AI",
        cutoff: 80,
        roles: [{ title: "Cloud Developer", package: "18-40 LPA", skills: ["Java", "Kubernetes", "OpenShift"], experience: "2-5 years", description: "Building enterprise cloud solutions" }],
        process: [{ title: "Cognitive Ability", content: "IBM IPAT Test" }, { title: "Technical Interview", content: "Enterprise architecture focus" }],
        cultureDetail: {
            wlb: "Good work-life balance; emphasis on physical and mental health.",
            environment: "Professional, heritage-rich, and research-driven.",
            style: "Structured, global teamwork with an emphasis on hybrid work.",
            values: ["Dedication to Client Success", "Innovation that matters", "Trust and personal responsibility"],
            benefits: "Comprehensive retirement and health plans; global resources.",
            growth: "Structured career paths from Band 6 to Distinguished Engineer/Fellow.",
            dynamics: "Global teams with specialized expertise in enterprise tech.",
            perks: ["Patent rewards", "IBM Watson access", "Remote work", "Certification grants"]
        },
        aboutDetail: {
            overview: "IBM is a leading global hybrid cloud and AI, and business services provider.",
            areas: ["Hybrid Cloud", "AI (Watson)", "Consulting", "Quantum Computing"],
            presence: "Armonk, NY (HQ); global labs.",
            india: "Major engineering hubs in Bangalore, Pune, and Gurgaon.",
            stack: {
                languages: ["Java", "Python", "Go", "C++", "PL/SQL"],
                frameworks: ["Spring Boot", "React", "Node.js", "Hyperledger"],
                databases: ["Db2", "PostgreSQL", "MongoDB", "Cloudant"],
                cloud: ["IBM Cloud", "RedHat OpenShift"],
                tools: ["Kubernetes", "Ansible", "Terraform"]
            },
            innovations: "Creators of Fortran, SQL, Relational DBs, and leaders in Quantum."
        },
        culture: "Think. Trust and personal responsibility.",
        about: "IBM is a global technology and innovation company.",
        insights: [{ icon: "☁️", title: "Hybrid Cloud", content: "Understanding RedHat OpenShift is a huge plus." }]
    },
    "Oracle": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
        desc: "Integrated cloud applications and platform services",
        cutoff: 82,
        roles: [{ title: "Database Engineer", package: "22-50 LPA", skills: ["SQL", "Java", "C++", "Distributed Systems"], experience: "3-7 years", description: "Architecting global database systems" }],
        process: [{ title: "OA", content: "Hard DSA questions" }, { title: "Technical Rounds", content: "System internals and design" }],
        cultureDetail: {
            wlb: "Competitive environment; focus on product delivery and scale.",
            environment: "Technology-first with major focus on database and cloud reliability.",
            style: "Deeply technical, focused on performance and security.",
            values: ["Customer Success", "Integrity", "Accountability", "Innovation"],
            benefits: "Complete health coverage, ESPP, and 401k matching.",
            growth: "Technical tracks up to Architect and Vice President of Engineering.",
            dynamics: "Product-centric teams with high engineering standards.",
            perks: ["Cloud credits", "Learning subscriptions", "Global mobility", "Fitness centers"]
        },
        aboutDetail: {
            overview: "Oracle is a multinational computer technology corporation that sells database software and technology, and cloud systems.",
            areas: ["Oracle Database", "Oracle Cloud Infrastructure (OCI)", "ERP", "Java"],
            presence: "Austin, TX (HQ); global data centers.",
            india: "Huge presence in Bangalore, Hyderabad, and Mumbai.",
            stack: {
                languages: ["Java", "C++", "C", "SQL", "PL/SQL"],
                frameworks: ["Oracle JET", "Spring Boot", "GraalVM"],
                databases: ["Oracle Autonomous DB", "MySQL", "Berkeley DB"],
                cloud: ["Oracle Cloud Infrastructure (OCI)"],
                tools: ["Terraform", "Docker", "Git"]
            },
            innovations: "World's #1 Database; pioneers of Autonomous Database technology."
        },
        culture: "Technology first. Global scale.",
        about: "Oracle is a multinational computer technology corporation.",
        insights: [{ icon: "🗄️", title: "DB", content: "Deep dive into SQL engine internals is expected." }]
    },
    "Salesforce": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
        desc: "The world's #1 CRM platform",
        cutoff: 85,
        roles: [{ title: "Platforms Engineer", package: "28-55 LPA", skills: ["Java", "React", "Cloud Design"], experience: "2-6 years", description: "Building the engine behind Sales Cloud" }],
        process: [{ title: "Technical OA", content: "Coding and logic" }, { title: "Onsite", content: "Whiteboard coding and fit" }],
        cultureDetail: {
            wlb: "Excellent work-life balance; known for 'Ohana' (family) culture.",
            environment: "Inclusive, supportive, and philanthropic.",
            style: "Collaborative and customer-centric software development.",
            values: ["Trust", "Customer Success", "Innovation", "Equality", "Sustainability"],
            benefits: "Wellness grants, volunteering time, and comprehensive health.",
            growth: "Clear progression from Associate Engineer to Distinguished Engineer.",
            dynamics: "Agile teams with a focus on trust and accountability.",
            perks: ["VTO (Volunteer Time Off)", "Wellness stipend", "Certification awards", "Free snacks"]
        },
        aboutDetail: {
            overview: "Salesforce is a cloud-based software company which provides customer relationship management (CRM) service.",
            areas: ["Sales Cloud", "Service Cloud", "Einstein AI", "MuleSoft/Slack/Tableau"],
            presence: "San Francisco, CA (Salesforce Tower); global presence.",
            india: "Large hubs in Hyderabad, Bangalore, and Gurgaon.",
            stack: {
                languages: ["Java", "Apex", "JavaScript", "Python"],
                frameworks: ["Lightning Web Components (LWC)", "React", "Spring Boot"],
                databases: ["Oracle (Relational)", "Apache HBase", "PostgreSQL"],
                cloud: ["AWS", "Salesforce Core Infrastructure"],
                tools: ["Jenkins", "Git", "Splunk"]
            },
            innovations: "Pioneers of the SaaS model and enterprise multi-tenancy."
        },
        culture: "Ohana (Family). Giving back.",
        about: "Salesforce is a cloud-based software company.",
        insights: [{ icon: "☁️", title: "CRM", content: "Knowledge of Saas multi-tenancy is useful." }]
    },
    "Spotify": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
        desc: "Unlocking the potential of human creativity",
        cutoff: 87,
        roles: [{ title: "Backend Engineer", package: "35-65 LPA", skills: ["Java", "Squad-based Dev", "System Design"], experience: "3-8 years", description: "Building music streaming at scale" }],
        process: [{ title: "System Design", content: "Focus on scalability" }, { title: "Peer Interview", content: "Collaboration and T-shaped skills" }],
        cultureDetail: {
            wlb: "High importance; flexible working models and time off.",
            environment: "Autonomous, decentralized, and diverse.",
            style: "Squads and Tribes model; high alignment, high autonomy.",
            values: ["Innovative", "Collaborative", "Sincere", "Passionate", "Playful"],
            benefits: "Global parental leave and inclusive health benefits.",
            growth: "Impact-driven development within specialized squads.",
            dynamics: "T-shaped engineers in cross-functional autonomous teams.",
            perks: ["Free Spotify Premium", "Personal development budget", "Sabbaticals", "Live music events"]
        },
        aboutDetail: {
            overview: "Spotify is a proprietary Swedish audio streaming and media services provider.",
            areas: ["Music Streaming", "Podcast Platform", "Audiobooks", "AI Recommendations"],
            presence: "Stockholm (HQ); offices in London, NY, and more.",
            india: "Growing hubs in Mumbai and Bangalore.",
            stack: {
                languages: ["Java", "Python", "JavaScript", "Objective-C", "Swift"],
                frameworks: ["React", "Apollo", "Helio"],
                databases: ["Google Spanner", "PostgreSQL", "Cassandra"],
                cloud: ["Google Cloud Platform (GCP)"],
                tools: ["Docker", "Kubernetes", "Backstage", "Kafka"]
            },
            innovations: "Pioneers of the Squad technical culture and Scannable music codes."
        },
        culture: "Agile. Squads and Tribes.",
        about: "Spotify is a digital music, podcast, and video service.",
        insights: [{ icon: "🎵", title: "Scale", content: "Focus on user-centric system design." }]
    },
    "Uber": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg",
        desc: "Igniting opportunity by setting the world in motion",
        cutoff: 89,
        roles: [{ title: "Software Engineer - L4", package: "35-70 LPA", skills: ["Go", "Java", "Distributed Systems"], experience: "2-6 years", description: "Solving real-time logistics problems" }],
        process: [{ title: "CodingOA", content: "LeetCode Hard problems" }, { title: "System Design", content: "Real-time dispatch systems" }],
        cultureDetail: {
            wlb: "Challenging and fast-paced; high focus on ownership.",
            environment: "Engineering-led with a focus on data-driven decisions.",
            style: "High-velocity development with extreme technical scale.",
            values: ["Go-Getter", "Data Driven", "Build with Heart", "One Uber"],
            benefits: "Comprehensive health, stock options, and Uber credits.",
            growth: "Clear technical ladder with significant growth opportunities.",
            dynamics: "Highly technical individual contributors with cross-team impact.",
            perks: ["Uber credits", "Learning budget", "Wellness stipend", "Global events"]
        },
        aboutDetail: {
            overview: "Uber connects people to ripples of movement, offering rides, delivery, and freight.",
            areas: ["Mobility (Rides)", "Delivery (Eats)", "Freight", "Advanced Tech"],
            presence: "San Francisco, CA (HQ); global operations.",
            india: "Large engineering centers in Bangalore and Hyderabad.",
            stack: {
                languages: ["Go", "Java", "Python", "Swift"],
                frameworks: ["Ribs", "Cadence", "React"],
                databases: ["DocDB", "Schemaless", "MySQL", "Cassandra"],
                cloud: ["Custom On-prem", "AWS", "GCP"],
                tools: ["Jenkins", "Phabricator", "Hadoop", "Spark"]
            },
            innovations: "Pioneers of real-time marketplace engineering at scale."
        },
        culture: "Go-getter. Data driven.",
        about: "Uber connects people to ripples of movement.",
        insights: [{ icon: "🚕", title: "Latency", content: "Optimize for milliseconds and massive scale." }]
    },
    "Airbnb": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg",
        desc: "Belong anywhere",
        cutoff: 88,
        roles: [{ title: "UI Engineer", package: "35-70 LPA", skills: ["React", "TypeScript", "Accessibility"], experience: "3-8 years", description: "Designing the home for travellers" }],
        process: [{ title: "Take-home Project", content: "Functional UI build" }, { title: "Technical Deep Dive", content: "Walking through design choices" }],
        cultureDetail: {
            wlb: "Highly balanced; focus on creative and mindful work.",
            environment: "Design-led, belonging-focused, and highly collaborative.",
            style: "Deeply collaborative with a focus on human-centric design.",
            values: ["Champion the Mission", "Be a Host", "Embrace the Adventure", "Be a Cereal Entrepreneur"],
            benefits: "Travel credits, comprehensive health, and mental wellness.",
            growth: "Career tracks for individual contributors and managers.",
            dynamics: "Highly integrated engineering, design, and product teams.",
            perks: ["Annual travel credits", "Volunteer days", "Learning budget", "Remote work flexibility"]
        },
        aboutDetail: {
            overview: "Airbnb is an online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities.",
            areas: ["Homestays", "Experiences", "Luxury Stays", "Adventures"],
            presence: "San Francisco, CA (HQ); global offices.",
            india: "Centers in Gurgaon and Bangalore.",
            stack: {
                languages: ["Ruby", "Java", "JavaScript", "TypeScript", "Python"],
                frameworks: ["Ruby on Rails", "React", "DLS (Design Language System)"],
                databases: ["MySQL", "Redis", "Amazon DynamoDB"],
                cloud: ["Amazon Web Services (AWS)"],
                tools: ["Airflow", "Enzyme", "Git"]
            },
            innovations: "Leaders in shared economy and modern design systems."
        },
        culture: "Design-led culture. Guest first.",
        about: "Airbnb is an online marketplace for lodging.",
        insights: [{ icon: "🏡", title: "Design", content: "High polish and user empathy is required." }]
    },
    "J.P. Morgan": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008-1-.svg",
        desc: "A leader in global financial services",
        cutoff: 81,
        roles: [{ title: "FinTech Developer", package: "20-45 LPA", skills: ["Java", "Spring Boot", "Microservices"], experience: "2-6 years", description: "Building the future of digital banking" }],
        process: [{ title: "HireVue", content: "Video interview + coding" }, { title: "Superday", content: "Series of back-to-back interviews" }],
        cultureDetail: {
            wlb: "Varies by department; emphasis on dedication and professional conduct.",
            environment: "Professional, hierarchical, and mission-driven.",
            style: "Structured, stable, and focused on security and scale.",
            values: ["Exceptional Client Service", "Operational Excellence", "Integrity", "Fairness"],
            benefits: "Comprehensive retirement, health plans, and global resources.",
            growth: "Structured levels from Analyst to Executive Director/MD.",
            dynamics: "Large global teams with specialized FinTech expertise.",
            perks: ["Matching 401k", "Global mobility", "Learning resources", "Health centers"]
        },
        aboutDetail: {
            overview: "JPMorgan Chase & Co. is a leading global financial services firm and one of the largest banking institutions in the United States.",
            areas: ["Asset Management", "Commercial Banking", "Investment Banking", "Card Services"],
            presence: "New York, NY (HQ); global financial centers.",
            india: "Huge technology centers in Mumbai, Bangalore, and Hyderabad.",
            stack: {
                languages: ["Java", "Python", "JavaScript", "C++"],
                frameworks: ["Spring Boot", "React", "Angular", "Node.js"],
                databases: ["Oracle", "PostgreSQL", "Cassandra"],
                cloud: ["AWS", "Azure", "On-prem Cloud"],
                tools: ["Jenkins", "Jira", "Splunk", "Kubernetes"]
            },
            innovations: "Leaders in Blockchain for finance (Onyx) and Modern Banking APIs."
        },
        culture: "Integrity and Excellence.",
        about: "J.P. Morgan is a multinational investment bank.",
        insights: [{ icon: "🏦", title: "Finance", content: "Domain knowledge of banking is a plus." }]
    },
    "Goldman Sachs": {
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg",
        desc: "Leading global investment banking firm",
        cutoff: 84,
        roles: [{ title: "Quant Engineer", package: "25-55 LPA", skills: ["C++", "Python", "Algorithms", "Stats"], experience: "2-7 years", description: "Developing algorithmic trading platforms" }],
        process: [{ title: "CoderPad", content: "Live coding with engineer" }, { title: "Series of Technicals", content: "Deep math and logic focus" }],
        cultureDetail: {
            wlb: "Demanding; rewards high impact and precision.",
            environment: "Intellectually competitive and meritocratic.",
            style: "Fast-paced, data-heavy, and highly technical.",
            values: ["Client Interests First", "Integrity", "Excellence", "Teamwork"],
            benefits: "Top-tier health and retirement plans; global support.",
            growth: "Opportunity to advance from Analyst to Partner.",
            dynamics: "Highly technical peers in a high-stakes environment.",
            perks: ["Subsidized travel", "On-site food", "Learning budget", "Performance bonuses"]
        },
        aboutDetail: {
            overview: "The Goldman Sachs Group, Inc. is a leading global investment banking, securities and investment management firm.",
            areas: ["Investment Banking", "Global Markets", "Asset Management", "Consumer & Wealth Mgmt"],
            presence: "New York, NY (HQ); offices in all major financial centers.",
            india: "Strategic centers in Bangalore and Hyderabad.",
            stack: {
                languages: ["Java", "C++", "Python", "Slang (Internal)", "Erlang"],
                frameworks: ["React", "Spring Boot", "Vertex"],
                databases: ["Sybase", "PostgreSQL", "MongoDB", "MemSQL"],
                cloud: ["AWS", "Custom Clouds"],
                tools: ["Ansible", "Kubernetes", "Git"]
            },
            innovations: "Pioneers of Algorithmic Trading and custom financial modeling languages."
        },
        culture: "Teamwork and Client Service.",
        about: "Goldman Sachs is a leading global investment bank.",
        insights: [{ icon: "💰", title: "Algorithms", content: "Mastery of time-complexity is essential." }]
    }
};

const marketCompanies = []; // Not used anymore as we go direct to Insights

function initMarketData() {
    renderCompanyTable();
    populateCompanyDropdown();
}

function renderCompanyTable() {
    const tbody = document.getElementById('market-data-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    marketCompanies.forEach(item => {
        const row = document.createElement('tr');

        let statusBadge = '';
        let actionBtn = '';

        if (item.status === 'Eligible') {
            statusBadge = '<span class="badge success">ELIGIBLE</span>';
            actionBtn = `<button class="btn-primary-sm" onclick="alert('Applying to ${item.name}...')">Apply</button>`;
        } else if (item.status === 'Upskill') {
            statusBadge = '<span class="badge warning">UPSKILL</span>';
            actionBtn = `<button class="roadmap-btn-sm" onclick="viewCompanyInsights('${item.name}')">View Gaps</button>`;
        } else {
            statusBadge = '<span class="badge danger">NOT READY</span>';
            actionBtn = `<button class="roadmap-btn-sm" onclick="viewCompanyInsights('${item.name}')">View Gaps</button>`;
        }

        row.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.logo}" style="width:24px; height:24px; object-fit:contain;">
                    ${item.name}
                </div>
            </td>
            <td>${item.role}</td>
            <td>${item.cutoff}%</td>
            <td>${statusBadge}</td>
            <td>
                <div style="display:flex; gap:8px;">
                    ${actionBtn}
                    <button class="btn-sm" onclick="viewCompanyInsights('${item.name}')" style="background:rgba(255,255,255,0.05); color:white; border:1px solid var(--border);">Insights</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterCompanies(val) {
    const query = val.toLowerCase();
    const rows = document.querySelectorAll('#market-data-body tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

function viewCompanyInsights(companyName) {
    // Hide main, show detail
    document.getElementById('company-intel-main').classList.add('hidden');
    document.getElementById('company-intel-detail').classList.remove('hidden');

    // Update tab title
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = "Company Insights";

    // Load company data
    selectCompany(companyName);
}

function populateCompanyDropdown() {
    const opts = document.getElementById('company-dropdown-options');
    if (!opts) return;

    opts.innerHTML = '';
    Object.keys(companyInsightsData).forEach(key => {
        const item = companyInsightsData[key];
        const div = document.createElement('div');
        div.className = 'custom-option';
        div.onclick = (e) => {
            e.stopPropagation();
            selectCompany(key);
            toggleCompanyDropdown(null, false);
        };
        div.innerHTML = `
            <img src="${item.logo}" style="width:20px; height:20px; object-fit:contain; border-radius:4px;">
            <span>${key}</span>
        `;
        opts.appendChild(div);
    });
}

function toggleCompanyDropdown(e, force) {
    if (e) e.stopPropagation();
    const opts = document.getElementById('company-dropdown-options');
    if (!opts) return;

    if (force !== undefined) {
        if (force) opts.classList.remove('hidden');
        else opts.classList.add('hidden');
    } else {
        opts.classList.toggle('hidden');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', () => toggleCompanyDropdown(null, false));

function selectCompany(name) {
    const data = companyInsightsData[name];
    if (!data) return;

    // Update Trigger
    const selectedName = document.getElementById('selected-company-name');
    const selectedLogo = document.getElementById('dropdown-company-logo');
    if (selectedName) selectedName.innerText = name;
    if (selectedLogo) {
        selectedLogo.src = data.logo;
        selectedLogo.style.display = 'block';
    }

    // Update Header
    document.getElementById('detail-company-logo').src = data.logo;
    document.getElementById('detail-company-name').innerText = name;
    document.getElementById('detail-company-desc').innerText = data.desc;

    document.getElementById('company-detail-content').classList.remove('hidden');

    // Load default sub-tab
    switchCompanySubTab('roles', name);
}

function switchCompanySubTab(tabId, companyName) {
    if (!companyName) {
        companyName = document.getElementById('detail-company-name').innerText;
    }
    let data = companyInsightsData[companyName];
    const container = document.getElementById('company-sub-content');
    if (!container || !data) return;

    // --- Fallback Mechanism for Detailed Data ---
    const defaultCultureDetail = {
        wlb: "Varies by team; emphasizes impact and collaboration.",
        environment: "Engineering-driven with focus on quality and scale.",
        style: "Hybrid/remote options vary; async-friendly on many teams.",
        values: ["Customer focus", "Ownership", "High standards", "Learning mindset"],
        benefits: "Competitive pay, equity, health coverage, learning budget.",
        growth: "Clear levels, mentorship, and mobility across teams.",
        dynamics: "Autonomous teams with strong collaboration norms.",
        perks: ["Learning stipend", "Wellness benefits", "Flexible PTO", "Top-tier hardware"]
    };

    const defaultAboutDetail = {
        overview: "Engineering-led company with global products and platforms.",
        areas: ["Cloud", "Consumer", "Enterprise", "AI/ML"],
        presence: "Global offices and distributed teams across regions.",
        india: "Large engineering presence with product and platform teams.",
        stack: {
            languages: ["TypeScript", "Java", "Python", "C++"],
            frameworks: ["React", "Node.js", "Spring", "gRPC"],
            databases: ["PostgreSQL", "MySQL", "DynamoDB/Bigtable"],
            cloud: ["AWS", "GCP", "Azure"],
            tools: ["Kubernetes", "Terraform", "Prometheus", "Grafana"]
        },
        innovations: "Focus on reliability, performance, and responsible AI."
    };

    const culture = data.cultureDetail || defaultCultureDetail;
    const about = data.aboutDetail || defaultAboutDetail;

    // Update Nav
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
        const tid = btn.innerText.toLowerCase().trim();
        if (tid === tabId || (tabId === 'hiring process' && tid === 'process') || (tid === tabId.split(' ')[0])) {
            btn.classList.add('active');
        }
    });

    container.innerHTML = '';

    // Dynamic User Analysis for Eligibility
    const userScore = user.atsScore || 88;
    const isEligible = userScore >= data.cutoff;

    if (tabId === 'roles') {
        data.roles.forEach(role => {
            const card = document.createElement('div');
            card.className = 'insight-role-card';

            let actionHtml = '';
            if (isEligible) {
                actionHtml = `
                    <div style="display:flex; gap:12px; align-items:center;">
                        <span class="badge success">ELIGIBLE</span>
                        <button class="btn-primary-sm" onclick="alert('Success! Your application for ${role.title} at ${companyName} has been submitted directly.')">Direct Apply</button>
                    </div>
                `;
            } else {
                actionHtml = `
                    <div style="display:flex; gap:12px; align-items:center;">
                        <span class="badge warning">GAP: ${data.cutoff - userScore}% Score</span>
                        <button class="roadmap-btn-sm" onclick="switchTab('roadmap')"><i data-lucide="zap"></i> Upskill Now</button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="role-header">
                    <div>
                        <h3>${role.title}</h3>
                        <p class="text-muted-sm">${data.desc}</p>
                    </div>
                    <div style="text-align:right">
                         <span class="package-badge">${role.package}</span>
                         <div style="margin-top:8px;">${actionHtml}</div>
                    </div>
                </div>
                <div class="required-skills-row">
                    <h4><i data-lucide="code-2"></i> Required Skills</h4>
                    <div class="skill-pills">
                        ${role.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
                    </div>
                </div>
                <div class="role-meta-grid">
                    <div class="meta-item"><i data-lucide="clock"></i> Experience: ${role.experience}</div>
                    <div class="meta-item"><i data-lucide="target"></i> ATS Cutoff: ${data.cutoff}%</div>
                </div>
                <p class="text-muted-sm" style="margin-bottom:1.5rem;">${role.description}</p>
            `;
            container.appendChild(card);
        });
    } else if (tabId === 'process' || tabId === 'hiring process') {
        data.process.forEach(p => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.innerHTML = `
                <div class="insight-icon">🎯</div>
                <div class="insight-content">
                    <h4>${p.title}</h4>
                    <p>${p.content}</p>
                </div>
            `;
            container.appendChild(item);
        });
    } else if (tabId === 'culture') {
        container.innerHTML = `
            <div class="insight-header-row">
                <i data-lucide="users"></i>
                <h3 class="section-title-sm">Work Culture & Environment</h3>
            </div>
            
            <div class="culture-section-card">
                <div class="culture-info-group">
                    <h4>Work-Life Balance</h4>
                    <p>${culture.wlb}</p>
                </div>
                <div class="culture-info-group">
                    <h4>Work Environment</h4>
                    <p>${culture.environment}</p>
                </div>
                <div class="culture-info-group">
                    <h4>Working Style</h4>
                    <p>${culture.style}</p>
                </div>
            </div>

            <div class="insight-header-row">
                <i data-lucide="star"></i>
                <h3 class="section-title-sm">Core Values</h3>
            </div>
            
            <div class="culture-section-card">
                <div class="values-grid">
                    ${culture.values.map(v => `
                        <div class="value-item">
                            <i data-lucide="arrow-right"></i>
                            <span>${v}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="culture-grid">
                <div class="culture-mini-card">
                    <h4><i data-lucide="heart"></i> Benefits & Wellness</h4>
                    <p>${culture.benefits}</p>
                </div>
                <div class="culture-mini-card">
                    <h4><i data-lucide="trending-up"></i> Career Growth</h4>
                    <p>${culture.growth}</p>
                </div>
            </div>

            <div class="culture-mini-card" style="margin-bottom: 1.5rem;">
                <h4><i data-lucide="briefcase"></i> Team Dynamics</h4>
                <p>${culture.dynamics}</p>
            </div>

            <div class="insight-header-row">
                <i data-lucide="settings"></i>
                <h3 class="section-title-sm">Perks & Benefits</h3>
            </div>
            
            <div class="culture-section-card">
                <div class="perks-list">
                    ${culture.perks.map(p => `
                        <div class="perk-item">
                            <i data-lucide="arrow-right"></i>
                            <span>${p}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (tabId === 'about') {
        container.innerHTML = `
            <div class="about-box">
                <h3 class="section-title-sm">About Company</h3>
                <div class="culture-info-group" style="margin-top:1.5rem;">
                    <h4>Overview</h4>
                    <p>${about.overview}</p>
                </div>
                <div class="culture-info-group">
                    <h4>Business Areas</h4>
                    <div class="about-pills">
                        ${about.areas.map(a => `<span class="about-pill">${a}</span>`).join('')}
                    </div>
                </div>
                <div class="culture-info-group">
                    <h4>Global Presence</h4>
                    <p>${about.presence}</p>
                </div>
                <div class="culture-info-group">
                    <h4>India Operations</h4>
                    <p>${about.india}</p>
                </div>
            </div>

            <div class="stack-card">
                <div class="stack-header">
                    <i data-lucide="code-2" style="color:var(--primary)"></i>
                    <h3 style="font-size:1.2rem;">Technology Stack</h3>
                </div>
                <div class="stack-grid">
                    <div class="stack-group">
                        <h5><i data-lucide="terminal"></i> Programming Languages</h5>
                        <div class="stack-pills">
                            ${about.stack.languages.map(l => `<span class="tech-pill blue">${l}</span>`).join('')}
                        </div>
                    </div>
                    <div class="stack-group">
                        <h5><i data-lucide="layers"></i> Frameworks & Libraries</h5>
                        <div class="stack-pills">
                            ${about.stack.frameworks.map(f => `<span class="tech-pill green">${f}</span>`).join('')}
                        </div>
                    </div>
                    <div class="stack-group">
                        <h5><i data-lucide="database"></i> Databases</h5>
                        <div class="stack-pills">
                            ${about.stack.databases.map(d => `<span class="tech-pill purple">${d}</span>`).join('')}
                        </div>
                    </div>
                    <div class="stack-group">
                        <h5><i data-lucide="cloud"></i> Cloud & Infrastructure</h5>
                        <div class="stack-pills">
                            ${about.stack.cloud.map(c => `<span class="tech-pill orange">${c}</span>`).join('')}
                        </div>
                    </div>
                    <div class="stack-group">
                        <h5><i data-lucide="settings"></i> Tools & DevOps</h5>
                        <div class="stack-pills">
                            ${about.stack.tools.map(t => `<span class="tech-pill gray">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="culture-info-group" style="margin-top: 2rem;">
                <h4>Key Innovations</h4>
                <p>${about.innovations}</p>
            </div>
        `;
    } else if (tabId === 'insights') {
        data.insights.forEach(ins => {
            const item = document.createElement('div');
            item.className = 'insight-item';
            item.innerHTML = `
                <div class="insight-icon">${ins.icon}</div>
                <div class="insight-content">
                    <h4>${ins.title}</h4>
                    <p>${ins.content}</p>
                </div>
            `;
            container.appendChild(item);
        });
    } else {
        container.innerHTML = `<div class="insight-item">Coming Soon: ${tabId} details for ${companyName}</div>`;
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Modify switchTab to open Company Insights directly
const originalSwitchTab = switchTab;
window.switchTab = function (tabId) {
    if (tabId === 'companies') {
        // Direct jump to Insights
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        const target = document.getElementById('companies');
        if (target) {
            target.classList.remove('hidden');
            setTimeout(() => target.classList.add('active'), 10);

            // Show only the detail view
            document.getElementById('company-intel-main').classList.add('hidden');
            document.getElementById('company-intel-detail').classList.remove('hidden');

            // Default to Amazon if nothing is selected, else stay on current
            const currentEl = document.getElementById('selected-company-name');
            const current = currentEl ? currentEl.innerText : 'Select a Company';
            if (current === 'Select a Company') {
                selectCompany('Amazon');
            } else {
                selectCompany(current);
            }
        }

        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.innerText = "Company Insights";

        // Handle nav active state manually since we bypassed original logic
        const navItem = Array.from(document.querySelectorAll('.nav-item')).find(n => n.getAttribute('onclick') && n.getAttribute('onclick').includes("'companies'"));
        if (navItem) navItem.classList.add('active');

        if (typeof handleMenuClose === 'function') handleMenuClose();
        return;
    }
    originalSwitchTab(tabId);
};


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

// --- THEME LOGIC ---
function toggleTheme() {
    const isLight = document.body.dataset.theme === 'light';
    const newTheme = isLight ? 'dark' : 'light';

    document.body.dataset.theme = newTheme;
    localStorage.setItem('skillhire_theme', newTheme);
    updateThemeIcon();

    // Update switch if it exists
    const themeToggle = document.getElementById('settings-theme-toggle');
    if (themeToggle) themeToggle.checked = newTheme === 'dark';
}

function updateThemeIcon() {
    const isLight = document.body.dataset.theme === 'light';
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        const icon = isLight ? 'moon' : 'sun';
        btn.innerHTML = `<i data-lucide="${icon}"></i>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// --- SETTINGS NAVIGATION ---
function switchSettingsTab(settingId) {
    // 1. Sidebar Active State
    if (event) {
        const navItems = document.querySelectorAll('.settings-nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        // Handle click on icon or text
        const clickedItem = event.target.closest('.settings-nav-item');
        if (clickedItem) clickedItem.classList.add('active');
    }

    // 2. Switch Content Views
    const views = document.querySelectorAll('.settings-view');
    views.forEach(v => v.classList.add('hidden'));

    // Safety check if settingId is just 'settings' (from main nav) -> default to 'profile'
    if (settingId === 'settings') settingId = 'profile';

    const target = document.getElementById(`settings-view-${settingId}`);
    if (target) {
        target.classList.remove('hidden');
    } else {
        // Fallback
        const profile = document.getElementById('settings-view-profile');
        if (profile) profile.classList.remove('hidden');
    }
}

// --- SETTINGS FEATURES ---
function selectCursor(el, type) {
    document.querySelectorAll('.cursor-option').forEach(opt => opt.classList.remove('active'));
    if (el) el.classList.add('active');

    document.body.classList.remove('cursor-cyan', 'cursor-purple', 'cursor-gold');
    if (type !== 'default') {
        document.body.classList.add(`cursor-${type}`);
    }
    localStorage.setItem('skillhire_cursor', type);
}

// Initialize Settings & Theme
document.addEventListener('DOMContentLoaded', () => {
    // Load Cursor
    const savedCursor = localStorage.getItem('skillhire_cursor');
    if (savedCursor && savedCursor !== 'default') {
        document.body.classList.add(`cursor-${savedCursor}`);
        // Visual indicator update is handled by the buttons' onclick, 
        // but for initial load we might want to highlight the right box.
        // Doing this simply:
        /*
        const opts = document.querySelectorAll('.cursor-option span');
        opts.forEach(o => { 
           if(o.innerText.toLowerCase().includes(savedCursor)) o.parentElement.classList.add('active');
        });
        */
    }

    // Sync Theme Toggle
    setTimeout(() => {
        const themeToggle = document.getElementById('settings-theme-toggle');
        if (themeToggle) {
            themeToggle.checked = document.body.dataset.theme === 'dark';
        }
    }, 500);
});

// Initialize Theme (Immediate)
const savedTheme = localStorage.getItem('skillhire_theme') || 'dark';
document.body.dataset.theme = savedTheme;
updateThemeIcon();
