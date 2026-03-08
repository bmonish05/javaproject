// Advanced Java Quiz Questions (25 Questions)
const quizQuestions = [
    {
        question: "What is the correct syntax to declare a variable in Java?",
        options: ["var name = 'value';", "int age = 25;", "declare int age;", "name age = 25;"],
        correct: 1
    },
    {
        question: "Which of the following is NOT a primitive data type in Java?",
        options: ["int", "String", "boolean", "double"],
        correct: 1
    },
    {
        question: "What is the purpose of the 'final' keyword in Java?",
        options: ["To make a class static", "To prevent modification of variables, methods, or classes", "To initialize variables", "To declare abstract methods"],
        correct: 1
    },
    {
        question: "Which method is used to start a thread in Java?",
        options: ["run()", "start()", "execute()", "init()"],
        correct: 1
    },
    {
        question: "What is an interface in Java?",
        options: ["A class with abstract methods", "A blueprint for a class with abstract methods and constants", "A way to create multiple inheritance", "A and B"],
        correct: 3
    },
    {
        question: "What is the difference between ArrayList and LinkedList?",
        options: ["ArrayList is faster for access, LinkedList is faster for insertion/deletion", "LinkedList is faster for access", "No difference", "ArrayList cannot store null values"],
        correct: 0
    },
    {
        question: "Which of the following is the correct way to create a HashMap in Java?",
        options: ["new HashMap<String, Integer>();", "new HashMap(String, Integer);", "HashMap<String> map;", "HashMap map = new HashMap;"],
        correct: 0
    },
    {
        question: "What is the purpose of the 'synchronized' keyword?",
        options: ["To make code run faster", "To prevent multiple threads from accessing a method/block simultaneously", "To declare a constant", "To initialize variables"],
        correct: 1
    },
    {
        question: "What is the correct syntax for exception handling in Java?",
        options: ["try-catch-finally", "catch-try-finally", "handle-exception", "exception-catch"],
        correct: 0
    },
    {
        question: "Which class is the superclass of all classes in Java?",
        options: ["String", "Object", "Class", "System"],
        correct: 1
    },
    {
        question: "What is the purpose of the 'static' keyword?",
        options: ["To make variables constant", "To make methods/variables belong to the class rather than instances", "To prevent inheritance", "To declare abstract methods"],
        correct: 1
    },
    {
        question: "What is method overloading?",
        options: ["Creating multiple methods with the same name but different parameters", "Creating methods with different names", "Creating abstract methods", "Inheriting methods from parent class"],
        correct: 0
    },
    {
        question: "What is the difference between '==' and '.equals()' for String comparison?",
        options: ["'==' compares content, '.equals()' compares reference", "'==' compares reference, '.equals()' compares content", "No difference", "'==' is for primitives only"],
        correct: 1
    },
    {
        question: "What is a lambda expression in Java?",
        options: ["A variable declaration", "A short way to write anonymous functions", "A type of loop", "A way to define classes"],
        correct: 1
    },
    {
        question: "Which is NOT a feature of inheritance in Java?",
        options: ["Code reusability", "Method overriding", "Multiple inheritance", "Polymorphism"],
        correct: 2
    },
    {
        question: "What is the difference between 'throw' and 'throws'?",
        options: ["'throw' throws an exception, 'throws' declares it", "'throws' throws an exception, 'throw' declares it", "No difference", "'throw' is for checked, 'throws' for unchecked"],
        correct: 0
    },
    {
        question: "What is the correct way to create an array in Java?",
        options: ["int array[10];", "int[] array = new int[10];", "array int[10];", "int array[] = 10;"],
        correct: 1
    },
    {
        question: "What is an abstract class?",
        options: ["A class that cannot be instantiated and may contain abstract methods", "A class with no methods", "A class that cannot be inherited", "A class with only static methods"],
        correct: 0
    },
    {
        question: "Which collection class is synchronized in Java?",
        options: ["HashMap", "ArrayList", "Vector", "HashSet"],
        correct: 2
    },
    {
        question: "What is the difference between '++i' and 'i++'?",
        options: ["No difference", "'++i' is prefix increment, 'i++' is postfix increment", "'i++' is faster", "'++i' only works in loops"],
        correct: 1
    },
    {
        question: "What is the purpose of the 'package' keyword in Java?",
        options: ["To declare a variable", "To group related classes and interfaces", "To import libraries", "To declare a class"],
        correct: 1
    },
    {
        question: "What is the correct syntax to handle multiple exceptions?",
        options: ["try-catch(Exception1, Exception2)", "try-catch(Exception1) catch(Exception2)", "try { } catch(Exception1 | Exception2)", "try { } catch-all"],
        correct: 2
    },
    {
        question: "What is the purpose of the 'volatile' keyword in Java?",
        options: ["To make variables constant", "To ensure visibility of changes to variables across threads", "To prevent inheritance", "To make methods abstract"],
        correct: 1
    },
    {
        question: "Which of the following is NOT a type of Java variable?",
        options: ["Instance variable", "Static variable", "Local variable", "Global variable"],
        correct: 3
    },
    {
        question: "What is the correct way to create a thread in Java?",
        options: ["Extend Thread class or implement Runnable interface", "Using new Thread()", "Using Thread.create()", "Using ThreadPool.newThread()"],
        correct: 0
    }
];

