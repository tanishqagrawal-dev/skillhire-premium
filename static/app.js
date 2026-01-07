async function runAnalysis() {
    const file = document.getElementById('resFile').files[0];
    const jd = document.getElementById('jdText').value;
    if(!file) return alert("Please upload a resume first!");

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jd', jd);

    try {
        const res = await fetch('/analyze', { method: 'POST', body: formData });
        const data = await res.json();
        document.getElementById('dashboard').classList.remove('hidden');
        renderCharts(data);
        window.location.hash = "#analyzer";
    } catch (e) { alert("Analysis failed. Check your API key."); }
}

lucide.createIcons();
