const quiz = document.querySelector('.questions-div');
const configure = document.querySelector('.configure');

let questionIndex = 0; // keep track of current question
let score = 0;

const scoringSystem = { correctAnswer: 5, incorrectAnswer: -2 }


document.querySelectorAll('ul').forEach(ul => {
    ul.addEventListener('click', event => {
        if (event.target.tagName === 'LI') {
            // Remove the 'active' class from all other <li> elements in the same <ul>
            ul.querySelectorAll('li').forEach(li => li.classList.remove('active'));

            // Add the 'active' class to the clicked <li>
            event.target.classList.add('active');
        }
    });
});


document.querySelector('.start-quiz')
    .addEventListener('click', async () => {
        const selectedCategory = document.querySelector('.categories-grid .active');
        const selectedCount = document.querySelector('.numbers-grid .active');
        const selectedDifficulty = document.querySelector('.difficulty-grid .active');
        const selectedType = document.querySelector('.type-grid .active');

        if (!selectedCategory || !selectedCount|| !selectedDifficulty || !selectedType) {
            alert('Please select one option from each category');
            return;
        }

        configure.style.display = 'none';
        quiz.style.display = 'block';

        const { categoryId } = selectedCategory.dataset;
        const { questionCount } = selectedCount.dataset;
        const { difficulty } = selectedDifficulty.dataset;
        const { questionType } = selectedType.dataset;

        const questions = await fetchQestions(categoryId, questionCount, difficulty, questionType);

        renderQuestionHTML(questions);
        console.log(questions);

    });


async function fetchQestions(categoryId, questionCount, difficulty, questionType) {
   try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${questionCount}&category=${categoryId}&difficulty=${difficulty}&type=${questionType}`);

        const data = await response.json(); // parse the response JSON

        return data.results;

   } catch (error) {
        console.log(error);
   }

}


function renderQuestionHTML(questions) {
    try {
        const container = document.querySelector('.questions-div');

        const currentQuestion = questions[questionIndex]; // this is the current question an object

        if (!currentQuestion) {
            throw new Error("Could not retrieve questions from API");
        }


        let questionHTML = `
                <div class="header">
                    <h1>Quiz Application</h1>
                    <button>Time Left: 10s</button>
                </div>

                <p>${currentQuestion.question}</p>
                <ul class="question-options">${answersHTML(currentQuestion)}</ul>

                <div class="questions-left">
                    <p>${questionIndex + 1 } of ${questions.length} Questions</p>
                    <button class="start-quiz js-next-question">Next</button>
                </div>

        `

        document.querySelector('.questions-div')
            .innerHTML = questionHTML;
        
        validateAnswer(currentQuestion); // validate after rendering
        
        container.querySelector('.js-next-question')
            .addEventListener('click', () => {
                nextQuestion(questions);
            });
    } catch (error) {
        console.error(error);
    }
}

// questions =>  array of questions found in data.results;


function answersHTML(question) {
    let answerHTML = '';

    const answers = [question.correct_answer, ...question.incorrect_answers];

    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
            answerHTML += `<li>${answer}</li>`
    });

    return answerHTML;
}

// while we have more questions update question index (current question)
function nextQuestion(questionsArray) {
    if (questionIndex < questionsArray.length - 1) {
        questionIndex++; // Move to the next question
        renderQuestionHTML(questionsArray); // Re-render the next question
    } else {
        document.querySelector('.questions-div')
            .innerHTML = `
                <h3>Final Score</h3>
                <p>${score}</p>
            `
    }
}


function validateAnswer(currentQuestion) {
    const listItems = document.querySelectorAll('.question-options li');

    // the focus event listener is asychronous so we cant return it wont be available
    listItems.forEach(li => {
            li.addEventListener('click', event => {
                if (li.classList.contains('disabled')) {
                    return; // Stop execution if the option is already disabled
                }
            
                listItems.forEach(item => {
                    if (item !== event.target) {
                        item.classList.add('disabled'); // Disable all except the clicked one
                    }
                });
                    
                const correctAnswer = currentQuestion.correct_answer;
                const userAnswer = li.textContent;
                const isCorrect = userAnswer === correctAnswer;

                if (isCorrect) {
                    event.target.classList.add('correct-answer');
                    updateScore(isCorrect);
                } else {
                    event.target.classList.add('wrong-answer');
                    updateScore(isCorrect);
                }
            });
        });
}


function updateScore(isCorrect) {
    if (isCorrect) {
        score += scoringSystem.correctAnswer;
    } else {
        score += scoringSystem.incorrectAnswer;
    }
}
