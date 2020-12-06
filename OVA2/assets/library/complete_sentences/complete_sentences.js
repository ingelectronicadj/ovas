let self = null;

const completeSentences = {
    parentContainer: '',
    questionsId: '',
    answerCorrect: [],
    cloneWords: '',
    backUpCloneWords: [],
    wordContainer: '.wordContainer',
    questionIndex: 1,
    fieldIndex: 1,
    pathFieldIndex: 1,
    pathFieldClick: 1,
    dataCountGame: 1,
    isFeedback: false,
    context: null,
    initialize: (context, isFeedback = false) => {
        self = completeSentences;
        self.context = context;
        self.contextActive = document.querySelector(context);

        let childrenWords =
            self.contextActive.querySelector(self.wordContainer).firstChild == null
                ? false
                : self.contextActive.querySelector(self.wordContainer).firstChild;

        if (childrenWords) {
            self.cloneWords = self.contextActive
                .querySelector(self.wordContainer)
                .cloneNode(true);
        }
        self.pathFieldIndex = 1;
        self.fieldIndex = 1;
        self.questionIndex = 1;
        self.pathFieldClick = 1;
        self.answerCorrect = [];
        self.isFeedback = isFeedback;

        self.dataCountGame = self.contextActive.querySelector(
            '.containerCompleteSentences'
        ).dataset.jsIdGame;

        self.searchQuestions();
        self.searchWords();
        self.setAttrIndexField();

        // Listeners.
        self.contextActive.addEventListener('click', (e) => self.focusSection(e));

        self.contextActive
            .querySelector('.js-btn-validate')
            .addEventListener('click', (e) => self.validate(e));

        self.contextActive.addEventListener('keyup', (e) => self.keyboardShortcuts(e));

        self.contextActive
            .querySelector('.js-btn-clear')
            .addEventListener('click', (e) => self.clean(e));
    },
    focusSection: (e) => {
        let elementActive = e.target;
        let sectionType = elementActive.parentNode.className; // Clases: WordContainer - Questions
        let parentElementActive =
            elementActive.parentNode.parentNode.parentNode.parentNode;

        switch (sectionType) {
            case 'questions':
                elementActive.classList.add('active');
                let firtsWord = parentElementActive.querySelector(self.wordContainer);
                firtsWord = firtsWord.firstChild == null ? false : firtsWord.firstChild;
                if (firtsWord && firtsWord.classList.contains('words')) {
                    firtsWord.focus();
                }
                self.returnAssigned(e);
                break;
            case 'wordContainer':
                let classActive = parentElementActive.querySelector('.active');
                if (classActive) {
                    classActive.focus();
                    classActive.classList.remove('active');
                } else {
                    let fieldNext =
                        parentElementActive.querySelector(
                            '[data-index-field = "' + self.pathFieldClick + '"]'
                        ) == null
                            ? 1
                            : parentElementActive.querySelector(
                                  '[data-index-field = "' + self.pathFieldClick + '"]'
                              );
                    // console.log(fieldNext);

                    // fieldNext.focus();
                    self.pathFieldClick += 1;
                }
                self.asignedWordToFields(elementActive, sectionType);
                break;
            default:
                break;
        }
    },
    asignedWordToFields: (elementActive, sectionType) => {
        let getParentWord = elementActive.parentNode.parentNode;
        let selectField = getParentWord.querySelector(
            '[data-index-field = "' + self.pathFieldIndex + '"]'
        );

        let questions = self.contextActive.querySelector('.containerTexts');
        let fields = questions.querySelectorAll('.fields');
        for (let index = 0; index < fields.length; index++) {
            const field = fields[index];
            elementActive.classList.remove('words');
            elementActive.classList.add('disable');
            let newElement = elementActive.cloneNode(true);
            self.comparison(newElement, field);

            newElement.classList.add('assigned');
            if (!field.firstChild) {
                newElement.classList.remove('disable');
                field.appendChild(newElement);

                setTimeout(() => {
                    field.focus();
                }, 100);

                return;
            } else {
                // self.returnAssigned(e, sectionType);
                console.log('RETURRRRRRNNNNN');
            }
        }
    },
    comparison: (elementActive, selectField) => {
        let valuePartner = elementActive.dataset.valuePartner;
        let valueIdField = selectField.dataset.indexField;
        let valueWordPartner = elementActive.textContent;
        let valueAltSplit;
        let valueAlt =
            selectField.attributes.valueAlt != undefined
                ? selectField.attributes.valueAlt.value
                : false;

        if (valueAlt) {
            valueAltSplit = valueAlt.split(',');
            if (valuePartner == valueIdField || valueAltSplit.includes(valuePartner)) {
                elementActive.classList.add('correct');
                self.answerCorrect.push(valueWordPartner);
            } else {
                elementActive.classList.add('incorrect');
            }
        } else {
            if (valuePartner == valueIdField) {
                elementActive.classList.add('correct');
                self.answerCorrect.push(valueWordPartner);
            } else {
                elementActive.classList.add('incorrect');
            }
        }
    },
    searchQuestions: () => {
        self.parentContainer =
            document.querySelector('[ data-js-id-game = "' + self.dataCountGame + '"]') ==
            null
                ? self.contextActive.querySelector(self.context)
                : document.querySelector(
                      '[ data-js-id-game = "' + self.dataCountGame + '"]'
                  );
        let questions = self.parentContainer.querySelectorAll('.questions');
        questions.forEach((question) => {
            self.questionsId = `questions${self.questionIndex}-${self.dataCountGame}`;
            question.setAttribute('id', self.questionsId);
            question.setAttribute('tabindex', '0');
            self.asignedIdField();
            self.questionIndex += 1;
        });
    },
    asignedIdField: () => {
        let getAmountQuestion = document.getElementById(self.questionsId);
        let getFields = getAmountQuestion.querySelectorAll('.fields');
        let getNumberId = getAmountQuestion.querySelectorAll('.numberId');

        getFields.forEach((field) => {
            let fieldId = `field${self.fieldIndex}-${self.questionIndex}-${self.dataCountGame}`;
            field.setAttribute('id', fieldId);
            field.setAttribute(
                'title',
                `campo ${self.fieldIndex} de ${getFields.length}, de la pregunta ${self.questionIndex}`
            );
            field.setAttribute('aria-label', 'Campo para asignar palabra.');
            field.setAttribute('tabindex', '0');
            self.fieldIndex += 1;
        });

        self.fieldIndex = 1;
        getNumberId.forEach((numberId) => {
            numberId.setAttribute('title', `Pregunta ${self.questionIndex}`);
            numberId.innerHTML = `${self.questionIndex}. `;
        });
    },
    searchWords: () => {
        let words = self.parentContainer.querySelectorAll('.words');
        let wordIndex = 1;
        words.forEach((word) => {
            let wordId = `word${wordIndex}`;
            word.setAttribute('id', wordId);
            word.setAttribute('tabindex', '0');
            wordIndex += 1;
        });
    },
    setAttrIndexField: () => {
        let getAllFields = self.parentContainer.querySelectorAll('.fields');
        let index = 1;
        getAllFields.forEach((indexField) => {
            indexField.dataset.indexField = index;
            index += 1;
        });
    },
    validate: (e) => {
        let btnActive = e.target;
        let wordsCorrect = self.parentContainer.querySelectorAll('.correct');
        let wordsIncorrect = self.parentContainer.querySelectorAll('.incorrect');

        if (btnActive.textContent == 'Validar') {
            wordsCorrect.forEach((correct) => {
                correct.classList.remove('correct');
                correct.classList.remove('incorrect');
                correct.classList.remove('mal');
                correct.classList.add('bien');
            });

            wordsIncorrect.forEach((incorrect) => {
                incorrect.classList.remove('incorrect');
                incorrect.classList.remove('correct');
                incorrect.classList.remove('bien');
                incorrect.classList.add('mal');
            });
            ariaLiveAssertive.innerHTML = `Actividad Finalizada, obtuvo: ${
                self.answerCorrect.length == 1
                    ? `${self.answerCorrect.length} respuesta correcta`
                    : `${self.answerCorrect.length} respuestas correctas`
            } '${self.answerCorrect}'`;
        }
    },
    keyboardShortcuts: (e) => {
        let keyValue = e.key.toUpperCase();
        let activeElement = e.target;

        if (keyValue == 'ENTER' || keyValue == ' ') {
            // self.focusSection(e);
            // console.log(activeElement);
            // console.log();
            if (e.target.firstElementChild) {
                self.returnAssigned(e);
            }

            self.contextActive.querySelector('.words').focus();
        }
        if (e.shiftKey && keyValue == 'Q') {
            self.readQuestions(activeElement);
        }
        if (e.shiftKey && keyValue == 'A') {
            ariaLiveAssertive.innerHTML = jsInstrucciones.innerHTML;
        }
    },
    readQuestions: (activeElement) => {
        let positionClass = activeElement.parentNode.className;
        if (positionClass == 'questions') {
            let readQuestions = activeElement.parentNode.textContent;
            ariaLiveAssertive.innerHTML = readQuestions;
        }
    },
    onFeedBack: (isGood) => {
        if (self.isFeedback) {
            if (isGood) {
                feedback.give('bien');
            } else {
                feedback.give('mal');
            }
        } else {
            if (isGood) {
                ariaLiveAssertive.innerText = 'Muy bien, ha contestado correctamente';
            } else {
                ariaLiveAssertive.innerText = 'Algunas de sus respuestas son incorrectas';
            }
        }
        return isGood;
    },
    backUpClone: () => {
        let backUpCloneWord = document.querySelectorAll('.wordContainer');
        self = completeSentences;
        backUpCloneWord.forEach((backUp, index) => {
            self.backUpCloneWords[index] = backUp.cloneNode(true);
        });
    },
    clean: (e) => {
        let wordContainerClean = self.parentContainer.querySelector('.wordContainer');
        self.cloneWords = self.backUpCloneWords[self.dataCountGame - 1];
        self.parentContainer.replaceChild(
            self.cloneWords.cloneNode(true),
            wordContainerClean
        );
        self.pathFieldIndex = 1;
        self.fieldIndex = 1;
        self.questionIndex = 1;
        self.pathFieldClick = 1;
        self.answerCorrect = [];

        let containerTextsClean = self.parentContainer.querySelector('.containerTexts');
        let fieldsClean = containerTextsClean.querySelectorAll('.fields');
        fieldsClean.forEach((field) => {
            let childrenDeleted = field.firstChild == null ? false : field.firstChild;
            if (childrenDeleted) {
                field.removeChild(childrenDeleted);
            }
        });
    },
    returnAssigned: (e) => {
        console.log(e);

        const assignedElement =
            e.target.firstChild.dataset.valuePartner == null
                ? 0
                : e.target.firstChild.dataset.valuePartner;
        const wordContainer = document.querySelector('.wordContainer');

        const wordContainerItem = wordContainer.querySelector(
            '[data-value-partner = "' + assignedElement + '"]'
        );

        wordContainerItem.classList.remove('disable');
        wordContainerItem.classList.add('words');
        e.target.firstChild.remove();
        self.pathFieldClick -= 1;
    },
};

completeSentences.backUpClone();

//  (initialize) Obtengo la cantidad de juegos en la pagina.  //* Ok
// (searchQuestions) Busco las preguntas y le asigno dinamicamente: (id, tabindex) //* Ok
// (asignedIdField) Busco los campos de cada pregunta y le asigno: (Id, aria-label, tabindex, numberId) //* Ok
// (searchWords) Busco las palabras y les asigno: (id, tabindex) //* Ok
// (focusSection) Realizo focus a la sección de las palabras. //* Ok
// (setAttrIndexField) asigno el atributo indexField //* Ok
// (asignedWordToFields) Obtengo la palabra activa, y asigno la palabra al campo  //* Ok
// (comparative) Comparo cada  uno de los atributos y obtengo las respuestas correctas/incorrectas.  //* Ok
// (validate) Asigno las clases (bien/mal) en cada campo, indico el mensaje final. //* Ok
// (keyboardShortcuts) Funcion para detectar los eventos del teclado. //* Ok
// (readQuestions) función para leer la pregunta actual. //* Ok
// (clean) Función para limpiar el juego. //* OK
// (onFeedBack) Opción por si se tiene que habilitar feedback //* Ok
