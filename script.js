const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const scanner = document.getElementById('scanner');
const resultsSection = document.getElementById('results-section');

// Trigger file input on click
dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => handleUpload(e.target.files[0]);

async function handleUpload(file) {
    if (!file) return;

    // Start High-Tech Scan Animation
    scanner.style.display = 'block';
    dropZone.classList.add('opacity-50');

    // Simulate API Call (You will replace this with your actual Python API URL)
    setTimeout(() => {
        showResults({
            score: 78,
            gaps: ["System Design", "Kubernetes", "Redis Caching"],
            courses: [
                { title: "Distributed Systems Expert", platform: "Coursera", link: "#" },
                { title: "Docker & Kubernetes Masterclass", platform: "Udemy", link: "#" }
            ]
        });
        scanner.style.display = 'none';
        dropZone.classList.add('hidden');
    }, 3000);
}

function showResults(data) {
    resultsSection.classList.remove('hidden');
    
    // Animate ATS Score
    const circle = document.getElementById('score-circle');
    const text = document.getElementById('score-text');
    const offset = 364.4 - (364.4 * data.score) / 100;
    circle.style.strokeDashoffset = offset;
    text.innerText = `${data.score}%`;

    // Inject Gaps
    const gapList = document.getElementById('gap-list');
    gapList.innerHTML = data.gaps.map(gap => `
        <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-red-500/20">
            <span class="font-bold text-red-400">${gap}</span>
            <span class="text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded-full">Missing</span>
        </div>
    `).join('');

    // Inject Courses
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = data.courses.map(c => `
        <div class="p-6 glass rounded-2xl hover:bg-white/10 transition cursor-pointer group">
            <h4 class="font-bold mb-1">${c.title}</h4>
            <p class="text-sm text-gray-500">${c.platform}</p>
            <div class="mt-4 text-blue-500 flex items-center gap-2 text-sm font-bold">
                Start Learning <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition"></i>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}
