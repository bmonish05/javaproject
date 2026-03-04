// ==================== QUIZ DATA ====================
const quizData = [
    {
        question: "What is the correct way to declare a variable in Java?",
        options: ["var myVar = 5;", "int myVar = 5;", "integer myVar = 5;", "declare int myVar = 5;"],
        correct: 1
    },
    {
        question: "Which of the following is NOT a primitive data type in Java?",
        options: ["int", "double", "String", "boolean"],
        correct: 2
    },
    {
        question: "What is the output of System.out.println(5 + 3 + \"5\");",
        options: ["13", "85", "535", "8"],
        correct: 1
    },
    {
        question: "Which keyword is used to create a class in Java?",
        options: ["type", "class", "define", "struct"],
        correct: 1
    },
    {
        question: "What does the 'new' keyword do in Java?",
        options: ["Creates a new variable", "Allocates memory for an object", "Declares a new method", "Creates a new package"],
        correct: 1
    },
    {
        question: "Which method is the entry point of a Java program?",
        options: ["start()", "run()", "main()", "execute()"],
        correct: 2
    },
    {
        question: "What is the size of int data type in Java?",
        options: ["2 bytes", "4 bytes", "8 bytes", "16 bytes"],
        correct: 1
    },
    {
        question: "Which access modifier is most restrictive in Java?",
        options: ["public", "protected", "private", "default"],
        correct: 2
    },
    {
        question: "What is inheritance in Java?",
        options: ["Copying code from one class to another", "A mechanism to acquire properties from one class to another", "Creating multiple objects", "Declaring variables"],
        correct: 1
    },
    {
        question: "Which keyword is used to implement an interface in Java?",
        options: ["extend", "inherit", "implements", "use"],
        correct: 2
    },
    {
        question: "What is the output of System.out.println(10 / 3);?",
        options: ["3.333", "3.33", "3", "3.0"],
        correct: 2
    },
    {
        question: "Which collection class allows duplicate elements?",
        options: ["Set", "List", "Queue", "Map"],
        correct: 1
    },
    {
        question: "What does the 'static' keyword mean in Java?",
        options: ["Variable cannot change", "Method belongs to the class, not instances", "Variable is fixed in memory", "Method cannot return value"],
        correct: 1
    },
    {
        question: "Which exception is thrown when dividing by zero?",
        options: ["NullPointerException", "ArrayIndexOutOfBoundsException", "ArithmeticException", "NumberFormatException"],
        correct: 2
    },
    {
        question: "What is the purpose of 'this' keyword in Java?",
        options: ["Refers to parent class", "Refers to current object instance", "Refers to static variable", "Refers to interface"],
        correct: 1
    },
    {
        question: "Which loop is used when the number of iterations is not known?",
        options: ["for loop", "while loop", "do-while loop", "for-each loop"],
        correct: 1
    },
    {
        question: "What is an abstract class in Java?",
        options: ["A class that cannot be instantiated", "A class with no methods", "A class that only has static members", "A class that extends another class"],
        correct: 0
    },
    {
        question: "Which method is used to compare strings in Java?",
        options: ["equals()", "compare()", "same()", "check()"],
        correct: 0
    },
    {
        question: "What does the 'final' keyword do when applied to a class?",
        options: ["Class cannot be extended", "Class cannot be instantiated", "Class cannot have methods", "Class becomes abstract"],
        correct: 0
    },
    {
        question: "Which of these is a valid variable name in Java?",
        options: ["2myVar", "my-Var", "my Var", "myVar"],
        correct: 3
    },
    {
        question: "What is the default value of a boolean variable in Java?",
        options: ["0", "1", "false", "true"],
        correct: 2
    },
    {
        question: "What is the purpose of the 'throws' keyword in Java?",
        options: ["To create an exception", "To catch an exception", "To declare that a method throws an exception", "To rethrow an exception"],
        correct: 2
    },
    {
        question: "Which collection is ordered and allows duplicates?",
        options: ["HashSet", "TreeSet", "ArrayList", "HashMap"],
        correct: 2
    },
    {
        question: "What is polymorphism in Java?",
        options: ["Having many forms", "Having many classes", "Having many methods with same name", "Having many objects"],
        correct: 0
    },
    {
        question: "How do you create a constant in Java?",
        options: ["const int x = 5;", "static final int x = 5;", "final int x = 5;", "constant int x = 5;"],
        correct: 2
    }
];

