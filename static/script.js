let charts = {};

function renderCharts(data) {
    if(charts.radar) charts.radar.destroy();
    if(charts.bar) charts.bar.destroy();

    charts.radar = new Chart(document.getElementById('skillRadar'), {
        type: 'radar',
        data: {
            labels: data.skills.labels,
            datasets: [{ label: 'Score', data: data.skills.data, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.2)' }]
        },
        options: { plugins: { legend: { display: false } } }
    });

    charts.bar = new Chart(document.getElementById('ratioBar'), {
        type: 'bar',
        data: {
            labels: data.ratios.labels,
            datasets: [{ label: 'Fit %', data: data.ratios.data, backgroundColor: '#3b82f6' }]
        }
    });
}

// Visit Counter Simulation
setInterval(() => {
    let count = parseInt(document.getElementById('vCount').innerText.replace(',',''));
    document.getElementById('vCount').innerText = (count + Math.floor(Math.random()*5)).toLocaleString();
}, 4000);
