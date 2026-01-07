// FIREBASE CONFIG (Replace with yours from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSy...", 
    authDomain: "skillhire-pro.firebaseapp.com",
    projectId: "skillhire-pro",
    appId: "1:..."
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// UI Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const scanner = document.getElementById('scanner');
const dashboard = document.getElementById('dashboard');
const loginBtn = document.getElementById('login-btn');

// Google Login Logic
loginBtn.onclick = () => {
    auth.signInWithPopup(provider).then((result) => {
        document.getElementById('user-info').classList.remove('hidden');
        loginBtn.classList.add('hidden');
        document.getElementById('user-name').innerText = result.user.displayName;
        document.getElementById('user-pic').src = result.user.photoURL;
    });
};

// File Upload & Scan Animation
dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => handleAnalysis(e.target.files[0]);

async function handleAnalysis(file) {
    if (!file) return;
    
    // UI Feedback
    scanner.style.display = 'block';
    dropZone.classList.add('opacity-50');

    // MOCK API DELAY (Replace fetch URL with your Python API)
    setTimeout(() => {
        scanner.style.display = 'none';
        dropZone.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        displayResults({
            score: 82,
            gaps: ["Kubernetes", "Redis", "System Design", "Unit Testing"],
            courses: [
                { title: "Advanced Backend Arch", site: "Coursera", icon: "code" },
                { title: "K8s for Developers", site: "Udemy", icon: "layers" },
                { title: "Cloud Scale Data", site: "YouTube", icon: "cloud" }
            ]
        });
    }, 3000);
}

function displayResults(data) {
    document.getElementById('ats-score').innerText = data.score + "%";
    
    const gapTags = document.getElementById('gap-tags');
    gapTags.innerHTML = data.gaps.map(g => `
        <span class="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-sm font-bold animate-pulse">${g}</span>
    `).join('');

    const courseContainer = document.getElementById('course-container');
    courseContainer.innerHTML = data.courses.map(c => `
        <div class="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500 transition cursor-pointer">
            <h5 class="font-bold text-lg mb-2">${c.title}</h5>
            <p class="text-sm text-slate-500">${c.site}</p>
            <div class="mt-4 text-blue-400 font-bold text-xs">GO TO COURSE →</div>
        </div>
    `).join('');
}
