// ==================== QUIZ DATA ====================
const quiz = [
    { question: "Which of the following is NOT a CSS box model property?", choices: ["margin", "padding", "border-radius", "border-collapse"], answer: "border-collapse" },
    { question: "Which is NOT a valid JavaScript function declaration?", choices: ["function test() {}", "let test = function() {};", "test: function() {}", "const test = () => {};"], answer: "test: function() {}" },
    { question: "Which is NOT a JavaScript primitive data type?", choices: ["string", "boolean", "object", "float"], answer: "float" },
    { question: "What does 'this' keyword refer to in JavaScript?", choices: ["Current function", "Current object", "Parent object", "Global comment"], answer: "Current object" },
    { question: "Which HTML tag is used to link external JavaScript files?", choices: ["<script>", "<js>", "<link>", "<style>"], answer: "<script>" },
    { question: "Which CSS property controls text color?", choices: ["font-color", "color", "text-color", "text-style"], answer: "color" },
    { question: "Which JSON method converts a JSON string to a JavaScript object?", choices: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"], answer: "JSON.parse()" },
    { question: "What is the correct syntax for a single-line comment in JavaScript?", choices: ["//", "##", "**", "<!-- -->"], answer: "//" },
    { question: "Which array method adds items to the end of an array?", choices: ["push()", "pop()", "shift()", "slice()"], answer: "push()" },
    { question: "Which CSS property is used to create flexible layouts?", choices: ["display: flex", "position: flex", "float: flex", "flex: center"], answer: "display: flex" },
    { question: "What will console.log(typeof null) return?", choices: ["null", "undefined", "object", "NullType"], answer: "object" },
    { question: "Which method removes the last element from an array?", choices: ["remove()", "pop()", "push()", "shift()"], answer: "pop()" },
    { question: "What is the correct way to create a JavaScript object?", choices: ["var obj = {};", "var obj = new Object();", "var obj = Object.create();", "All of the above"], answer: "All of the above" },
    { question: "Which CSS property is used to add space inside an element's border?", choices: ["margin", "padding", "border-spacing", "gap"], answer: "padding" },
    { question: "What is the result of 5 + '5' in JavaScript?", choices: ["10", "'55'", "55", "undefined"], answer: "'55'" },
    { question: "Which keyword is used to declare variables with block scope?", choices: ["var", "let", "const", "local"], answer: "let" },
    { question: "What does the CSS 'position: absolute' property do?", choices: ["Positions element relative to parent", "Positions element relative to viewport", "Positions element relative to nearest positioned ancestor", "Positions element relative to document"], answer: "Positions element relative to nearest positioned ancestor" },
    { question: "Which HTTP method is typically used to submit form data?", choices: ["GET", "POST", "PUT", "DELETE"], answer: "POST" },
    { question: "What is the purpose of the 'async' keyword in JavaScript?", choices: ["Makes function asynchronous", "Makes function return a Promise", "Allows using await inside function", "All of the above"], answer: "All of the above" },
    { question: "Which CSS property creates shadow effects around text?", choices: ["box-shadow", "text-shadow", "shadow", "text-effect"], answer: "text-shadow" },
    { question: "What is the correct way to write a for loop in JavaScript?", choices: ["for (let i = 0; i < 10; i++)", "for (i = 0; i < 10; i++)", "for (let i = 0 to 10)", "for i in 0 to 10"], answer: "for (let i = 0; i < 10; i++)" },
    { question: "Which CSS unit is relative to the viewport width?", choices: ["px", "em", "vw", "rem"], answer: "vw" },
    { question: "How do you check if a variable is an array in JavaScript?", choices: ["typeof arr === 'array'", "Array.isArray(arr)", "arr instanceof Array", "Both B and C"], answer: "Both B and C" },
    { question: "Which property is used to change the styling of an HTML element in JavaScript?", choices: ["style", "css", "className", "attribute"], answer: "style" },
    { question: "What is the main difference between 'let' and 'var' in JavaScript?", choices: ["No difference", "'let' has block scope, 'var' has function scope", "'var' is newer than 'let'", "'let' can only be used in loops"], answer: "'let' has block scope, 'var' has function scope" }
];

// ==================== VARIABLES ====================
let currentIndex = 0;
let score = 0;
let time = 20;
let timerInt = null;
let isAnswered = false;
let quizOn = false;

// ==================== GET ELEMENTS ====================
const startBtn = document.getElementById('startBtn');
const quizContainer = document.getElementById('quizContainer');
const questionBox = document.getElementById('questionBox');
const choicesBox = document.getElementById('choicesBox');
const nextBtn = document.getElementById('nextBtn');
const scoreCard = document.getElementById('scoreCard');
const timer = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const timerValue = document.getElementById('timerValue');
const warningModal = document.getElementById('warningModal');
const quitTabBtn = document.getElementById('quitTabBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');

// ==================== CHECK LOGIN ====================
window.addEventListener('load', function() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.isAdmin) {
        window.location.href = 'admin.html';
        return;
    }

    userInfo.textContent = user.name;

    // User profile click
    if (userInfo) {
        userInfo.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // Start button
    if (startBtn) {
        startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startBtn.style.display = 'none';
            quizContainer.classList.add('show');
            quizOn = true;
            currentIndex = 0;
            score = 0;
            time = 20;
            isAnswered = false;
            showQuestion();
        });
    }

    // Quit button
    if (quitTabBtn) {
        quitTabBtn.addEventListener('click', endQuizDueToTabSwitch);
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextQuestion);
    }
});

