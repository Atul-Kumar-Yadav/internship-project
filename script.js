const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

const progress = (remainingTime) => {
    const percentage = (remainingTime / timePerQuestion.value) * 100; // Use timePerQuestion.value for total time
    progressBar.style.width = `${percentage}%`; 
    progressText.innerHTML = `${remainingTime}`;
};

let questions = [],
    time = 30,
    score = 0,
    currentQuestion = 0,
    timer;

const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#num-questions"),
    category = document.querySelector("#category"),
    difficulty = document.querySelector("#difficulty"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startscreen = document.querySelector(".start-screen");

const startQuiz = () => {
    const num = numQuestions.value;
    const cat = category.value;
    const diff = difficulty.value;

    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            startscreen.classList.add("hide");
            quiz.classList.remove("hide");
            currentQuestion = 0;  // Start with the first question
            showQuestion(questions[currentQuestion]);
        });
};

startBtn.addEventListener("click", startQuiz);

const submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");

const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
        answerWrapper = document.querySelector(".answer-wrapper"),
        questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5);
    answerWrapper.innerHTML = "";  // Clear previous answers

    answers.forEach((answer) => {
        answerWrapper.innerHTML += `
        <div class="answer">                       
            <span class="text">${answer}</span>
            <span class="checkbox">
                <span class="icon">√</span>
            </span>
        </div>
        `;
    });

    questionNumber.innerHTML = `
    Question <span class="current">${currentQuestion + 1}</span> 
    <span class="total">/${questions.length}</span>
    `;

    // Enable answer selection
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });
                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    // Set progress bar to 0 before the timer starts
    progressBar.style.width = "0%";
    progressText.innerHTML = "0";

    // Start the timer when question is shown
    time = timePerQuestion.value;
    resetTimer(time);
};

const resetTimer = (totalTime) => {
    if (timer) clearInterval(timer);  // Clear any existing timer
    startTimer(totalTime);
};

const startTimer = (totalTime) => {
    let remainingTime = totalTime;
    timer = setInterval(() => {
        if (remainingTime >= 0) {
            progress(remainingTime);
            remainingTime--; // Decrease remaining time
        } else {
            clearInterval(timer);
        }
    }, 1000);
};

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

const checkAnswer = () => {
    clearInterval(timer);

    const selectedAnswer = document.querySelector(".answer.selected");

    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text");
        if (answer.innerHTML === questions[currentQuestion].correct_answer) {
            score++;
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            const correctAnswer = document.querySelectorAll(".answer")
            .forEach((answer) => {
                if (answer.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) 
                    {
                    answer.classList.add("correct");
                }
            });
        }
    } else {
        const correctAnswer = document.querySelectorAll(".answer")
        .forEach((answer) => {
            if (answer.querySelector(".text").innerHTML === questions[currentQuestion].correct_answer) {
                answer.classList.add("correct");
            }
        });
    }

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) => {
        answer.classList.add("checked");
    });

    submitBtn.style.display = "";
    nextBtn.style.display = "";
};

nextBtn.addEventListener("click", () => {
    nextQuestion();
});

const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(questions[currentQuestion]);
    } else {
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen"),
    finalScore = document.querySelector(".final-score"),
    totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});
