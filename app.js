let pieChartInstance = null;
let barChartInstance = null;

// Mock Database of reviews to simulate backend API
const rawReviewData = [
    { text: "Absolutely love it! The build quality is premium and it works flawlessly.", sentiment: "positive", source: "Amazon", confidence: 98, stars: 5, date: "2 days ago" },
    { text: "It's decent, does what it says, but the price is a bit high for the features provided.", sentiment: "neutral", source: "Flipkart", confidence: 75, stars: 3, date: "1 week ago" },
    { text: "Terrible experience. It started overheating within an hour of use. Returning it.", sentiment: "negative", source: "Amazon", confidence: 92, stars: 1, date: "3 weeks ago" },
    { text: "Exceeded my expectations. The battery life is incredible.", sentiment: "positive", source: "Official Site", confidence: 89, stars: 5, date: "1 month ago" },
    { text: "Setup was confusing and the manual isn't helpful. Once working, it's okay.", sentiment: "neutral", source: "Amazon", confidence: 68, stars: 3, date: "2 months ago" },
    { text: "Customer service was awful when I tried to get a replacement for a defective unit.", sentiment: "negative", source: "Flipkart", confidence: 85, stars: 2, date: "5 days ago" },
    { text: "Great value for money. Highly recommend to anyone looking for a reliable option.", sentiment: "positive", source: "Amazon", confidence: 95, stars: 4, date: "Yesterday" }
];

let currentReviews = [];

// URL Parser
function extractNameFromInput(input) {
    const cleanInput = input.trim();
    if (!cleanInput.startsWith('http')) return cleanInput; 
    try {
        const url = new URL(cleanInput);
        const pathParts = url.pathname.split('/').filter(p => p.length > 2 && !/^\d+$/.test(p) && !p.includes('.html'));
        let namePart = pathParts.reduce((longest, current) => current.length > longest.length ? current : longest, "");
        return namePart ? namePart.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : url.hostname; 
    } catch (e) {
        return "Analyzed Product";
    }
}

// Render Reviews to DOM
function renderReviews(filter = 'all') {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = ''; 

    const filteredReviews = filter === 'all' 
        ? currentReviews 
        : currentReviews.filter(r => r.sentiment === filter);

    if (filteredReviews.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">No reviews found for this sentiment filter.</p>';
        return;
    }

    filteredReviews.forEach(review => {
        let badgeColor, badgeIcon;
        if (review.sentiment === 'positive') { badgeColor = 'bg-positive/10 text-positive border-positive'; badgeIcon = 'fa-smile'; }
        else if (review.sentiment === 'neutral') { badgeColor = 'bg-neutral/10 text-neutral border-neutral'; badgeIcon = 'fa-meh'; }
        else { badgeColor = 'bg-negative/10 text-negative border-negative'; badgeIcon = 'fa-frown'; }

        let starsHtml = '';
        for(let i=0; i<5; i++) {
            starsHtml += `<i class="${i < review.stars ? 'fas' : 'far'} fa-star"></i>`;
        }

        const card = `
            <div class="review-card bg-white border-l-4 ${badgeColor.split(' ')[2]} p-6 rounded-lg shadow-sm border border-gray-100">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <div class="flex items-center mb-2">
                            <div class="sentiment-badge ${badgeColor.split(' ').slice(0,2).join(' ')} mr-3 uppercase tracking-wider text-xs">
                                <i class="fas ${badgeIcon} mr-1"></i>${review.sentiment}
                            </div>
                            <div class="flex items-center text-yellow-400 text-sm">${starsHtml}</div>
                        </div>
                        <h5 class="font-semibold text-gray-900">"${review.text.substring(0, 40)}..."</h5>
                    </div>
                    <span class="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">${review.date}</span>
                </div>
                <p class="text-gray-700 mb-4 text-sm leading-relaxed">"${review.text}"</p>
                <div class="flex items-center justify-between text-xs font-medium text-gray-500">
                    <span class="flex items-center"><i class="fas fa-shopping-bag mr-1"></i> ${review.source}</span>
                    <span class="flex items-center"><i class="fas fa-robot mr-1"></i> AI Confidence: ${review.confidence}%</span>
                </div>
            </div>`;
        container.innerHTML += card;
    });
}

