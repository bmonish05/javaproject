// ==================== QUIZ VARIABLES ====================
let currentQuestion = 0;
let score = 0;
let answers = {};
let quizStarted = false;
let quizEnded = false;
let timeLeft = 3600;
let timerInterval;
let currentUser = null;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Quiz Questions Available:', quizQuestions ? quizQuestions.length : 'NOT LOADED');
    
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (currentUser.isAdmin) {
        window.location.href = 'admin.html';
        return;
    }

    document.getElementById('userInfo').innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name}`;

    // Setup event listeners
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitBtn').addEventListener('click', submitQuiz);
    document.getElementById('tryAgainBtn').addEventListener('click', resetQuiz);
    document.getElementById('endQuizBtn').addEventListener('click', goToProfile);
});

// ==================== START QUIZ ====================
function startQuiz() {
    console.log('Starting Quiz - Total Questions:', quizQuestions.length);
    
    quizStarted = true;
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('quizWrapper').style.display = 'block';
    
    currentQuestion = 0;
    score = 0;
    answers = {};
    timeLeft = 3600;
    
    startTimer();
    displayQuestion();
}

// ==================== DISPLAY QUESTION ====================
function displayQuestion() {
    console.log('Displaying Question:', currentQuestion);
    
    if (currentQuestion >= quizQuestions.length) {
        console.log('All questions answered, submitting');
        submitQuiz();
        return;
    }

    const question = quizQuestions[currentQuestion];
    console.log('Question Data:', question);
    
    document.getElementById('questionText').textContent = question.question;
    
    const choicesContainer = document.getElementById('choicesContainer');
    choicesContainer.innerHTML = '';

    question.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.textContent = choice;
        
        if (answers[currentQuestion] === index) {
            btn.classList.add('selected');
        }

        btn.addEventListener('click', function() {
            selectAnswer(index);
        });
        
        choicesContainer.appendChild(btn);
    });

    document.getElementById('progressText').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    if (currentQuestion === quizQuestions.length - 1) {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'block';
    } else {
        document.getElementById('nextBtn').style.display = 'block';
        document.getElementById('submitBtn').style.display = 'none';
    }

    document.getElementById('navProgress').textContent = `${currentQuestion + 1}/25`;
    document.getElementById('navScore').textContent = `Score: ${score}`;
}

// ==================== SELECT ANSWER ====================
function selectAnswer(index) {
    console.log('Answer selected - Index:', index);
    answers[currentQuestion] = index;
    
    document.querySelectorAll('.choice').forEach((choice, idx) => {
        choice.classList.remove('selected');
        if (idx === index) {
            choice.classList.add('selected');
        }
    });
}

// ==================== NEXT QUESTION ====================
function nextQuestion() {
    console.log('Moving to next question');
    if (answers[currentQuestion] === undefined) {
        alert('Please select an answer!');
        return;
    }
    currentQuestion++;
    displayQuestion();
}

// ==================== SUBMIT QUIZ ====================
function submitQuiz() {
    console.log('Submitting Quiz');
    if (answers[currentQuestion] === undefined) {
        alert('Please answer all questions!');
        return;
    }

    clearInterval(timerInterval);
    calculateScore();
}

// ==================== CALCULATE SCORE ====================
function calculateScore() {
    console.log('Calculating Score');
    let correct = 0;
    let incorrect = 0;

    quizQuestions.forEach((question, index) => {
        console.log(`Q${index}: User answered ${answers[index]}, Correct is ${question.correct}`);
        if (answers[index] === question.correct) {
            correct++;
            console.log('✓ CORRECT');
        } else {
            incorrect++;
            console.log('✗ WRONG');
        }
    });

    const percentage = Math.round((correct / quizQuestions.length) * 100);
    console.log('Final Score:', correct, '/', quizQuestions.length, '=', percentage, '%');

    const result = {
        userId: currentUser.id,
        score: correct,
        correct: correct,
        incorrect: incorrect,
        percentage: percentage,
        timestamp: new Date().toISOString()
    };

    let results = getStoredQuizResults();
    results.push(result);
    saveQuizResults(results);

    showScore(correct, incorrect, percentage);
}

// ==================== SHOW SCORE ====================
function showScore(correct, incorrect, percentage) {
    console.log('Showing Score:', correct, incorrect, percentage);
    
    quizEnded = true;
    document.getElementById('quizWrapper').style.display = 'none';
    document.getElementById('scoreSection').style.display = 'block';

    document.getElementById('scoreResult').textContent = `${correct}/25`;
    document.getElementById('correctCount').textContent = percentage + '%';
    document.getElementById('correctAnswers').textContent = correct;
    document.getElementById('incorrectAnswers').textContent = incorrect;

    let message = '';
    if (percentage >= 80) {
        message = '🎉 Excellent! You scored above 80%!';
    } else if (percentage >= 60) {
        message = '👍 Good job! Keep practicing!';
    } else {
        message = '💪 Keep trying! You\'ll do better next time!';
    }

    document.getElementById('scoreMessage').textContent = message;
    playConfetti();
}

// ==================== RESET QUIZ ====================
function resetQuiz() {
    console.log('Resetting Quiz');
    currentQuestion = 0;
    score = 0;
    answers = {};
    quizStarted = false;
    quizEnded = false;
    timeLeft = 3600;

    document.getElementById('welcomeSection').style.display = 'block';
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('quizWrapper').style.display = 'none';
    document.getElementById('scoreSection').style.display = 'none';
}

// ==================== GO TO PROFILE ====================
function goToProfile() {
    window.location.href = 'profile.html';
}

// ==================== DIRECT LOGOUT ====================
function directLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ==================== TIMER ====================
function startTimer() {
    timerInterval = setInterval(function() {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerValue').textContent = 
        String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

    const totalSeconds = 3600;
    const progress = (timeLeft / totalSeconds) * 282.7;
    document.querySelector('.timer-progress').style.strokeDashoffset = progress;
}

// ==================== CONFETTI ====================
function playConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 5,
            life: 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= 0.01;

            if (p.life > 0) {
                ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${p.life})`;
                ctx.fillRect(p.x, p.y, 10, 10);
                return true;
            }
            return false;
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// ==================== UTILITY FUNCTIONS ====================
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function getStoredQuizResults() {
    const results = localStorage.getItem('quizResults');
    return results ? JSON.parse(results) : [];
}

function saveQuizResults(results) {
    localStorage.setItem('quizResults', JSON.stringify(results));
}