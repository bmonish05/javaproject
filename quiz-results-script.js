let pieChart, barChart;

// Initialize Results Page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    // Get results from localStorage
    const results = JSON.parse(localStorage.getItem('quizResults'));
    if (!results) {
        window.location.href = 'assignment-quiz.html';
        return;
    }

    displayResults(results);
    createCharts(results);
    displayDetailedResults(results);
});

// Display Results
function displayResults(results) {
    document.getElementById('correctCount').textContent = results.correctCount;
    document.getElementById('incorrectCount').textContent = results.incorrectCount;
    document.getElementById('totalQuestions').textContent = results.totalQuestions;
    document.getElementById('percentage').textContent = results.percentage + '%';

    // Determine performance level
    let performanceLevel = '';
    let performanceClass = '';

    if (results.percentage >= 90) {
        performanceLevel = '🎉 Excellent Performance! (90-100%)';
        performanceClass = 'excellent';
    } else if (results.percentage >= 75) {
        performanceLevel = '👍 Good Job! (75-89%)';
        performanceClass = 'good';
    } else if (results.percentage >= 60) {
        performanceLevel = '📚 Average Performance (60-74%)';
        performanceClass = 'average';
    } else {
        performanceLevel = '💪 Keep Practicing! (<60%)';
        performanceClass = 'poor';
    }

    const performanceDiv = document.getElementById('performanceLevel');
    performanceDiv.textContent = performanceLevel;
    performanceDiv.className = 'performance-level ' + performanceClass;
}

// Create Charts
function createCharts(results) {
    createPieChart(results);
    createBarChart(results);
}

// Pie Chart - Answer Distribution
function createPieChart(results) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [results.correctCount, results.incorrectCount],
                backgroundColor: [
                    '#27ae60',
                    '#e74c3c'
                ],
                borderColor: [
                    '#229954',
                    '#c0392b'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 14 },
                        padding: 20
                    }
                }
            }
        }
    });
}

// Bar Chart - Performance Graph
function createBarChart(results) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Score'],
            datasets: [
                {
                    label: 'Your Score',
                    data: [results.percentage],
                    backgroundColor: '#667eea',
                    borderColor: '#764ba2',
                    borderWidth: 2
                },
                {
                    label: 'Perfect Score',
                    data: [100],
                    backgroundColor: '#d0d0d0',
                    borderColor: '#999',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 14 },
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Display Detailed Results
function displayDetailedResults(results) {
    const detailedDiv = document.getElementById('detailedResults');
    let html = '';

    results.questions.forEach((question, index) => {
        const userAnswer = results.userAnswers[index];
        const correctAnswer = question.correct;
        const isCorrect = userAnswer === correctAnswer;

        const questionClass = isCorrect ? 'correct' : 'incorrect';
        const icon = isCorrect ? '✓' : '✗';

        let answerHTML = `
            <div class="question-review ${questionClass}">
                <div class="review-question">Q${index + 1}. ${question.question}</div>
        `;

        question.options.forEach((option, optionIndex) => {
            let answerClass = '';
            let answerText = '';

            if (optionIndex === correctAnswer) {
                answerClass = 'correct';
                answerText = '✓ Correct Answer';
            } else if (optionIndex === userAnswer && !isCorrect) {
                answerClass = 'incorrect';
                answerText = '✗ Your Answer';
            } else {
                return; // Skip displaying other wrong answers
            }

            answerHTML += `
                <div class="review-answer ${answerClass}">
                    <span class="answer-icon">${answerClass === 'correct' ? '✓' : '✗'}</span>
                    <span>${option}</span>
                </div>
            `;
        });

        // If user didn't answer
        if (userAnswer === -1) {
            answerHTML += `
                <div class="review-answer incorrect">
                    <span class="answer-icon">✗</span>
                    <span>You didn't answer this question</span>
                </div>
                <div class="review-answer correct">
                    <span class="answer-icon">✓</span>
                    <span>Correct Answer: ${question.options[correctAnswer]}</span>
                </div>
            `;
        }

        answerHTML += '</div>';
        html += answerHTML;
    });

    detailedDiv.innerHTML = html;
}

// Navigation Functions
function goToDashboard() {
    if (confirm('Go back to dashboard?')) {
        window.location.href = 'student_dashboard.html';
    }
}

function retryQuiz() {
    // Clear previous results
    localStorage.removeItem('quizResults');
    window.location.href = 'assignment-quiz.html';
}