// Initialize Charts
function initializeCharts() {
    const pieCtx = document.getElementById('sentimentPieChart').getContext('2d');
    const barCtx = document.getElementById('sentimentBarChart').getContext('2d');

    if (pieChartInstance) pieChartInstance.destroy();
    if (barChartInstance) barChartInstance.destroy();

    const colorPos = '#22c55e'; // Bright Green
    const colorNeu = '#facc15'; // Bright Yellow
    const colorNeg = '#ef4444'; // Bright Red
    
    let pos = Math.floor(Math.random() * (75 - 50) + 50);
    let neg = Math.floor(Math.random() * (25 - 5) + 5);
    let neu = 100 - pos - neg;

    document.getElementById('posPercent').textContent = pos;
    document.getElementById('neuPercent').textContent = neu;
    document.getElementById('negPercent').textContent = neg;

    pieChartInstance = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [pos, neu, neg],
                backgroundColor: [colorPos, colorNeu, colorNeg],
                borderWidth: 0, hoverOffset: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, cutout: '75%' }
    });

    const randomData = () => Array.from({length: 4}, () => Math.floor(Math.random() * 80 + 10));

    barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                { label: 'Positive', data: randomData(), backgroundColor: colorPos },
                { label: 'Neutral', data: randomData(), backgroundColor: colorNeu },
                { label: 'Negative', data: randomData(), backgroundColor: colorNeg }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true } },
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// Handle Export CSV
document.getElementById('exportBtn').addEventListener('click', () => {
    if(currentReviews.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Text,Sentiment,Source,Confidence,Stars,Date\n";
    
    currentReviews.forEach(row => {
        const safeText = `"${row.text.replace(/"/g, '""')}"`;
        csvContent += `${safeText},${row.sentiment},${row.source},${row.confidence},${row.stars},${row.date}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentiment_analysis_${document.getElementById('productTitle').textContent.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Handle Filtering
document.getElementById('sentimentFilter').addEventListener('change', (e) => {
    renderReviews(e.target.value);
});

// Main Analyze Action
document.getElementById('analyzeBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('productSearch').value;
    if (!searchInput.trim()) return;

    document.getElementById('resultsSection').classList.add('hidden');
    const loader = document.getElementById('loadingIndicator');
    loader.classList.remove('hidden');
    
    const progressBar = document.getElementById('progressBar');
    const progressSubtext = document.getElementById('progressSubtext');
    const loadingText = document.getElementById('loadingText');
    
    let progress = 0;
    progressBar.style.width = '0%';
    
    const states = [
        "Scraping product pages...", 
        "Extracting customer reviews...", 
        "Running NLP sentiment models...", 
        "Generating visualizations..."
    ];

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        progressSubtext.textContent = `${progress}% Complete`;
        
        if(progress < 25) loadingText.textContent = states[0];
        else if(progress < 50) loadingText.textContent = states[1];
        else if(progress < 85) loadingText.textContent = states[2];
        else loadingText.textContent = states[3];

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                const formattedName = extractNameFromInput(searchInput);
                document.getElementById('productTitle').textContent = formattedName;
                document.getElementById('reviewCount').textContent = Math.floor(Math.random() * (1500 - 300) + 300).toLocaleString();
                
                currentReviews = [...rawReviewData].sort(() => 0.5 - Math.random());
                
                document.getElementById('sentimentFilter').value = 'all';
                renderReviews('all');
                initializeCharts();

                loader.classList.add('hidden');
                document.getElementById('resultsSection').classList.remove('hidden');
                document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }, 300);
});

document.getElementById('productSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('analyzeBtn').click();
});