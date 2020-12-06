//---------------------------------//
//   Variables Globales            //
//---------------------------------//

let letterValue,
    wordId,
    numberOfWords,
    wordSerie,
    wordClass,
    wordNumberActive,
    letterIndex,
    wordNumber,
    letterValueActive,
    eventMessage,
    readQuestion,
    wordLength,
    historyWordNumber,
    arrAllGood = [],
    orderIndexQuestion = 1;

let arrayWordLetters = [],
    arrayCompareLetter = [],
    arrayNumberOfWords = [];

btnValidate = document.getElementById('btnValidate');
eventMessage = document.getElementById('eventMessage');
readQuestion = document.getElementById('readQuestion');
arrayWordLetters = document.querySelectorAll('.hide');

//---------------------------------//
//   Función Asignar Atributos     //
//   A cada letra por palabra.     //
//---------------------------------//

let GetCountOfWords = () => {
    wordId = document.querySelectorAll('[wordId]'); // 1, 2, 3.. cantidad de palabras
    wordId.forEach((wordIndex) => {
        arrayNumberOfWords.push(`letterIndex${wordIndex.innerHTML}`);
    });
    numberOfWords = wordId.length; // numero total de palabras, 10, 12 ....
};
GetCountOfWords();

// Busco todos los wordClass, y les asigno los atributos para resaltar.
let SerialAssignment = (wordClass) => {
    letterIndex = document.querySelectorAll(`.${wordClass}`);
    let validateIndexLetter;
    let indice = 1;

    letterIndex.forEach((letter) => {
        validateIndexLetter = letter.attributes.letterIndex;

        if (!validateIndexLetter) {
            letter.setAttribute('letterIndex', indice);
            letter.setAttribute('tabindex', indice);
            letter.setAttribute(
                'aria-label',
                `Campo ${indice} de la pregunta ${wordNumber}`
            );
            letter.classList.add('wordHighlighted');
            indice += 1;
        }
    });

    FocusNexLetter(wordClass);
};

// Realizo el focus al siguiente cuadro de la palabra
let FocusNexLetter = (wordClass) => {
    letterActive = document.activeElement.attributes.letterIndex;

    if (letterActive) {
        letterActive = letterActive.value;
    }
    let nextIndice = parseInt(letterActive) + 1;
    let letterNextActive = document.querySelector('[letterIndex ="' + nextIndice + '"]');

    wordLength = letterIndex.length;

    let valueInputActive = document.activeElement.value;
    valueInputActive = valueInputActive.toUpperCase();

    if (nextIndice <= wordLength) {
        // letterNextActive.focus();
        ariaLivePolite.innerHTML = `Ha ingresado la letra: ${valueInputActive}, en el campo: ${nextIndice -
            1} de la pregunta ${wordNumberActive} ahora esta en el campo: ${nextIndice} de la pregunta ${wordNumberActive}`;
        letterNextActive.select();
        let intersection = document.activeElement.classList;
        if (intersection.length > 3) {
            let question = [];
            question[0] = intersection[1].replace('word', '');
            question[1] = intersection[2].replace('word', '');
            ariaLivePolite.innerHTML = `Este campo es intersección entre las preguntas: ${
                question[0]
            } y ${question[1]} `;
        }
    } else {
        ariaLivePolite.innerHTML = `Ha ingresado la letra: ${valueInputActive}, en el campo: ${nextIndice -
            1} de la pregunta ${wordNumberActive} ahora esta en el campo: 1 de la pregunta ${parseInt(
            wordNumberActive
        ) + 1}`;
        if (wordNumberActive < numberOfWords) {
            let newFocus;
            wordClass = `word${parseInt(wordNumberActive) + 1}`;
            newFocus = document.querySelector(`.${wordClass}`);
            if (valueInputActive == document.activeElement.attributes.letterValue.value) {
                document.activeElement.classList.add('correct');
            } else {
                document.activeElement.classList.add('incorrect');
            }
            ClearLetterIndex();
            getDescriptionQuestion(wordNumberActive + 1);
            newFocus.classList.add('wordHighlighted');
            newFocus.select();
        } else {
            ClearLetterIndex();
            btnValidate.classList.remove('hidden');
            btnValidate.focus();
        }
    }
};

