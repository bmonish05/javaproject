// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.isAdmin) {
        window.location.href = 'admin.html';
        return;
    }

    console.log('User loaded:', currentUser.name);

    // Set user info
    document.getElementById('greetingText').textContent = `Hello ${currentUser.name}!`;
    document.getElementById('userNameMini').textContent = currentUser.name;

    // Initialize all sections
    initializeDashboard(currentUser);
    initializeFavorites();
    initializeResources();
    initializeRankings(currentUser);
    initializeProfileSection(currentUser);

    // Setup navigation
    setupNavigation();

    // Setup logout
    setupLogout();
});

// ==================== SETUP LOGOUT ====================
function setupLogout() {
    const backBtn = document.getElementById('backBtn');
    const logoutBtn2 = document.getElementById('logoutBtn2');
    const logoutSidebarBtn = document.getElementById('logoutSidebarBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    };
    
    if (logoutBtn2) logoutBtn2.addEventListener('click', logoutHandler);
    if (logoutSidebarBtn) logoutSidebarBtn.addEventListener('click', logoutHandler);
}

// ==================== SETUP NAVIGATION ====================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.section-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(sec => sec.style.display = 'none');
            
            const sectionElement = document.getElementById(`${section}-section`);
            if (sectionElement) {
                sectionElement.style.display = 'block';
                sectionElement.style.animation = 'slideUp 0.6s ease';
            }
        });
    });
}