// ==================== GLOBAL VARIABLES ====================
let currentQuestion = 0;
let score = 0;
let selectedAnswers = [];
let timeLeft = 20;
let timerInterval = null;
let quizStarted = false;
let quizEnded = false;
let tabSwitchDetected = false;
let answerSelected = false;

// ==================== INITIALIZATION ====================
window.addEventListener('load', function() {
    init();
});

function init() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Profile Button
    document.getElementById('profileBtn').addEventListener('click', function(e) {
        e.preventDefault();
        goToProfile();
    });

    // Logout Button
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        handleLogout();
    });

    // Start Button
    document.querySelector('.startBtn').addEventListener('click', function(e) {
        e.preventDefault();
        startQuiz();
    });

    // Next Button
    document.querySelector('.nextBtn').addEventListener('click', function(e) {
        e.preventDefault();
        nextQuestion();
    });

    // Quit Button
    document.getElementById('quitTabBtn').addEventListener('click', function(e) {
        e.preventDefault();
        showTabSwitchResults();
    });

    // Tab switch detection
    document.addEventListener('visibilitychange', handleTabSwitch);
    window.addEventListener('blur', handleWindowBlur);
}

// ==================== PROFILE NAVIGATION ====================
function goToProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (quizStarted && !quizEnded) {
        alert('⚠️ Please complete or end the quiz first!');
        return;
    }

    window.location.href = 'profile.html';
}

// ==================== LOGOUT ====================
function handleLogout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    if (quizStarted && !quizEnded) {
        if (confirm('❌ Quiz is in progress!\n\nAre you sure you want to logout?')) {
            performLogout();
        }
    } else {
        performLogout();
    }
}

function performLogout() {
    clearInterval(timerInterval);
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// ==================== START QUIZ ====================
function startQuiz() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    quizStarted = true;
    tabSwitchDetected = false;
    document.querySelector('.startBtn').style.display = 'none';
    document.querySelector('.container').classList.add('show');
    
    loadQuestion();
}

// ==================== LOAD QUESTION ====================
function loadQuestion() {
    if (currentQuestion >= quizData.length) {
        endQuiz();
        return;
    }

    answerSelected = false;
    const question = quizData[currentQuestion];
    
    // Update progress
    document.getElementById('progressText').textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
    const progressPercent = ((currentQuestion + 1) / quizData.length) * 100;
    document.getElementById('progressBar').style.width = progressPercent + '%';
    document.getElementById('navProgress').textContent = `${currentQuestion + 1}/${quizData.length}`;
    
    // Display question
    document.querySelector('.question').textContent = question.question;
    
    // Display choices
    const choicesContainer = document.querySelector('.choices');
    choicesContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const choice = document.createElement('div');
        choice.className = 'choice';
        choice.textContent = option;
        choice.addEventListener('click', function() {
            selectAnswer(index);
        });
        choicesContainer.appendChild(choice);
    });
    
    // Hide next button
    document.querySelector('.nextBtn').style.display = 'none';
    document.querySelector('.scoreCard').innerHTML = '';
    
    // Start timer
    timeLeft = 20;
    updateTimer();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// ==================== SELECT ANSWER ====================
function selectAnswer(index) {
    if (quizEnded || answerSelected) return;
    
    answerSelected = true;
    const question = quizData[currentQuestion];
    const choices = document.querySelectorAll('.choice');
    
    // Disable all choices
    choices.forEach(choice => {
        choice.style.pointerEvents = 'none';
    });
    
    // Store answer
    selectedAnswers[currentQuestion] = index;
    
    // Show feedback
    choices.forEach((choice, i) => {
        if (i === question.correct) {
            choice.classList.add('correct');
        } else if (i === index && index !== question.correct) {
            choice.classList.add('wrong');
        }
    });
    
    // Update score
    if (index === question.correct) {
        score++;
        document.getElementById('navScore').textContent = `Score: ${score}`;
    }
    
    // Stop timer
    clearInterval(timerInterval);
    
    // Show next button
    setTimeout(() => {
        document.querySelector('.nextBtn').style.display = 'block';
    }, 1500);
}

