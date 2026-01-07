// Firebase Config
const firebaseConfig = { apiKey: "YOUR_KEY", authDomain: "your-project.firebaseapp.com", projectId: "your-project" };
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// UI Elements
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const scanLine = document.getElementById('scan-line');
const dashboard = document.getElementById('dashboard');

// Google Auth
document.getElementById('google-login').onclick = async () => {
    const result = await auth.signInWithPopup(provider);
    document.getElementById('google-login').classList.add('hidden');
    document.getElementById('user-profile').classList.remove('hidden');
    document.getElementById('user-name').innerText = result.user.displayName;
    document.getElementById('user-img').src = result.user.photoURL;
};

// Analyzer Trigger
dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => startAnalysis(e.target.files[0]);
document.getElementById('analyze-btn').onclick = () => startAnalysis(fileInput.files[0]);

async function startAnalysis(file) {
    if (!file) { alert("Please upload a resume first!"); return; }
    
    // Animation Start
    scanLine.style.display = 'block';
    
    // Simulate AI Processing (Replace with fetch('YOUR_BACKEND_URL/analyze'))
    setTimeout(() => {
        scanLine.style.display = 'none';
        dashboard.classList.remove('hidden');
        renderResults({
            score: 85,
            gaps: ["Kubernetes", "Redis", "System Design", "Unit Testing"],
            salary: "14.5L - 18L",
            courses: [
                { title: "K8s Masterclass", provider: "Udemy", time: "2 Weeks" },
                { title: "System Design for Scale", provider: "Coursera", time: "1 Month" },
                { title: "Redis Deep Dive", provider: "YouTube", time: "1 Week" }
            ]
        });
        window.scrollTo({ top: dashboard.offsetTop - 100, behavior: 'smooth' });
    }, 3000);
}

function renderResults(data) {
    // ATS Score Animation
    const circle = document.getElementById('score-circle');
    const scoreVal = document.getElementById('score-val');
    circle.style.strokeDashoffset = 364 - (364 * data.score) / 100;
    scoreVal.innerText = data.score + "%";

    // Salary
    document.getElementById('salary-est').innerText = "₹" + data.salary;

    // Gaps
    document.getElementById('gap-container').innerHTML = data.gaps.map(gap => `
        <span class="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-bold animate-pulse">${gap}</span>
    `).join('');

    // Courses
    document.getElementById('course-list').innerHTML = data.courses.map(c => `
        <div class="glass-panel p-6 hover:border-blue-500 transition group cursor-pointer">
            <div class="flex justify-between items-start mb-4">
                <span class="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md uppercase font-bold">${c.time}</span>
                <i data-lucide="external-link" class="w-4 h-4 text-gray-600 group-hover:text-blue-500"></i>
            </div>
            <h5 class="font-bold text-lg mb-1">${c.title}</h5>
            <p class="text-xs text-gray-500">${c.provider}</p>
        </div>
    `).join('');
    lucide.createIcons();
}
