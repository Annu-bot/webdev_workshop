const quizContainer = document.getElementById('quiz-container');
const questionNumberElement = document.getElementById('question-number');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const previousScoreElement = document.getElementById('previous-score');
const restartButton = document.getElementById('restart-button');
const loginContainer = document.getElementById('login-container');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login-button');

let currentQuestionIndex = 0;
let score = 0;
let previousScore = 0;
let questions = [];
let isAuthenticated = false;

loginButton.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) {
        isAuthenticated = true;
        alert(`Welcome, ${username}!`);
        loginContainer.classList.add('hidden'); 
        fetchQuestions();
    } else {
        alert('Please enter a username.');
    }
});
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();
        questions = data.results;
        startQuiz();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
    finally {
        hideLoading(); 
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0; 
    scoreElement.textContent = `${score} out of ${questions.length}`; 
    scoreContainer.classList.add('hidden');
    nextButton.classList.add('hidden');
    showQuestion(questions[currentQuestionIndex]);
    previousScoreElement.textContent = `Previous Score: ${previousScore} out of 10`;
}

// Show a question
function showQuestion(question) {
    questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    questionElement.innerHTML = question.question;
    optionsElement.innerHTML = '';

    const options = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => selectOption(option, question.correct_answer));
        optionsElement.appendChild(button);
    });
}
function selectOption(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
    }
    nextButton.classList.remove('hidden');
}
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        nextButton.classList.add('hidden');
    } else {
        showScore();
    }
});
function showScore() {
    quizContainer.classList.add('hidden');
    scoreContainer.classList.remove('hidden');
    scoreElement.textContent = `${score} out of ${questions.length}`;
    previousScore = score; 
}
restartButton.addEventListener('click', () => {
    scoreContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    score = 0; // Reset score when restarting
    scoreElement.textContent = `${score} out of ${questions.length}`; 
    fetchQuestions();
});
if (!isAuthenticated) {
    loginContainer.classList.remove('hidden'); 
}