// ==================== NEXT QUESTION ====================
function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

// ==================== UPDATE TIMER ====================
function updateTimer() {
    document.getElementById('timerValue').textContent = timeLeft;
    
    // Update circle
    const circle = document.querySelector('.timer-progress');
    if (circle) {
        const circumference = 282.7;
        const offset = circumference - (timeLeft / 20) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    // Color
    const timerValue = document.getElementById('timerValue');
    if (timeLeft <= 5) timerValue.style.color = '#dc3545';
    else if (timeLeft <= 10) timerValue.style.color = '#ffc107';
    else timerValue.style.color = '#fff';
    
    timeLeft--;
    
    if (timeLeft < 0) {
        clearInterval(timerInterval);
        if (!answerSelected) {
            autoNextQuestion();
        }
    }
}

// ==================== AUTO NEXT ====================
function autoNextQuestion() {
    const choices = document.querySelectorAll('.choice');
    const question = quizData[currentQuestion];
    
    if (selectedAnswers[currentQuestion] === undefined) {
        selectedAnswers[currentQuestion] = -1;
    }
    
    choices.forEach((choice, i) => {
        if (i === question.correct) {
            choice.classList.add('correct');
        }
    });
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 2000);
}

// ==================== END QUIZ ====================
function endQuiz() {
    quizEnded = true;
    clearInterval(timerInterval);
    
    // Hide elements
    document.querySelector('.progress-section').style.display = 'none';
    document.querySelector('.question-card').style.display = 'none';
    document.querySelector('.choices-container').style.display = 'none';
    document.querySelector('.nextBtn').style.display = 'none';
    document.querySelector('.timer-wrapper').style.display = 'none';
    
    // Calculate
    const percentage = Math.round((score / quizData.length) * 100);
    const incorrect = quizData.length - score;
    
    // Save result
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    results.push({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        score: score,
        correct: score,
        incorrect: incorrect,
        percentage: percentage,
        totalQuestions: quizData.length
    });
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Display
    displayResults(percentage, incorrect);
    
    if (percentage >= 60) {
        createConfetti();
    }
}

// ==================== DISPLAY RESULTS ====================
function displayResults(percentage, incorrect) {
    const scoreCard = document.querySelector('.scoreCard');
    
    let resultMessage = '';
    let resultColor = '#28a745';
    
    if (percentage >= 90) resultMessage = '🏆 Outstanding!';
    else if (percentage >= 80) resultMessage = '⭐ Excellent!';
    else if (percentage >= 70) resultMessage = '👍 Good Job!';
    else if (percentage >= 60) resultMessage = '✓ Passed!';
    else {
        resultMessage = '📚 Keep Practicing!';
        resultColor = '#dc3545';
    }
    
    scoreCard.innerHTML = `
        <div class="score-result" style="color: ${resultColor};">${percentage}%</div>
        <div class="score-title">${resultMessage}</div>
        <div class="score-details">
            <div class="score-item">
                <div class="score-item-label">Correct</div>
                <div class="score-item-value" style="color: #28a745;">${score}</div>
            </div>
            <div class="score-item">
                <div class="score-item-label">Incorrect</div>
                <div class="score-item-value" style="color: #dc3545;">${incorrect}</div>
            </div>
            <div class="score-item">
                <div class="score-item-label">Accuracy</div>
                <div class="score-item-value" style="color: #667eea;">${percentage}%</div>
            </div>
        </div>
        <div class="score-buttons">
            <button class="btn tryAgainBtn" onclick="retakeQuiz()">
                <i class="fas fa-redo"></i> Retake Quiz
            </button>
            <button class="btn endQuizBtn" onclick="location.href='profile.html'">
                <i class="fas fa-chart-bar"></i> View Profile
            </button>
        </div>
    `;
    
    scoreCard.style.display = 'block';
}

