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


// ==================== INITIALIZE RANKINGS ====================
        function loadRankings(user) {
            const results = JSON.parse(localStorage.getItem('quizResults')) || [];
            const userResults = results.filter(r => r.userId === user.id);
            
            // Calculate user score and stats
            const userQuizzes = userResults.length;
            const userScore = userQuizzes * 80 + Math.round(Math.random() * 200);
            const userAvgAccuracy = userResults.length > 0 ? Math.round(userResults.reduce((s, r) => s + r.percentage, 0) / userResults.length) : 0;

            // Create list of all students including current user
            const allStudents = [];
            
            // Add other students with Indian names
            for (let i = 0; i < 14; i++) {
                allStudents.push({
                    name: getRandomIndianStudent(),
                    score: 2450 - (i * 85),
                    accuracy: 96 - (i * 2),
                    quizzes: 15 + i,
                    isCurrentUser: false
                });
            }

            // Add current user
            allStudents.push({
                name: user.name,
                score: userScore,
                accuracy: userAvgAccuracy,
                quizzes: userQuizzes,
                isCurrentUser: true
            });

            // Sort by score (descending)
            allStudents.sort((a, b) => b.score - a.score);

            // Find user's rank
            let userRank = 1;
            allStudents.forEach((student, idx) => {
                if (student.isCurrentUser) {
                    userRank = idx + 1;
                }
            });

            // Create ranking table
            let html = '';
            allStudents.forEach((student, i) => {
                let medalIcon = '';
                if (i === 0) {
                    medalIcon = '<i class="fas fa-medal" style="color: #FFD700;"></i>';
                } else if (i === 1) {
                    medalIcon = '<i class="fas fa-medal" style="color: #C0C0C0;"></i>';
                } else if (i === 2) {
                    medalIcon = '<i class="fas fa-medal" style="color: #CD7F32;"></i>';
                } else {
                    medalIcon = '<span style="color: #667eea; font-weight: 700;">#' + (i + 1) + '</span>';
                }
                
                let rowBackground = student.isCurrentUser ? 'background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);' : '';
                let nameColor = student.isCurrentUser ? 'color: #667eea; font-weight: 700;' : 'color: #333;';
                let star = student.isCurrentUser ? ' ⭐ (You)' : '';
                
                html += `
                    <tr style="${rowBackground}">
                        <td><span class="rank-medal">${medalIcon}</span></td>
                        <td><strong style="${nameColor}">${student.name}${star}</strong></td>
                        <td><span class="score-badge">${student.score}</span></td>
                        <td><span class="accuracy-badge">${student.accuracy}%</span></td>
                        <td><span class="quizzes-badge">${student.quizzes}</span></td>
                    </tr>
                `;
            });

            document.getElementById('rankingTableBody').innerHTML = html;

            // Update user rank card
            document.getElementById('myRankName').textContent = user.name;
            document.getElementById('myRankPosition').textContent = userRank;
            document.getElementById('myRankText').textContent = `Ranked #${userRank} of ${allStudents.length}`;
            document.getElementById('myRankScore').textContent = userScore + ' points';
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