let currentQuestion = 0;
let userAnswers = new Array(quizQuestions.length).fill(-1);
let answered = new Array(quizQuestions.length).fill(false);

// Initialize Quiz
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    createProgressIndicator();
    displayQuestion();
});

// Create Progress Indicator
function createProgressIndicator() {
    const indicator = document.getElementById('progressIndicator');
    indicator.innerHTML = '';

    for (let i = 0; i < quizQuestions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i === 0) {
            dot.classList.add('current');
        }
        dot.textContent = i + 1;
        dot.onclick = () => goToQuestion(i);
        indicator.appendChild(dot);
    }
    updateProgressIndicator();
}

// Update Progress Indicator
function updateProgressIndicator() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('current', 'answered', 'unanswered');
        
        if (index === currentQuestion) {
            dot.classList.add('current');
        } else if (answered[index]) {
            dot.classList.add('answered');
        } else {
            dot.classList.add('unanswered');
        }
    });
}

// Display Current Question
function displayQuestion() {
    const question = quizQuestions[currentQuestion];
    const container = document.getElementById('questionContainer');

    let optionsHTML = '';
    question.options.forEach((option, index) => {
        optionsHTML += `
            <label class="option ${userAnswers[currentQuestion] === index ? 'selected' : ''}">
                <input 
                    type="radio" 
                    name="answer" 
                    value="${index}"
                    ${userAnswers[currentQuestion] === index ? 'checked' : ''}
                    onchange="selectAnswer(${index})"
                >
                ${option}
            </label>
        `;
    });

    container.innerHTML = `
        <div class="question-number">Question ${currentQuestion + 1} of ${quizQuestions.length}</div>
        <div class="question-text">${question.question}</div>
        <div class="options">${optionsHTML}</div>
    `;

    // Update question count
    document.getElementById('questionCount').textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').style.display = currentQuestion === quizQuestions.length - 1 ? 'none' : 'block';

    updateProgressIndicator();
    updateScore();
}

// Select Answer
function selectAnswer(index) {
    userAnswers[currentQuestion] = index;
    answered[currentQuestion] = true;
    updateProgressIndicator();
    updateScore();
}

// Navigate Questions
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

function goToQuestion(index) {
    currentQuestion = index;
    displayQuestion();
}

// Update Score
function updateScore() {
    let correct = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
            correct++;
        }
    });
    document.getElementById('currentScore').textContent = `${correct}/${quizQuestions.length}`;
}

// Submit Quiz
function submitQuiz() {
    // Check if all questions are answered
    const allAnswered = answered.every(a => a === true);
    
    if (!allAnswered) {
        const unansweredCount = answered.filter(a => !a).length;
        const confirmSubmit = confirm(`You have ${unansweredCount} unanswered questions. Do you want to submit anyway?`);
        if (!confirmSubmit) return;
    }

    // Calculate results
    let correct = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correct) {
            correct++;
        }
    });

    const results = {
        correctCount: correct,
        incorrectCount: quizQuestions.length - correct,
        totalQuestions: quizQuestions.length,
        percentage: Math.round((correct / quizQuestions.length) * 100),
        userAnswers: userAnswers,
        questions: quizQuestions
    };

    // Save results to localStorage
    localStorage.setItem('quizResults', JSON.stringify(results));

    // Redirect to results page
    window.location.href = 'quiz-results.html';
}