// ==================== RETAKE QUIZ ====================
function retakeQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswers = [];
    timeLeft = 20;
    quizStarted = false;
    quizEnded = false;
    tabSwitchDetected = false;
    answerSelected = false;
    
    clearInterval(timerInterval);
    
    document.querySelector('.startBtn').style.display = 'block';
    document.querySelector('.container').classList.remove('show');
    document.getElementById('navScore').textContent = 'Score: 0';
    document.getElementById('navProgress').textContent = '0/25';
    
    document.querySelector('.progress-section').style.display = 'block';
    document.querySelector('.question-card').style.display = 'block';
    document.querySelector('.choices-container').style.display = 'block';
    document.querySelector('.timer-wrapper').style.display = 'block';
    
    startQuiz();
}

// ==================== TAB SWITCH ====================
function handleTabSwitch() {
    if (document.hidden && quizStarted && !quizEnded && !tabSwitchDetected) {
        tabSwitchDetected = true;
        document.getElementById('warningModal').classList.add('show');
    }
}

function handleWindowBlur() {
    if (quizStarted && !quizEnded && !tabSwitchDetected) {
        tabSwitchDetected = true;
        document.getElementById('warningModal').classList.add('show');
    }
}

// ==================== TAB SWITCH RESULTS ====================
function showTabSwitchResults() {
    const modal = document.getElementById('warningModal');
    modal.classList.remove('show');
    
    quizEnded = true;
    clearInterval(timerInterval);
    
    document.querySelector('.progress-section').style.display = 'none';
    document.querySelector('.question-card').style.display = 'none';
    document.querySelector('.choices-container').style.display = 'none';
    document.querySelector('.nextBtn').style.display = 'none';
    document.querySelector('.timer-wrapper').style.display = 'none';
    
    const percentage = currentQuestion > 0 ? Math.round((score / quizData.length) * 100) : 0;
    const incorrect = currentQuestion - score;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const results = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    results.push({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        score: score,
        correct: score,
        incorrect: incorrect,
        percentage: percentage,
        totalQuestions: quizData.length,
        quizTerminated: true,
        questionsAttempted: currentQuestion
    });
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    const scoreCard = document.querySelector('.scoreCard');
    scoreCard.innerHTML = `
        <div class="score-result" style="color: #dc3545;">Quiz Terminated</div>
        <div class="score-title">⚠️ Tab Switch Detected</div>
        <div class="score-details">
            <div class="score-item">
                <div class="score-item-label">Questions Attempted</div>
                <div class="score-item-value" style="color: #667eea;">${currentQuestion}/${quizData.length}</div>
            </div>
            <div class="score-item">
                <div class="score-item-label">Correct</div>
                <div class="score-item-value" style="color: #28a745;">${score}</div>
            </div>
            <div class="score-item">
                <div class="score-item-label">Accuracy</div>
                <div class="score-item-value" style="color: #ffc107;">${percentage}%</div>
            </div>
        </div>
        <div class="score-buttons">
            <button class="btn tryAgainBtn" onclick="retakeQuiz()">
                <i class="fas fa-redo"></i> Retake Quiz
            </button>
            <button class="btn endQuizBtn" onclick="location.href='profile.html'">
                <i class="fas fa-chart-bar"></i> View Profile
            </button>
        </div>
    `;
    
    scoreCard.style.display = 'block';
}

// ==================== CONFETTI ====================
function createConfetti() {
    const canvas = document.getElementById('confetti');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 5,
            color: ['#667eea', '#764ba2', '#f093fb', '#28a745', '#ffc107', '#dc3545'][Math.floor(Math.random() * 6)],
            size: Math.random() * 10 + 5,
            rotation: Math.random() * Math.PI * 2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.rotation += 0.1;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
            
            if (p.y > canvas.height) confetti.splice(i, 1);
        });
        
        if (confetti.length > 0) requestAnimationFrame(animate);
    }
    
    animate();
}

// ==================== WINDOW RESIZE ====================
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});