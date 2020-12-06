let btnHints = document.querySelectorAll('.helpHint');
let btnHelp50 = document.querySelectorAll('.help50');
let btnBack = document.querySelector('#btnBack');
let btnNext = document.querySelector('.next');
let context = document.querySelector('.ova_slider');
let feedbackElm;
let totalQuestions;

btnNext.textContent = 'Iniciar Juego';
btnNext.classList.add('icon-u-play');
btnNext.classList.add('c-btn_default');
btnBack.setAttribute('hidden', 'hidden');

let alerts = [
    '¡Ups! Parece que no es correcto.',
    '¡Bien hecho! Siga con la siguiente pregunta.',
    '¡Bien hecho! Fin del juego.',
    '¡Ups! No es correcto, fin del juego.',
];
let indexQuestion = 1;
let indexHint = 0;
let hintTexElm = document.querySelector('#hint .js-millonarie-clue');

let init = (responsesArray) => {
    let containersGame = document.querySelectorAll('.millionaire');
    let indexArrayResponse = 0;
    totalQuestions = responsesArray.length;
    containersGame.forEach((container) => {
        container.dataset.questionId = indexQuestion;
        let responsesCorrect = container.querySelectorAll('.responses');
        let indexResponse = 1;
        responsesCorrect.forEach((responseCorrect) => {
            responseCorrect.dataset.responseId = indexResponse;
            if (indexResponse == responsesArray[indexArrayResponse]) {
                responseCorrect.dataset.response = 'Correct';
            } else {
                responseCorrect.dataset.response = 'Incorrect';
            }
            indexResponse += 1;
        });

        let help50 = container.querySelector('.help50');
        help50.setAttribute('id', `help50-${indexQuestion}`);
        let helpHint = container.querySelector('.helpHint');
        helpHint.setAttribute('id', `helpHint-${indexQuestion}`);
        helpHint.classList.add('open-image');
        indexArrayResponse += 1;
        indexQuestion += 1;
    });
};

let getClue = () => {
    hintTexElm.innerText = hintsArray[indexHint - 1];
};

let validate = (e) => {
    let field = document.activeElement.dataset.response
        ? document.activeElement
        : e.target;
    let parentField = field.parentNode.parentNode;
    let valueField = field.dataset.response;
    feedback(valueField);
    let responsesDisabled = parentField.querySelectorAll('.responses');
    responsesDisabled.forEach((responses) => {
        // responses.setAttribute('disabled', 'true');
        responses.classList.remove('Correct');
        responses.classList.remove('Incorrect');
    });
    field.classList.add(valueField == 'Correct' ? valueField : 'Incorrect');
    btnNext.innerHTML = 'Siguiente Pregunta <i class="icon-u-arrow-forward">';
    btnNext.classList.add('c-btn_default');
    btnNext.removeAttribute('hidden');
};

let help50 = (e) => {
    let helpActive = document.activeElement.classList.contains('js-millionaire_help50')
        ? document.activeElement
        : e.target;
    let optionsContext = helpActive.parentNode.parentNode;

    let availableOptions;
    let arrOptionsA = [];

    let countOptions = optionsContext.querySelectorAll('.responses');
    let optionsDelet = [];
    let longOptions;
    countOptions.forEach((option) => {
        let optionsList = option.dataset.response;
        if (optionsList != 'Correct') {
            optionsDelet.push(optionsList);
        }
    });

    longOptions =
        optionsDelet.length % 2 ? (optionsDelet.length + 1) / 2 : optionsDelet.length / 2;

    for (let index = 0; index < longOptions; index++) {
        let option = optionsDelet[index];
        optionsContext.querySelector('[data-response = "' + option + '"]').remove();
    }

    helpActive.setAttribute('disabled', 'true');
    helpActive.classList.add('blocked');

    availableOptions = helpActive.parentNode.parentNode.querySelectorAll('.responses');

    availableOptions.forEach((optionA, index) => {
        arrOptionsA[index] = optionA.innerHTML;
    });
    ariaLiveAssertive.innerHTML = `La ayuda de cincuenta cincuenta ha sido activada, quedaron las opciones: ${arrOptionsA}, desplácese con la tecla tabulación hasta llegar a las opciones de respuesta.`;
};

let feedback = (valueField) => {
    let currentSlide = document.querySelector('.currentSlide');
    let slideActive = currentSlide.querySelector('.millionaire').dataset.questionId;

    feedbackElm = currentSlide.querySelector('.alertFeedback .hintMessage');
    let parentFeed = feedbackElm.parentElement;
    parentFeed.classList.remove('Correct');
    parentFeed.classList.remove('Incorrect');
    if (valueField == 'Correct') {
        if (slideActive == totalQuestions) {
            feedbackElm.innerText = alerts[2];
            parentFeed.classList.add('Correct');
        } else {
            feedbackElm.innerText = alerts[1];
            parentFeed.classList.add('Correct');
        }
    } else {
        if (slideActive == totalQuestions) {
            feedbackElm.innerText = alerts[3];
            parentFeed.classList.add('Incorrect');
        } else {
            feedbackElm.innerText = alerts[0];
            parentFeed.classList.add('Incorrect');
        }
    }
    ariaLivePolite.innerText = feedbackElm.innerText;
    parentFeed.setAttribute('aria-hidden', 'false');
};

let hiddenBtn = () => {
    btnNext.setAttribute('hidden', 'true');
    btnNext.classList.remove('c-btn_default', 'icon-u-play');
    indexHint++;
};

let hintMessage = () => {
    ariaLiveAssertive.innerHTML =
        'La ayuda de pista, ha sido activada, a continuación presione la tecla tabulación para situarse en la pista.';
};

let instructions = (e) => {
    let keyValue = e.key.toUpperCase();

    if (e.shiftKey && keyValue == 'A') {
        ariaLiveAssertive.innerHTML =
            'Instrucciones de juego: Para realizar este juego, use la tecla de TABULACIÓN para desplazarse hacia adelante  en los diferentes componentes; para dezplazarse hacia atrás, presione las teclas SHIFT, más, TABULACIÓN. En el juego encontrará dos tipos de ayuda: cincuenta cincuenta, la cual le permitirá eliminar la mitad de opciones de respuesta para la pregunta, y pistas, la cual le dará una breve reseña de la opción correcta. Para activar estas ayudas, desplacese sobre ellas y activelas con la tecla enter o barra espaciadora. Al elegir una opción, podra avanzar a la siguiente pregunta, situándose en el botón siguiente pregunta y presionando la tecla enter. Para volver a escuchar este mensaje, oprima las teclas SHIFT, MÁS, A.';
    }
};

// Listeners

btnResponses = document.querySelectorAll('.responses');
btnHints.forEach((element, index) => {
    element.addEventListener('click', getClue);
    btnHelp50[index].addEventListener('click', help50);
    btnHints[index].addEventListener('click', hintMessage);
});

btnResponses.forEach((element) => {
    element.addEventListener('click', validate);
});

btnNext.addEventListener('click', hiddenBtn);

context.addEventListener('keyup', instructions);