let ClearLetterIndex = () => {
    let clearLetterIndex = document.querySelectorAll('[letterIndex]');
    clearLetterIndex.forEach((wordJoin) => {
        wordJoin.removeAttribute('letterIndex');
        wordJoin.removeAttribute('tabindex');
        wordJoin.classList.remove('wordHighlighted');
    });
};

let Validate = () => {
    let classGood = document.querySelectorAll('.correct');
    let classWrong = document.querySelectorAll('.incorrect');
    let classBien = document.querySelectorAll('.bien');
    let classMal = document.querySelectorAll('.mal');

    classBien.forEach((element) => {
        element.classList.remove('bien');
        element.classList.remove('wordHighlighted');
    });

    classMal.forEach((element) => {
        element.classList.remove('mal');
        element.classList.remove('wordHighlighted');
    });

    classGood.forEach((element) => {
        element.classList.add('bien');
        element.classList.remove('wordHighlighted');
    });

    classWrong.forEach((element) => {
        element.classList.add('mal');
        element.classList.remove('wordHighlighted');
    });

    for (let index = 1; index <= numberOfWords; index++) {
        let allGood = document.querySelectorAll(`.word${index}`);
        let wordGood = document.querySelectorAll(`.word${index}.bien`);
        if (allGood.length == wordGood.length) {
            let wordCorrect = `Palabra: ${index}, `;
            wordGood.forEach((elm) => {
                wordCorrect += elm.value;
            });
            arrAllGood.push(wordCorrect);
        }
    }

    ariaLiveAssertive.innerHTML = `Actividad finalizada: ${
        arrAllGood.length == 0
            ? 'No obtuvo palabras correctas.'
            : 'palabras correctas:' + arrAllGood
    } `;
};

let FullField = (key, letterValueActive) => {
    let validateField = document.activeElement;
    let a = letterValueActive.attributes.letterIndex;
    letterValue = letterValueActive.attributes.letterValue;
    letterValue = letterValue != undefined ? letterValue.value.toUpperCase() : '';

    if (validateField.value != '') {
        eventMessage.innerHTML = `Este campo contiene la letra: ${validateField.value}, presione la tecla tabulación para avanzar al siguiente campo, u oprima una letra para reemplazarla.`;

        if (a) {
            if (key != 'TAB' && a.value == letterIndex.length) {
                ClearLetterIndex();
                SerialAssignment(wordClass);
            }
        }

        if (key != 'TAB') {
            if (letterValueActive.value.toUpperCase() == letterValue) {
                letterValueActive.classList.add('correct');
                letterValueActive.classList.remove('incorrect');
                SumaryAnswers(letterValueActive.value.toUpperCase());
            } else {
                letterValueActive.classList.add('incorrect');
                letterValueActive.classList.remove('correct');
            }
        }
    } else if (key == letterValue) {
        letterValueActive.classList.add('correct');
        letterValueActive.classList.remove('incorrect');
        SumaryAnswers(key);
    } else {
        letterValueActive.classList.add('incorrect');
        letterValueActive.classList.remove('correct');
    }
};

// Obtengo El enuncioado de la pregunta según en el indice que este.
let getDescriptionQuestion = (orderIndexQuestion) => {
    let idQuestion = orderIndexQuestion;
    let getQuestion = document.getElementById(`${idQuestion}`);
    let direccionQuestion =
        getQuestion.parentNode.parentNode.id == 'cluesDown' ? 'Vertical' : 'Horizontal';

    getQuestion = getQuestion.nextElementSibling.textContent;
    let longWord = document.querySelectorAll(`.word${idQuestion}`).length;
    ariaLiveAssertive.innerHTML = `Está en el inicio de La respuesta de la pregunta ${idQuestion}, esta pregunta esta en dirección: ${direccionQuestion}. El enunciado es:  ${getQuestion} Para completar esta pregunta, presione la tecla con la letra inicial de la palabra. La longitud de letras para esta respuesta es de: ${longWord}`;
};
// obtengo las palabras correctas
let SumaryAnswers = (key) => {
    arrayCompareLetter.push(key);
    arrayWordLetters.forEach((element) => {
        element.value;
    });
};

