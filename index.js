const quiz = document.querySelector('.questions-div');
const configure = document.querySelector('.configure');

let questionIndex = 0; // keep track of current question

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
    const container = document.querySelector('.questions-div');

    const currentQuestion = questions[questionIndex]; // this is the current question an object
    console.log(currentQuestion)

    let questionHTML = `
            <div class="header">
                <h1>Quiz Application</h1>
                <button>7s</button>
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

        container.querySelector('.js-next-question')
            .addEventListener('click', () => {
                nextQuestion(questions);
            });
    }

// questions =>  array of questions found in data.results;


function answersHTML(question) {
    let answerHTML = '';

    const answers = [question.correct_answer, ...question.incorrect_answers];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
            answerHTML += `<li tabindex="0">${answer}</li>`
    });

    return answerHTML;
}

// while we have more questions update question index (current question)
function nextQuestion(questionsArray) {
    if (questionIndex < questionsArray.length - 1) {
        questionIndex++; // Move to the next question
        renderQuestionHTML(questionsArray); // Re-render the next question
    } else {
        // display score;
    }
}

// after the first question when attempting to click next it return a TypeError