// ==================== TAB SWITCH DETECTION ====================
document.addEventListener('visibilitychange', function() {
    if (document.hidden && quizOn && isAnswered === false) {
        showWarningModal();
    }
});

// ==================== MODAL FUNCTIONS ====================
function showWarningModal() {
    warningModal.classList.add('show');
}

function hideWarningModal() {
    warningModal.classList.remove('show');
}

// ==================== END QUIZ DUE TO TAB SWITCH ====================
function endQuizDueToTabSwitch() {
    quizOn = false;
    isAnswered = true;
    clearInterval(timerInt);
    hideWarningModal();
    
    currentIndex = 0;
    score = 0;
    time = 20;
    
    scoreCard.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 60px; color: #dc3545; margin-bottom: 20px;">
                <i class="fas fa-times-circle"></i>
            </div>
            <h2 style="font-size: 28px; color: #333; margin-bottom: 15px; font-weight: 700;">Quiz Ended</h2>
            <p style="font-size: 16px; color: #666; margin-bottom: 30px;">You attempted to switch tabs or applications. Your quiz has been terminated.</p>
            <button class="btn tryAgainBtn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; max-width: 300px;">
                <i class="fas fa-redo"></i> Start New Assessment
            </button>
        </div>
    `;
    
    choicesBox.innerHTML = "";
    nextBtn.style.display = "none";
    timer.style.display = "none";
    quizContainer.classList.remove('show');
    startBtn.style.display = "block";
    questionBox.textContent = "";
    progressBar.style.width = "4%";
    progressText.textContent = "Question 1 of 25";
    updateNavScore();
    
    document.querySelector(".tryAgainBtn").addEventListener("click", function() {
        location.reload();
    });
}

// ==================== SHOW QUESTION ====================
function showQuestion() {
    if (currentIndex >= quiz.length) {
        endQuiz();
        return;
    }

    const q = quiz[currentIndex];
    isAnswered = false;
    
    questionBox.textContent = q.question;
    choicesBox.innerHTML = '';
    nextBtn.style.display = 'none';
    
    updateProgress();
    
    q.choices.forEach((choice, idx) => {
        const btn = document.createElement('div');
        btn.className = 'choice';
        btn.textContent = choice;
        btn.onclick = function() {
            if (!isAnswered) {
                isAnswered = true;
                clearInterval(timerInt);
                
                const isCorrect = choice === q.answer;
                
                if (isCorrect) {
                    btn.classList.add('correct');
                    score++;
                    playSound('correct');
                } else {
                    btn.classList.add('wrong');
                    playSound('wrong');
                    
                    const allChoices = choicesBox.querySelectorAll('.choice');
                    allChoices.forEach(choiceBtn => {
                        if (choiceBtn.textContent === q.answer) {
                            choiceBtn.classList.add('correct');
                        }
                    });
                }
                
                document.querySelectorAll('.choice').forEach(b => {
                    b.style.pointerEvents = 'none';
                    b.style.opacity = '0.9';
                });
                
                nextBtn.style.display = 'block';
                updateScore();
            }
        };
        choicesBox.appendChild(btn);
    });
    
    startTimer();
}

// ==================== UPDATE PROGRESS ====================
function updateProgress() {
    const percent = ((currentIndex + 1) / quiz.length) * 100;
    progressBar.style.width = percent + '%';
    progressText.textContent = `Question ${currentIndex + 1} of ${quiz.length}`;
}

// ==================== UPDATE SCORE ====================
function updateScore() {
    document.getElementById('navScore').textContent = 'Score: ' + score;
    document.getElementById('navProgress').textContent = (currentIndex + 1) + '/' + quiz.length;
}

// ==================== TIMER ====================
function startTimer() {
    time = 20;
    timerValue.textContent = time;
    
    timerInt = setInterval(function() {
        time--;
        timerValue.textContent = time;
        
        if (time <= 0) {
            clearInterval(timerInt);
            if (!isAnswered) {
                isAnswered = true;
                questionBox.textContent = '⏰ Time Up!';
                choicesBox.innerHTML = '';
                nextBtn.style.display = 'block';
            }
        }
    }, 1000);
}

// ==================== GO TO NEXT QUESTION ====================
function goToNextQuestion() {
    currentIndex++;
    clearInterval(timerInt);
    showQuestion();
}

// ==================== END QUIZ ====================
function endQuiz() {
    quizOn = false;
    clearInterval(timerInt);
    timer.style.display = 'none';
    nextBtn.style.display = 'none';
    choicesBox.innerHTML = '';
    questionBox.textContent = 'Quiz Complete!';
    
    const percentage = Math.round((score / quiz.length) * 100);
    
    scoreCard.innerHTML = `
        <div class="score-title">Your Score: ${score}/${quiz.length}</div>
        <div class="score-result">${percentage}%</div>
        <div class="score-buttons">
            <button class="btn tryAgainBtn">
                <i class="fas fa-redo"></i> Try Again
            </button>
        </div>
    `;
    
    triggerConfetti();
    playSound('success');
    
    // Save result
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        let results = JSON.parse(localStorage.getItem('quizResults')) || [];
        results.push({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            score: score,
            correct: score,
            incorrect: quiz.length - score,
            percentage: percentage,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('quizResults', JSON.stringify(results));
    }

    document.querySelector('.tryAgainBtn').addEventListener('click', function() {
        location.reload();
    });
}

// ==================== UPDATE NAV SCORE ====================
function updateNavScore() {
    document.getElementById('navScore').textContent = 'Score: ' + score;
    document.getElementById('navProgress').textContent = (currentIndex + 1) + '/' + quiz.length;
}

// ==================== SOUND ====================
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        if (type === 'correct') {
            osc.frequency.value = 800;
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        } else if (type === 'wrong') {
            osc.frequency.value = 400;
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'success') {
            osc.frequency.value = 1000;
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        }
    } catch(e) {}
}

// ==================== CONFETTI ====================
function triggerConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * 5 + 3;
            this.speedY = Math.random() * 5 + 3;
            this.speedX = Math.random() * 4 - 2;
            this.color = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'][Math.floor(Math.random() * 5)];
            this.opacity = 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.speedY += 0.1;
            this.opacity -= 0.02;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        if (particles.some(p => p.opacity > 0)) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}