// Función para buscar las letras de las palabras.

let CaptureKey = (event) => {
    let key = event.key;
    key = key.toUpperCase();
    letterValueActive = document.activeElement;

    let rangeLettersKeyBoard = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'Ñ',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ];

    if (rangeLettersKeyBoard.indexOf(key) > -1) {
        wordNumber = document.activeElement.attributes.wordSerie;
        let letterIndexActive = document.activeElement.attributes.letterIndex;

        if (!letterIndexActive) {
            if (wordNumber) {
                wordNumber = wordNumber.value;
                orderIndexQuestion = wordNumber;
                wordClass = `word${wordNumber}`;
                historyWordNumber =
                    historyWordNumber != wordClass
                        ? historyWordNumber == undefined
                            ? wordClass
                            : historyWordNumber
                        : wordClass;
                wordNumberActive = parseInt(wordNumber);
            }
        }

        SerialAssignment(wordClass);
        FullField(key, letterValueActive);
    } else {
        if (key == 'ARROWDOWN' || key == 'ARROWUP') {
            if (letterValueActive.attributes.wordSerie.value != 1) {
                document
                    .querySelector('[wordSerie = "1"]')
                    .classList.remove('wordHighlighted');
            }
            orderIndexQuestion = parseInt(orderIndexQuestion);
            let orderQuestion;
            switch (key) {
                case 'ARROWDOWN':
                    if (orderIndexQuestion > 1) {
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderQuestion.classList.remove('wordHighlighted');
                        orderIndexQuestion -= 1;
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderQuestion.focus();
                        orderQuestion.classList.add('wordHighlighted');
                    } else {
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderIndexQuestion = 1;
                        orderQuestion.focus();
                        orderQuestion.classList.add('wordHighlighted');
                    }
                    break;
                case 'ARROWUP':
                    if (orderIndexQuestion < numberOfWords) {
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderQuestion.classList.remove('wordHighlighted');
                        orderIndexQuestion += 1;
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderQuestion.focus();
                        orderQuestion.classList.add('wordHighlighted');
                    } else if (orderIndexQuestion == numberOfWords) {
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderQuestion.classList.remove('wordHighlighted');
                        orderIndexQuestion = 1;
                        orderQuestion = document.querySelector(
                            '[wordSerie="' + orderIndexQuestion + '"]'
                        );
                        orderQuestion.focus();
                        orderQuestion.classList.add('wordHighlighted');
                    }
                    break;

                default:
                    break;
            }
            getDescriptionQuestion(orderIndexQuestion);
        }
    }

    // Validación de primer input activo.
    let keyActivePrimary = letterValueActive.attributes.wordSerie
        ? letterValueActive.attributes.wordSerie
        : 0;

    if (keyActivePrimary.value == 1) {
        letterValueActive.classList.add('wordHighlighted');
        getDescriptionQuestion(1);
    }
};

let element = (e) => {
    let key = e.key.toUpperCase();

    let elementActive = document.activeElement.attributes.letterIndex;

    if (key == 'TAB') {
        if (elementActive != undefined && elementActive.value == wordLength) {
            let newClass = `word${orderIndexQuestion}`;
            ClearLetterIndex();
            SerialAssignment(newClass);
        }
    }
};

//---------------------------------//
//           Listeners             //
//---------------------------------//

document.addEventListener('keydown', element);
document.addEventListener('keyup', CaptureKey);
btnValidate.addEventListener('click', Validate);
