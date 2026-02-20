const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alertBox = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timer = document.querySelector('.timer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const timerValue = document.getElementById('timerValue');

// Comprehensive Quiz Database - 25 Questions
const quiz = [
    {
        question: "Which of the following is NOT a CSS box model property?",
        choices: ["margin", "padding", "border-radius", "border-collapse"],
        answer: "border-collapse"
    },
    {
        question: "Which is NOT a valid JavaScript function declaration?",
        choices: [
            "function test() {}",
            "let test = function() {};",
            "test: function() {}",
            "const test = () => {};"
        ],
        answer: "test: function() {}"
    },
    {
        question: "Which is NOT a JavaScript primitive data type?",
        choices: ["string", "boolean", "object", "float"],
        answer: "float"
    },
    {
        question: "What does 'this' keyword refer to in JavaScript?",
        choices: [
            "Current function",
            "Current object",
            "Parent object",
            "Global comment"
        ],
        answer: "Current object"
    },
    {
        question: "Which HTML tag is used to link external JavaScript files?",
        choices: ["<script>", "<js>", "<link>", "<style>"],
        answer: "<script>"
    },
    {
        question: "Which CSS property controls text color?",
        choices: ["font-color", "color", "text-color", "text-style"],
        answer: "color"
    },
    {
        question: "Which JSON method converts a JSON string to a JavaScript object?",
        choices: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
        answer: "JSON.parse()"
    },
    {
        question: "What is the correct syntax for a single-line comment in JavaScript?",
        choices: ["//", "##", "**", "<!-- -->"],
        answer: "//"
    },
    {
        question: "Which array method adds items to the end of an array?",
        choices: ["push()", "pop()", "shift()", "slice()"],
        answer: "push()"
    },
    {
        question: "Which CSS property is used to create flexible layouts?",
        choices: ["display: flex", "position: flex", "float: flex", "flex: center"],
        answer: "display: flex"
    },
    {
        question: "What will console.log(typeof null) return?",
        choices: ["null", "undefined", "object", "NullType"],
        answer: "object"
    },
    {
        question: "Which method removes the last element from an array?",
        choices: ["remove()", "pop()", "push()", "shift()"],
        answer: "pop()"
    },
    {
        question: "What is the correct way to create a JavaScript object?",
        choices: [
            "var obj = {};",
            "var obj = new Object();",
            "var obj = Object.create();",
            "All of the above"
        ],
        answer: "All of the above"
    },
    {
        question: "Which CSS property is used to add space inside an element's border?",
        choices: ["margin", "padding", "border-spacing", "gap"],
        answer: "padding"
    },
    {
        question: "What is the result of 5 + '5' in JavaScript?",
        choices: ["10", "'55'", "55", "undefined"],
        answer: "'55'"
    },
    {
        question: "Which keyword is used to declare variables with block scope?",
        choices: ["var", "let", "const", "local"],
        answer: "let"
    },
    {
        question: "What does the CSS 'position: absolute' property do?",
        choices: [
            "Positions element relative to parent",
            "Positions element relative to viewport",
            "Positions element relative to nearest positioned ancestor",
            "Positions element relative to document"
        ],
        answer: "Positions element relative to nearest positioned ancestor"
    },
    {
        question: "Which HTTP method is typically used to submit form data?",
        choices: ["GET", "POST", "PUT", "DELETE"],
        answer: "POST"
    },
    {
        question: "What is the purpose of the 'async' keyword in JavaScript?",
        choices: [
            "Makes function asynchronous",
            "Makes function return a Promise",
            "Allows using await inside function",
            "All of the above"
        ],
        answer: "All of the above"
    },
    {
        question: "Which CSS property creates shadow effects around text?",
        choices: ["box-shadow", "text-shadow", "shadow", "text-effect"],
        answer: "text-shadow"
    },
    {
        question: "What is the correct way to write a for loop in JavaScript?",
        choices: [
            "for (let i = 0; i < 10; i++)",
            "for (i = 0; i < 10; i++)",
            "for (let i = 0 to 10)",
            "for i in 0 to 10"
        ],
        answer: "for (let i = 0; i < 10; i++)"
    },
    {
        question: "Which CSS unit is relative to the viewport width?",
        choices: ["px", "em", "vw", "rem"],
        answer: "vw"
    },
    {
        question: "How do you check if a variable is an array in JavaScript?",
        choices: [
            "typeof arr === 'array'",
            "Array.isArray(arr)",
            "arr instanceof Array",
            "Both B and C"
        ],
        answer: "Both B and C"
    },
    {
        question: "Which property is used to change the styling of an HTML element in JavaScript?",
        choices: ["style", "css", "className", "attribute"],
        answer: "style"
    },
    {
        question: "What is the main difference between 'let' and 'var' in JavaScript?",
        choices: [
            "No difference",
            "'let' has block scope, 'var' has function scope",
            "'var' is newer than 'let'",
            "'let' can only be used in loops"
        ],
        answer: "'let' has block scope, 'var' has function scope"
    }
];

// State Variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let totalTime = 15;
let timerID = null;
let answered = false;

// ==================== SHOW QUESTIONS ====================
const showQuestions = () => {
    answered = false;
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;
    choicesBox.innerHTML = "";

    updateProgress();

    questionDetails.choices.forEach((choice) => {
        const choiceDiv = document.createElement("div");
        choiceDiv.textContent = choice;
        choiceDiv.classList.add("choice");
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener("click", () => handleChoiceClick(choiceDiv, choice, questionDetails.answer));
    });

    startTimer();
};

// ==================== HANDLE CHOICE CLICK ====================
const handleChoiceClick = (choiceDiv, selectedChoice, correctAnswer) => {
    if (answered) return;

    answered = true;
    stopTimer();
    disableAllChoices();

    const isCorrect = selectedChoice === correctAnswer;

    if (isCorrect) {
        choiceDiv.classList.add("correct");
        score++;
        showAlert("✓ Correct!", "success");
        playSound('correct');
    } else {
        choiceDiv.classList.add("wrong");
        showAlert("✗ Incorrect", "error");
        playSound('wrong');

        document.querySelectorAll(".choice").forEach(c => {
            if (c.textContent === correctAnswer) {
                c.classList.add("correct");
            }
        });
    }

    updateNavScore();

    setTimeout(() => {
        currentQuestionIndex++;
        timeLeft = totalTime;

        if (currentQuestionIndex < quiz.length) {
            showQuestions();
        } else {
            showScore();
        }
    }, 1500);
};

// ==================== DISABLE ALL CHOICES ====================
const disableAllChoices = () => {
    document.querySelectorAll(".choice").forEach(choice => {
        choice.classList.add("disabled");
    });
};

// ==================== UPDATE PROGRESS ====================
const updateProgress = () => {
    const progress = ((currentQuestionIndex + 1) / quiz.length) * 100;
    progressBar.style.width = progress + "%";
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quiz.length}`;
};

// ==================== UPDATE NAVBAR SCORE ====================
const updateNavScore = () => {
    document.getElementById('navScore').textContent = `Score: ${score}`;
    document.getElementById('navProgress').textContent = `${currentQuestionIndex + 1}/${quiz.length}`;
};

// ==================== SHOW SCORE ====================
const showScore = () => {
    const percentage = (score / quiz.length) * 100;
    const message = getScoreMessage(percentage);
    const gradePoints = Math.round((score / quiz.length) * 100);

    questionBox.textContent = "Assessment Complete";
    choicesBox.innerHTML = "";
    timer.style.display = "none";
    nextBtn.style.display = "none";

    scoreCard.innerHTML = `
        <div class="score-title">${message}</div>
        <div class="score-result">${score} / ${quiz.length}</div>
        <div class="score-details">
            <div class="score-item">
                <div class="score-item-label">Grade</div>
                <div class="score-item-value">${gradePoints}%</div>
            </div>
            <div class="score-item">
                <div class="score-item-label">Correct</div>
                <div class="score-item-value">${score}</div>
            </div>
            <div class="score-item">
                <div class="score-item-label">Incorrect</div>
                <div class="score-item-value">${quiz.length - score}</div>
            </div>
        </div>
        <button class="btn tryAgainBtn"><i class="fas fa-redo"></i> Retake Assessment</button>
    `;

    document.querySelector(".tryAgainBtn").addEventListener("click", startQuiz);
    triggerConfetti();
    playSound('success');
};

// ==================== GET SCORE MESSAGE ====================
const getScoreMessage = (percentage) => {
    if (percentage === 100) return "🌟 Perfect Score! Exceptional!";
    if (percentage >= 90) return "🎯 Outstanding! Excellent Performance!";
    if (percentage >= 80) return "👍 Great Job! Strong Knowledge!";
    if (percentage >= 70) return "📚 Good Work! Keep Practicing!";
    if (percentage >= 60) return "💡 Decent Effort! Review Key Topics!";
    return "💪 Keep Learning! Try Again!";
};

// ==================== SHOW TIMEOUT ====================
const showTimeout = () => {
    questionBox.textContent = "⏰ Time Expired";
    choicesBox.innerHTML = "";
    scoreCard.innerHTML = `
        <button class="btn tryAgainBtn"><i class="fas fa-redo"></i> Retake Assessment</button>
    `;
    nextBtn.style.display = "none";
    timer.style.display = "none";

    showAlert("Time's up for this question!", "error");
    playSound('timeout');

    document.querySelector(".tryAgainBtn").addEventListener("click", startQuiz);
};

// ==================== TIMER ====================
const startTimer = () => {
    clearInterval(timerID);
    timer.style.display = "flex";
    timeLeft = totalTime;
    updateTimerDisplay();

    timerID = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            stopTimer();
            answered = true;
            showTimeout();
        }
    }, 1000);
};

const updateTimerDisplay = () => {
    timerValue.textContent = timeLeft;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (timeLeft / totalTime) * circumference;
    const timerProgress = document.querySelector('.timer-progress');
    if (timerProgress) {
        timerProgress.style.strokeDashoffset = offset;
    }
};

const stopTimer = () => {
    clearInterval(timerID);
};

// ==================== START QUIZ ====================
const startQuiz = () => {
    score = 0;
    currentQuestionIndex = 0;
    timeLeft = totalTime;
    answered = false;

    scoreCard.innerHTML = "";
    nextBtn.style.display = "none";
    timer.style.display = "flex";
    container.classList.add('show');

    updateNavScore();
    updateProgress();
    showQuestions();
};

// ==================== START BUTTON ====================
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    startQuiz();
});

// ==================== SHOW ALERT ====================
const showAlert = (message) => {
    const alertText = document.getElementById('alertText');
    alertText.textContent = message;
    alertBox.classList.add('show');

    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 2000);
};

// ==================== SOUND EFFECTS ====================
const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    switch(type) {
        case 'correct':
            oscillator.frequency.value = 800;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'wrong':
            oscillator.frequency.value = 400;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'success':
            oscillator.frequency.value = 1000;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'timeout':
            oscillator.frequency.value = 300;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
            break;
    }
};

// ==================== CONFETTI ANIMATION ====================
const triggerConfetti = () => {
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

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        if (particles.some(p => p.opacity > 0)) {
            requestAnimationFrame(animate);
        }
    };

    animate();
};

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});