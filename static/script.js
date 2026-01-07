let charts = {};

function renderVisuals(data) {
    if(charts.r) charts.r.destroy();
    if(charts.b) charts.b.destroy();

    const ctxR = document.getElementById('radarChart').getContext('2d');
    charts.r = new Chart(ctxR, {
        type: 'radar',
        data: {
            labels: ['Technical', 'Soft Skills', 'Experience', 'Leadership', 'Education'],
            datasets: [{ label: 'Skill Set', data: data.radar, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)' }]
        }
    });

    const ctxB = document.getElementById('barChart').getContext('2d');
    charts.b = new Chart(ctxB, {
        type: 'bar',
        data: {
            labels: Object.keys(data.ratios),
            datasets: [{ label: 'Placement Ratio %', data: Object.values(data.ratios), backgroundColor: '#3b82f6' }]
        }
    });
}

// Visit Counter Simulation
setInterval(() => {
    const el = document.getElementById('visitorCount');
    el.innerText = (parseInt(el.innerText.replace(',','')) + 1).toLocaleString();
}, 5000);

lucide.createIcons();
