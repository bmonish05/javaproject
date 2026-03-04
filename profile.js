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

    console.log('Loading profile for:', currentUser.name);

    // Set user info immediately
    const greeting = document.getElementById('greetingText');
    const userName = document.getElementById('userNameMini');
    
    if (greeting) greeting.textContent = `Hello ${currentUser.name}!`;
    if (userName) userName.textContent = currentUser.name;

    // Initialize all sections with a slight delay to ensure DOM is ready
    setTimeout(() => {
        initializeDashboard(currentUser);
        initializeFavorites();
        initializeResources();
        initializeRankings(currentUser);
        initializeProfileSection(currentUser);
        setupNavigation();
    }, 100);

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
            }
        });
    });
}

// ==================== INITIALIZE DASHBOARD ====================
function initializeDashboard(currentUser) {
    console.log('Initializing dashboard...');
    
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userResults = results.filter(r => r.userId === currentUser.id);

    console.log('User results:', userResults);

    // Initialize empty cards
    for (let i = 1; i <= 4; i++) {
        const circle = document.getElementById(`circle${i}`);
        const percentEl = document.getElementById(`percent${i}`);
        const titleEl = document.getElementById(`quizTitle${i}`);
        const dateEl = document.getElementById(`quizDate${i}`);
        
        if (circle) {
            circle.style.strokeDasharray = '282.7';
            circle.style.strokeDashoffset = '282.7';
        }
    }

    if (userResults.length === 0) {
        console.log('No results, showing empty state');
        const weakAreasList = document.getElementById('weakAreasList');
        if (weakAreasList) {
            weakAreasList.innerHTML = '<p class="no-data">No data available yet. Take more quizzes!</p>';
        }
        return;
    }

    // Update cards with recent quizzes
    const recentQuizzes = userResults.slice(-4).reverse();
    
    recentQuizzes.forEach((result, index) => {
        const cardNum = index + 1;
        const percent = result.percentage;
        const date = new Date(result.timestamp);
        const dateStr = date.toLocaleDateString();

        const circle = document.getElementById(`circle${cardNum}`);
        if (circle) {
            const circumference = 282.7;
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
    if (historyTableBody) {
        historyTableBody.innerHTML = [...userResults].reverse().map((result, idx) => {
            const date = new Date(result.timestamp);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const color = getColorByPercentage(result.percentage);

            return `
                <tr>
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
    }

    // Weak areas
    const weakAttempts = userResults.filter(r => r.percentage < 70).sort((a, b) => a.percentage - b.percentage);
    const weakAreasList = document.getElementById('weakAreasList');
    
    if (weakAreasList) {
        if (weakAttempts.length === 0) {
            weakAreasList.innerHTML = '<p class="no-data" style="color: #28a745;"><i class="fas fa-check-circle"></i> Excellent! All quizzes completed with good scores!</p>';
        } else {
            weakAreasList.innerHTML = weakAttempts.slice(0, 3).map((attempt, idx) => {
                const attemptNum = userResults.indexOf(attempt) + 1;
                const color = getColorByPercentage(attempt.percentage);
                return `
                    <div class="weak-area-row">
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
}

// ==================== INITIALIZE FAVORITES ====================
function initializeFavorites() {
    console.log('Initializing favorites...');
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (!favoritesGrid) {
        console.log('Favorites grid not found');
        return;
    }
    
    const favorites = [
        { icon: 'fa-code', title: 'JavaScript Basics', desc: 'Master fundamentals of JavaScript', rating: '4.8/5', students: '1.2K' },
        { icon: 'fa-palette', title: 'CSS Styling', desc: 'Learn advanced CSS techniques', rating: '4.6/5', students: '890' },
        { icon: 'fa-globe', title: 'Web Development', desc: 'Complete web development course', rating: '4.9/5', students: '2.1K' },
        { icon: 'fa-database', title: 'Database Design', desc: 'SQL and database management', rating: '4.7/5', students: '756' },
        { icon: 'fa-react', title: 'React Framework', desc: 'Build modern UIs with React', rating: '4.85/5', students: '1.5K' },
        { icon: 'fa-node', title: 'Node.js Backend', desc: 'Server-side development', rating: '4.75/5', students: '980' }
    ];

    favoritesGrid.innerHTML = favorites.map((fav, idx) => `
        <div class="favorite-item">
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

    console.log('Favorites loaded');
}

// ==================== INITIALIZE RESOURCES ====================
function initializeResources() {
    console.log('Initializing resources...');
    const resourcesGrid = document.getElementById('resourcesGrid');
    
    if (!resourcesGrid) {
        console.log('Resources grid not found');
        return;
    }
    
    const resources = [
        { icon: 'fa-video', type: 'Video', title: 'JavaScript ES6 Tutorial', desc: 'Learn modern JavaScript features', meta1: '2h 30m', meta2: 'Beginner' },
        { icon: 'fa-file-pdf', type: 'PDF', title: 'CSS Grid Mastery', desc: 'Complete CSS Grid guide', meta1: '45 pages', meta2: 'Intermediate' },
        { icon: 'fa-link', type: 'Article', title: 'React Hooks Deep Dive', desc: 'Understanding React Hooks', meta1: '15 min read', meta2: 'Advanced' },
        { icon: 'fa-code-branch', type: 'Code', title: 'Node.js Boilerplate', desc: 'Ready project template', meta1: 'GitHub', meta2: '2.5K stars' },
        { icon: 'fa-play-circle', type: 'Course', title: 'Web Dev Bootcamp', desc: 'Complete web development', meta1: '40h 00m', meta2: 'All Levels' },
        { icon: 'fa-comments', type: 'Forum', title: 'Dev Community', desc: 'Active coding community', meta1: '5K+ members', meta2: '10K+ posts' }
    ];

    resourcesGrid.innerHTML = resources.map((res, idx) => `
        <div class="resource-item">
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
            <a href="#" class="btn-resource" onclick="alert('Opening: ${res.title}'); return false;">
                <i class="fas fa-arrow-right"></i> View More
            </a>
        </div>
    `).join('');

    console.log('Resources loaded');
}

// ==================== INITIALIZE RANKINGS ====================
function initializeRankings(currentUser) {
    console.log('Initializing rankings...');
    const rankingTableBody = document.getElementById('rankingTableBody');
    
    if (!rankingTableBody) {
        console.log('Ranking table not found');
        return;
    }
    
    const students = [
        'Aarav', 'Vivaan', 'Arjun', 'Aditya', 'Siddharth', 'Rohan', 'Aryan', 'Nikhil', 'Karan', 'Rahul', 'Ananya', 'Priya', 'Diya', 
        'Pooja', 'Neha', 'Zara', 'Sakshi', 'Isha', 'Riya', 'Sneha', 'Harshita', 'Divya', 'Kavya', 'Nisha', 'Anjali', 'Deepika', 'Isha', 
        'Mahesh', 'Vikram', 'Suresh', 'Rajesh', 'Amit', 'Ashok','Sanjay', 'Ravi', 'Sandeep', 'Naveen', 'Dharmendra', 'Govind', 'Prakash', 
        'Vishal', 'Ritesh', 'Varun', 'Harsh', 'Jaideep'
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
        else medalIcon = '#' + item.rank;

        return `
            <tr>
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

    const myRankPosition = document.getElementById('myRankPosition');
    const myRankText = document.getElementById('myRankText');
    const myRankScore = document.getElementById('myRankScore');

    if (myRankPosition) myRankPosition.textContent = userRank;
    if (myRankText) myRankText.textContent = `You are ranked #${userRank}`;
    if (myRankScore) myRankScore.textContent = userScore + ' points';

    console.log('Rankings loaded');
}

// ==================== INITIALIZE PROFILE SECTION ====================
function initializeProfileSection(currentUser) {
    console.log('Initializing profile section...');
    
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    const userResults = results.filter(r => r.userId === currentUser.id);

    const profileFullName = document.getElementById('profileFullName');
    const profileEmail = document.getElementById('profileEmail');
    const profileMemberSince = document.getElementById('profileMemberSince');
    const profileQuizzesTaken = document.getElementById('profileQuizzesTaken');
    const profileBestScore = document.getElementById('profileBestScore');
    const profileAvgAccuracy = document.getElementById('profileAvgAccuracy');
    const profileTotalCorrect = document.getElementById('profileTotalCorrect');

    if (profileFullName) profileFullName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profileMemberSince) profileMemberSince.textContent = new Date().toLocaleDateString();
    if (profileQuizzesTaken) profileQuizzesTaken.textContent = userResults.length;

    if (userResults.length > 0) {
        const bestScore = Math.max(...userResults.map(r => r.percentage));
        const avgAccuracy = Math.round(userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length);
        const totalCorrect = userResults.reduce((sum, r) => sum + r.correct, 0);
        
        if (profileBestScore) profileBestScore.textContent = bestScore + '%';
        if (profileAvgAccuracy) profileAvgAccuracy.textContent = avgAccuracy + '%';
        if (profileTotalCorrect) profileTotalCorrect.textContent = totalCorrect;
    }

    console.log('Profile section loaded');
}

// ==================== HELPER FUNCTIONS ====================
function getColorByPercentage(percent) {
    if (percent >= 80) return '#28a745';
    if (percent >= 60) return '#ffc107';
    return '#dc3545';
}