// ==================== INITIALIZE DASHBOARD ====================
function initializeDashboard(currentUser) {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userResults = results.filter(r => r.userId === currentUser.id);

    console.log('User results:', userResults);

    if (userResults.length === 0) {
        console.log('No results found');
        document.getElementById('weakAreasList').innerHTML = '<p class="no-data">No data available yet. Take more quizzes!</p>';
        return;
    }

    const recentQuizzes = userResults.slice(-4).reverse();
    
    recentQuizzes.forEach((result, index) => {
        const cardNum = index + 1;
        const percent = result.percentage;
        const date = new Date(result.timestamp);
        const dateStr = date.toLocaleDateString();

        // Update circle
        const circle = document.getElementById(`circle${cardNum}`);
        if (circle) {
            const circumference = 2 * Math.PI * 45;
            const strokeDashoffset = circumference - (percent / 100) * circumference;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = strokeDashoffset;
            circle.style.stroke = getColorByPercentage(percent);
        }

        const percentEl = document.getElementById(`percent${cardNum}`);
        if (percentEl) percentEl.textContent = percent + '%';
        
        const titleEl = document.getElementById(`quizTitle${cardNum}`);
        if (titleEl) titleEl.textContent = `Quiz Attempt ${userResults.length - recentQuizzes.indexOf(result)}`;
        
        const dateEl = document.getElementById(`quizDate${cardNum}`);
        if (dateEl) dateEl.textContent = dateStr;
    });

    // Build history table
    const historyTableBody = document.getElementById('historyTableBody');
    historyTableBody.innerHTML = [...userResults].reverse().map((result, idx) => {
        const date = new Date(result.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const color = getColorByPercentage(result.percentage);

        return `
            <tr style="animation: fadeInRow 0.5s ease ${idx * 0.05}s both;">
                <td><strong>Quiz Attempt ${userResults.length - idx}</strong></td>
                <td><span class="badge" style="background: ${color};">${result.score}/25</span></td>
                <td><span class="badge" style="background: #28a745;">${result.correct}</span></td>
                <td><span class="badge" style="background: #dc3545;">${result.incorrect}</span></td>
                <td>
                    <div class="accuracy-meter">
                        <div class="meter-fill" style="width: ${result.percentage}%; background: ${color};"></div>
                    </div>
                    <span class="accuracy-text">${result.percentage}%</span>
                </td>
                <td>${dateStr}</td>
            </tr>
        `;
    }).join('');

    // Weak areas
    const weakAttempts = userResults.filter(r => r.percentage < 70).sort((a, b) => a.percentage - b.percentage);
    const weakAreasList = document.getElementById('weakAreasList');
    
    if (weakAttempts.length === 0) {
        weakAreasList.innerHTML = '<p class="no-data" style="color: #28a745;"><i class="fas fa-check-circle"></i> Excellent! All quizzes completed with good scores!</p>';
    } else {
        weakAreasList.innerHTML = weakAttempts.slice(0, 3).map((attempt, idx) => {
            const attemptNum = userResults.indexOf(attempt) + 1;
            const color = getColorByPercentage(attempt.percentage);
            return `
                <div class="weak-area-row" style="animation: slideInLeft 0.5s ease ${idx * 0.1}s both;">
                    <div class="weak-area-left">
                        <span class="area-name">Attempt #${attemptNum}</span>
                        <span class="area-score" style="color: ${color};">${attempt.percentage}%</span>
                    </div>
                    <a href="index.html" class="btn-improve">
                        <i class="fas fa-redo"></i> Retake
                    </a>
                </div>
            `;
        }).join('');
    }
}

// ==================== INITIALIZE FAVORITES ====================
function initializeFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    const favorites = [
        { icon: 'fa-code', title: 'JavaScript Basics', desc: 'Master fundamentals', rating: '4.8/5', students: '1.2K' },
        { icon: 'fa-palette', title: 'CSS Styling', desc: 'Advanced techniques', rating: '4.6/5', students: '890' },
        { icon: 'fa-globe', title: 'Web Development', desc: 'Full course coverage', rating: '4.9/5', students: '2.1K' },
        { icon: 'fa-database', title: 'Database Design', desc: 'SQL essentials', rating: '4.7/5', students: '756' },
        { icon: 'fa-react', title: 'React Framework', desc: 'Modern UIs', rating: '4.85/5', students: '1.5K' },
        { icon: 'fa-node', title: 'Node.js Backend', desc: 'Server development', rating: '4.75/5', students: '980' }
    ];

    favoritesGrid.innerHTML = favorites.map((fav, idx) => `
        <div class="favorite-item" style="animation-delay: ${idx * 0.1}s;">
            <div class="fav-icon">
                <i class="fas ${fav.icon}"></i>
            </div>
            <h3>${fav.title}</h3>
            <p>${fav.desc}</p>
            <div class="fav-stats">
                <span><i class="fas fa-star"></i> ${fav.rating}</span>
                <span><i class="fas fa-users"></i> ${fav.students}</span>
            </div>
            <button class="btn-start-fav" onclick="location.href='index.html'">
                <i class="fas fa-play"></i> Start Quiz
            </button>
        </div>
    `).join('');
}

// ==================== INITIALIZE RESOURCES ====================
function initializeResources() {
    const resourcesGrid = document.getElementById('resourcesGrid');
    
    const resources = [
        { icon: 'fa-video', type: 'Video', title: 'JavaScript ES6', desc: 'Modern features', meta1: '2h 30m', meta2: 'Beginner' },
        { icon: 'fa-file-pdf', type: 'PDF', title: 'CSS Grid Guide', desc: 'Grid layout', meta1: '45 pages', meta2: 'Intermediate' },
        { icon: 'fa-link', type: 'Article', title: 'React Hooks', desc: 'State management', meta1: '15 min read', meta2: 'Advanced' },
        { icon: 'fa-code-branch', type: 'Code', title: 'Node Boilerplate', desc: 'Ready template', meta1: 'GitHub', meta2: '2.5K stars' },
        { icon: 'fa-play-circle', type: 'Course', title: 'Web Dev Course', desc: 'Full bootcamp', meta1: '40h 00m', meta2: 'All Levels' },
        { icon: 'fa-comments', type: 'Forum', title: 'Dev Community', desc: 'Active members', meta1: '5K+ members', meta2: '10K+ posts' }
    ];

    resourcesGrid.innerHTML = resources.map((res, idx) => `
        <div class="resource-item" style="animation-delay: ${idx * 0.1}s;">
            <div class="resource-header">
                <i class="fas ${res.icon}"></i>
                <span class="resource-type">${res.type}</span>
            </div>
            <h3>${res.title}</h3>
            <p>${res.desc}</p>
            <div class="resource-meta">
                <span><i class="fas fa-clock"></i> ${res.meta1}</span>
                <span><i class="fas fa-graduation-cap"></i> ${res.meta2}</span>
            </div>
            <a href="#" class="btn-resource">
                <i class="fas fa-arrow-right"></i> View More
            </a>
        </div>
    `).join('');
}

