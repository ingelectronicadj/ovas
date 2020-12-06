let self = null;
const selectOption = {
    random: false,
    context: null,
    messageAssertive: null,
    arr_answers: '',
    contextSelect: null,

    validation: (option) => {
        let indexArr = option.attributes.indexOption
            ? option.attributes.indexOption.value
            : 0;
        let wordIndex = parseInt(option.value) + 1;
        let response = option.options[wordIndex].text;
        let questions = selectOption.contextSelect.querySelector('.questionSelect')
            .textContent;

        if (option.value == selectOption.arr_answers[indexArr]) {
            console.log('Es correcto!');
            option.previousSibling.classList.replace('icon-u-wrong', 'icon-u-good');
            option.previousSibling.classList.add('icon-u-good');
            option.classList.add('bien');
            selectOption.messageAssertive.innerHTML = `la opción: '${response}' es correcta, corresponde a la pregunta: ${questions}`;
        } else {
            console.log('Es incorrecto!');
            option.previousSibling.classList.replace('icon-u-good', 'icon-u-wrong');
            option.previousSibling.classList.add('icon-u-wrong');
            option.classList.add('mal');
            selectOption.messageAssertive.innerHTML = `la opcion: '${response}' es incorrecta, no corresponde a la pregunta: ${questions}`;
        }
    },
    initialize: (container, answers, random = false) => {
        self = selectOption;
        selectOption.messageAssertive = document.querySelector('#ariaLiveAssertive');
        self.arr_answers = answers;
        self.context = document.querySelector(container);
        self.context.addEventListener('change', function(e) {
            if (e.target && e.target.classList.contains('c-select')) {
                selectOption.contextSelect = e.target.parentNode.parentNode;
                self.validation(e.target);
            }
        });
    },
};
