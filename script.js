const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alertBox = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timer = document.querySelector('.timer');

const quiz = [
    {
        question: "Q. Which of the following is not a CSS box model property?",
        choices: ["margin", "padding", "border-radius", "border-collapse"],
        answer: "border-collapse"
    },
    {
        question: "Q. Which is not valid JS function declaration?",
        choices: [
            "function test() {}",
            "let test = function() {};",
            "test: function() {}",
            "const test = () => {};"
        ],
        answer: "test: function() {}"
    },
    {
        question: "Q. Which is not JavaScript data type?",
        choices: ["string", "boolean", "object", "float"],
        answer: "float"
    },
    {
        question: "Q. What does 'this' refer to?",
        choices: [
            "Current function",
            "Current object",
            "Parent object",
            "Comment"
        ],
        answer: "Current object"
    },
    {
        question: "Q. Which tag links JavaScript?",
        choices: ["<script>", "<js>", "<link>", "<style>"],
        answer: "<script>"
    },
    {
        question: "Q. Which CSS property sets text color?",
        choices: ["font-color", "color", "text-color", "background"],
        answer: "color"
    },
    {
        question: "Q. Which method converts JSON to object?",
        choices: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.object()"],
        answer: "JSON.parse()"
    },
    {
        question: "Q. Which symbol is JS comment?",
        choices: ["//", "##", "**", "<!-- -->"],
        answer: "//"
    },
    {
        question: "Q. Which array method adds item at end?",
        choices: ["push()", "pop()", "shift()", "slice()"],
        answer: "push()"
    },
    {
        question: "Q. Flexbox property?",
        choices: ["display: flex", "position: flex", "float: flex", "flex: center"],
        answer: "display: flex"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerID = null;
let answered = false;

// SHOW QUESTIONS
const showQuestions = () => {
    answered = false;
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;
    choicesBox.innerHTML = "";

    questionDetails.choices.forEach(choice => {
        const choiceDiv = document.createElement("div");
        choiceDiv.textContent = choice;
        choiceDiv.classList.add("choice");
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener("click", () => {
            if (answered) return;

            answered = true;
            stopTimer();

            const correctAnswer = quiz[currentQuestionIndex].answer;

            if (choice === correctAnswer) {
                choiceDiv.classList.add("correct");
                score++;
            } else {
                choiceDiv.classList.add("wrong");

                document.querySelectorAll(".choice").forEach(c => {
                    if (c.textContent === correctAnswer) {
                        c.classList.add("correct");
                    }
                });
            }

            setTimeout(() => {
                currentQuestionIndex++;
                timeLeft = 15;

                if (currentQuestionIndex < quiz.length) {
                    showQuestions();
                } else {
                    showScore();
                }
            }, 1500);
        });
    });

    startTimer();
};

// SHOW SCORE
const showScore = () => {
    questionBox.textContent = "🎉 Quiz Completed!";
    choicesBox.innerHTML = "";
    scoreCard.innerHTML = `
        <div class="scoreAnimation">
            You Scored ${score} / ${quiz.length}
        </div>
        <button class="btn tryAgainBtn">Play Again</button>
    `;
    timer.style.display = "none";
    nextBtn.style.display = "none";

    document.querySelector(".tryAgainBtn").addEventListener("click", startQuiz);
};

// TIMEOUT SCREEN
const showTimeout = () => {
    questionBox.textContent = "⏰ Time Out!";
    choicesBox.innerHTML = "";
    scoreCard.innerHTML = `
        <button class="btn tryAgainBtn">Try Again</button>
    `;
    nextBtn.style.display = "none";
    timer.style.display = "none";

    document.querySelector(".tryAgainBtn").addEventListener("click", startQuiz);
};

// TIMER
const startTimer = () => {
    clearInterval(timerID);
    timer.style.display = "flex";
    timer.textContent = timeLeft;

    timerID = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;

        if (timeLeft <= 0) {
            stopTimer();
            showTimeout();
        }
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerID);
};

// START QUIZ
const startQuiz = () => {
    score = 0;
    currentQuestionIndex = 0;
    timeLeft = 15;

    scoreCard.innerHTML = "";
    nextBtn.style.display = "none";
    timer.style.display = "flex";

    showQuestions();
};

// START BUTTON
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    container.style.display = "block";
    startQuiz();
});