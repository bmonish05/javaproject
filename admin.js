// ==================== CHART VARIABLES ====================
let performanceChart = null;
let accuracyChart = null;

// ==================== INITIALIZE DASHBOARD ====================
window.addEventListener('load', () => {
    checkAdminAccess();
    loadDashboardData();
    initializeCharts();
});

// ==================== CHECK ADMIN ACCESS ====================
const checkAdminAccess = () => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Only admins can access this page
    if (!currentUser.isAdmin) {
        alert('Access Denied! Only admins can access this page.');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('userNameDisplay').textContent = currentUser.name;
};

// ==================== LOAD DASHBOARD DATA ====================
const loadDashboardData = () => {
    const users = getStoredUsers();
    const results = getStoredQuizResults();

    // Filter only non-admin users (students)
    const students = users.filter(u => !u.isAdmin);
    const studentIds = new Set(students.map(u => u.id));
    const studentResults = results.filter(r => studentIds.has(r.userId));

    // Calculate statistics
    const totalStudents = students.length;
    const totalAttempts = studentResults.length;
    
    let totalCorrect = 0;
    let totalQuestions = 0;
    let bestScore = 0;

    studentResults.forEach(result => {
        totalCorrect += result.correct;
        totalQuestions += result.correct + result.incorrect;
        if (result.score > bestScore) {
            bestScore = result.score;
        }
    });

    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const avgScore = totalAttempts > 0 ? Math.round(totalCorrect / totalAttempts) : 0;

    // Update stats cards with animation
    animateValue('totalUsers', 0, totalStudents, 1500);
    animateValue('totalAttempts', 0, totalAttempts, 1500);
    animateValue('avgScore', 0, avgScore, 1500);
    
    document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';

    // Build user performance table
    buildUserTable(students, studentResults);
};

// ==================== ANIMATE VALUE ====================
const animateValue = (elementId, start, end, duration) => {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// ==================== BUILD USER TABLE ====================
const buildUserTable = (students, results) => {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';

    if (results.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: #999; padding: 40px 0;">
                    <i class="fas fa-inbox" style="font-size: 36px; margin-bottom: 10px; display: block;"></i>
                    No quiz attempts yet
                </td>
            </tr>
        `;
        return;
    }

    // Group results by user
    const userResultsMap = {};
    results.forEach(result => {
        if (!userResultsMap[result.userId]) {
            userResultsMap[result.userId] = [];
        }
        userResultsMap[result.userId].push(result);
    });

    // Create table rows
    let rowCounter = 0;
    students.forEach(student => {
        const userResults = userResultsMap[student.id] || [];
        if (userResults.length === 0) return;

        const totalCorrect = userResults.reduce((sum, r) => sum + r.correct, 0);
        const totalIncorrect = userResults.reduce((sum, r) => sum + r.incorrect, 0);
        const bestScore = Math.max(...userResults.map(r => r.score));
        const accuracy = Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100);
        
        const lastAttempt = new Date(userResults[userResults.length - 1].timestamp);
        const lastAttemptStr = lastAttempt.toLocaleDateString() + ' ' + lastAttempt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const row = document.createElement('tr');
        row.style.animation = `fadeInRow 0.5s ease ${rowCounter * 0.1}s both`;
        row.innerHTML = `
            <td><strong>${student.name}</strong></td>
            <td>${student.email}</td>
            <td><span class="badge badge-info">${userResults.length}</span></td>
            <td><span class="badge badge-success">${totalCorrect}</span></td>
            <td><span class="badge badge-danger">${totalIncorrect}</span></td>
            <td><span class="badge badge-primary">${bestScore}/25</span></td>
            <td>
                <div class="accuracy-bar">
                    <div class="accuracy-fill" style="width: ${accuracy}%; background: ${getAccuracyColor(accuracy)};"></div>
                    <span>${accuracy}%</span>
                </div>
            </td>
            <td>${lastAttemptStr}</td>
        `;
        tableBody.appendChild(row);
        rowCounter++;
    });
};

// ==================== GET ACCURACY COLOR ====================
const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return '#28a745';
    if (accuracy >= 60) return '#ffc107';
    return '#dc3545';
};

// ==================== INITIALIZE CHARTS ====================
const initializeCharts = () => {
    const users = getStoredUsers();
    const results = getStoredQuizResults();

    // Filter only student results
    const students = users.filter(u => !u.isAdmin);
    const studentIds = new Set(students.map(u => u.id));
    const studentResults = results.filter(r => studentIds.has(r.userId));

    // Performance Distribution Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    const scoreDistribution = calculateScoreDistribution(studentResults);

    performanceChart = new Chart(performanceCtx, {
        type: 'bar',
        data: {
            labels: ['0-5', '6-10', '11-15', '16-20', '21-25'],
            datasets: [{
                label: 'Number of Students',
                data: scoreDistribution,
                backgroundColor: [
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(102, 126, 234, 0.7)',
                    'rgba(40, 167, 69, 0.7)'
                ],
                borderColor: [
                    '#dc3545',
                    '#ffc107',
                    '#17a2b8',
                    '#667eea',
                    '#28a745'
                ],
                borderWidth: 2,
                borderRadius: 8,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 14, weight: 'bold' },
                        color: '#333',
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: '#666',
                        font: { size: 12 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666',
                        font: { size: 12 }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Accuracy Pie Chart
    const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
    const accuracyStats = calculateAccuracyStats(studentResults);

    accuracyChart = new Chart(accuracyCtx, {
        type: 'doughnut',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [accuracyStats.correct, accuracyStats.incorrect],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(220, 53, 69, 0.7)'
                ],
                borderColor: [
                    '#28a745',
                    '#dc3545'
                ],
                borderWidth: 2,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 14, weight: 'bold' },
                        color: '#333',
                        padding: 15
                    }
                }
            }
        }
    });
};

// ==================== CALCULATE SCORE DISTRIBUTION ====================
const calculateScoreDistribution = (results) => {
    const distribution = [0, 0, 0, 0, 0];
    
    results.forEach(result => {
        if (result.score <= 5) distribution[0]++;
        else if (result.score <= 10) distribution[1]++;
        else if (result.score <= 15) distribution[2]++;
        else if (result.score <= 20) distribution[3]++;
        else distribution[4]++;
    });

    return distribution;
};

// ==================== CALCULATE ACCURACY STATS ====================
const calculateAccuracyStats = (results) => {
    let correct = 0;
    let incorrect = 0;

    results.forEach(result => {
        correct += result.correct;
        incorrect += result.incorrect;
    });

    return { correct, incorrect };
};

// ==================== LOGOUT ====================
const logout = () => {
    // No confirmation - direct logout
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};

// ==================== LOCAL STORAGE FUNCTIONS ====================
const getStoredUsers = () => {
    const users = localStorage.getItem('quizUsers');
    return users ? JSON.parse(users) : [];
};

const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

const getStoredQuizResults = () => {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : [];
};

// ==================== ADD ANIMATION KEYFRAME ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInRow {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);