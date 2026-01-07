async function runAudit() {
    const file = document.getElementById('fileInput').files[0];
    const jd = document.getElementById('jdText').value;
    if(!file) return alert("Please upload a PDF!");

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jd', jd);

    const response = await fetch('/analyze', { method: 'POST', body: formData });
    const data = await response.json();
    
    document.getElementById('results').classList.remove('hidden');
    renderVisuals(data);
}

function handleLogin() {
    const name = prompt("Enter your name to create a profile:");
    if(name) document.getElementById('loginBtn').innerText = name;
}
