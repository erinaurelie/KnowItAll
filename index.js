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

