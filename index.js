const quiz = document.querySelector('.questions-div');
const configure = document.querySelector('.configure');


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
    .addEventListener('click', () => {
        const selectedCategory = document.querySelector('.categories-grid .active');
        const selectedCount = document.querySelector('.numbers-grid .active');
        const selectedDifficulty = document.querySelector('.difficulty-grid .active');
        const selectedType = document.querySelector('.type-grid .active');

        if (!selectedCategory || !selectedCount|| selectedDifficulty || selectedType) {
            alert('Please select one option from each category');
            return;
        }
        
        configure.style.display = 'none';
        quiz.style.display = 'block';

        const { categoryId } = selectedCategory.dataset;
        const { questionCount } = selectedCount.dataset;
        const { difficulty } = selectedDifficulty.dataset;
        const { questionType } = selectedType.dataset;

        fetchQestions(categoryId, questionCountm, difficulty, questionType)
        
    });



async function fetchQestions(categoryId, questionCount, difficulty, questionType) {
    const response = await fetch(`https://opentdb.com/api.php?amount=${questionCount}&category=${categoryId}&difficulty=${difficulty}&type=${questionType}`);

    const questions = await response.json();

    console.log(questions);
    
}

    