// ==================== INITIALIZE RANKINGS ====================
function initializeRankings(currentUser) {
    const rankingTableBody = document.getElementById('rankingTableBody');
    
    const students = [
        'Alex Johnson', 'Sarah Smith', 'Michael Chen', 'Emma Davis', 'James Wilson',
        'Olivia Brown', 'Ethan Miller', 'Sophia Taylor', 'Noah Anderson', 'Ava Martinez'
    ];

    const rankings = students.map((name, idx) => ({
        rank: idx + 1,
        name: name,
        score: 2450 - (idx * 85),
        accuracy: 96 - (idx * 2),
        quizzes: 15 + idx
    }));

    rankingTableBody.innerHTML = rankings.map((item, idx) => {
        let medalIcon = '';
        if (item.rank === 1) medalIcon = '<i class="fas fa-medal" style="color: #FFD700;"></i>';
        else if (item.rank === 2) medalIcon = '<i class="fas fa-medal" style="color: #C0C0C0;"></i>';
        else if (item.rank === 3) medalIcon = '<i class="fas fa-medal" style="color: #CD7F32;"></i>';
        else medalIcon = '<span style="color: #667eea; font-weight: 700;">#' + item.rank + '</span>';

        return `
            <tr style="animation: slideUp 0.6s ease ${idx * 0.05}s both;">
                <td><span class="rank-medal">${medalIcon}</span></td>
                <td><strong>${item.name}</strong></td>
                <td><span class="score-badge">${item.score}</span></td>
                <td><span class="accuracy-badge">${item.accuracy}%</span></td>
                <td><span class="quizzes-badge">${item.quizzes}</span></td>
            </tr>
        `;
    }).join('');

    // Update user rank
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userQuizzes = results.filter(r => r.userId === currentUser.id).length;
    const userScore = userQuizzes * 80 + Math.round(Math.random() * 200);
    const userRank = Math.min(Math.floor(userScore / 150) + 1, 50);

    document.getElementById('myRankPosition').textContent = userRank;
    document.getElementById('myRankText').textContent = `You are ranked #${userRank}`;
    document.getElementById('myRankScore').textContent = userScore + ' points';
}

// ==================== INITIALIZE PROFILE SECTION ====================
function initializeProfileSection(currentUser) {
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userResults = results.filter(r => r.userId === currentUser.id);

    document.getElementById('profileFullName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileMemberSince').textContent = new Date().toLocaleDateString();
    document.getElementById('profileQuizzesTaken').textContent = userResults.length;

    if (userResults.length > 0) {
        const bestScore = Math.max(...userResults.map(r => r.percentage));
        const avgAccuracy = Math.round(userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length);
        const totalCorrect = userResults.reduce((sum, r) => sum + r.correct, 0);
        
        document.getElementById('profileBestScore').textContent = bestScore + '%';
        document.getElementById('profileAvgAccuracy').textContent = avgAccuracy + '%';
        document.getElementById('profileTotalCorrect').textContent = totalCorrect;
    }
}

// ==================== HELPER FUNCTIONS ====================
function getColorByPercentage(percent) {
    if (percent >= 80) return '#28a745';
    if (percent >= 60) return '#ffc107';
    return '#dc3545';
}