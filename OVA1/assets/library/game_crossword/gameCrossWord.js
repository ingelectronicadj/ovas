class CrossWord {
    constructor(arrObject) {
        let { arrContents, arrContexts, arrFeedbacks, arrGridSizes } = arrObject;

        this.arrContents = arrContents;
        this.arrContexts = arrContexts;
        this.arrFeedbacks = arrFeedbacks;
        this.arrGridSizes = arrGridSizes;
        this.arrCloneBoars = [];
        this.restartBoard = this.restartBoard.bind(this);
        this.highlightSquares = this.highlightSquares.bind(this);
        this.tooltipPosition = this.tooltipPosition.bind(this);
        this.showCharacterError = this.showCharacterError.bind(this);
        this.removeHighlighting = this.removeHighlighting.bind(this);
        this.displacementInWords = this.displacementInWords.bind(this);
        this.displacementThroughWords = this.displacementThroughWords.bind(this);
        this.getNextWord = this.getNextWord.bind(this);
        this.validationAnswers = this.validationAnswers.bind(this);
        this.observers = this.observers.bind(this);
        this.showButtons = this.showButtons.bind(this);
    }

    initialize(indexGame = 0) {
        this.activeGameIndex = indexGame;
        this.activeContext = document.querySelector(
            this.arrContexts[this.activeGameIndex]
        );
        this.activeContext.setAttribute(
            'aria-label',
            'Actividad de crucigrama, para escuchar las instrucciones, presione las teclas shift, más, a.  Para salir del Crucigrama presione las teclas SHIFT, más, E. Tenga en cuenta que podrá ejecutar los comandos indicados únicamente cuando se ubique al interior del crucigrama.'
        );
        this.activeContent = this.arrContents[this.activeGameIndex];
        this.activeFeedback = this.arrFeedbacks[this.activeGameIndex];
        this.activeGridSize = this.arrGridSizes[this.activeGameIndex];
        this.createBoard();
    }

    createBoard() {
        if (this.activeContext.dataset.statusGame == undefined) {
            this.activeContext.dataset.statusGame = 'Started';
            this.directionGame = 'horizontal';
            let gameBoard =
                    '<h5 tabindex="0" class="instruccionCrossword">Complete el crucigrama según corresponda, al completar todos los campos del crucigrama, se habilitará el botón de validar.</h5> <div class="crossWord col xs12 md8"> <table class="crossWord-grid">',
                row = ``,
                square = ``;
            for (let i = 0; i < this.activeGridSize[1]; i++) {
                row += `<tr class="grid-row" data-y-axis ="${i}"`;
                for (let j = 0; j < this.activeGridSize[0]; j++) {
                    square += `<td class="grid-square" data-x-axis ="${j}"></td>`;
                }
                row += `>${square}</tr>`;
                square = '';
            }
            gameBoard += `${row}</table></div>`;
            this.activeContext.innerHTML = gameBoard;
            this.addWordsToBoard();
            this.addButtonsToBoard();
            this.addTooltipToBoard();
            this.cloneBoards();
            this.addEventToButtons();
            this.tooltipError = this.activeContext.querySelector('#tooltipError');
        } else {
            console.log('Juego iniciado');
        }
    }

    addWordsToBoard() {
        for (let i = 0; i < this.activeContent.length; i++) {
            let row = this.activeContent[i].row,
                column = this.activeContent[i].column,
                directionSquare = this.activeContent[i].direction;

            for (let j = 0; j < this.activeContent[i].word.length; j++) {
                let activeSquare = this.activeContext
                        .querySelector(`[data-y-axis = "${row - 1}"]`)
                        .querySelector(`[data-x-axis = "${column - 1}"]`),
                    titleOfSquare = `${this.activeContent[i].clue}, letra: ${j + 1} de ${
                        this.activeContent[i].word.length
                    }.`,
                    idOfSquare = `G${this.activeGameIndex}-${
                        directionSquare == 'horizontal' ? 'H' : 'V'
                    }-${this.activeContent[i].number}W-${j + 1}L`;

                if (j == 0 && activeSquare.querySelectorAll('.word-label').length == 0) {
                    let span = `<span class="word-label" data-direction ="${this.activeContent[i].direction}" >${this.activeContent[i].number}</span>`;
                    activeSquare.innerHTML = span;
                }

                if (activeSquare.querySelectorAll('.inputLetter').length == 0) {
                    let input = `<input type="text" id="${idOfSquare}" class="inputLetter" title="${titleOfSquare}" data-direction="${directionSquare}"
                        data-${directionSquare}-number ="${this.activeContent[i].number}" data-${directionSquare}-clue ="${this.activeContent[i].clue}" maxlength="1"/>`;
                    activeSquare.innerHTML += input;
                    activeSquare.classList.add('colored');
                } else {
                    // Intercepcion.
                    let input = activeSquare.querySelector('.inputLetter');
                    input.setAttribute(
                        'title',
                        `Campo de intersección: ${input.getAttribute(
                            'title'
                        )}; ${titleOfSquare}`
                    );
                    input.setAttribute('id', `${input.getAttribute('id')}+${idOfSquare}`);
                    input.setAttribute(
                        `data-${directionSquare}-number`,
                        this.activeContent[i].number
                    );
                    input.setAttribute(
                        `data-${directionSquare}-clue`,
                        this.activeContent[i].clue
                    );
                    input.setAttribute(
                        'data-direction',
                        `${input.getAttribute('data-direction')}; ${directionSquare}`
                    );
                }

                directionSquare == 'vertical' ? row++ : column++;
            }
        }
        this.addCluesToBoard();
    }

    addCluesToBoard() {
        let contextClues = `<div class="crossWord-clues col xs12 md4"> <div class="row">`,
            horizontalClues = `<div class="horizontalClues" tabindex="0"> <p class="titleClues">Horizontales</p> <ol>`,
            verticalClues = `<div class="verticalClues" tabindex="0"> <p class="titleClues">Verticales</p> <ol>`;

        for (let i = 0; i < this.activeContent.length; i++) {
            let squareSearchId = this.activeContext.querySelector(
                    `[data-${this.activeContent[i].direction}-number ="${this.activeContent[i].number}"]`
                ).id,
                insertClue = `<li value ="${this.activeContent[i].number}" data-direction="${this.activeContent[i].direction}" data-clue="${this.activeContent[i].number}"> <label for="${squareSearchId}" tabindex="0" title="${this.activeContent[i].clue}"> <p>${this.activeContent[i].clue}</p></label></li>`;

            this.activeContent[i].direction == 'horizontal'
                ? (horizontalClues += insertClue)
                : (verticalClues += insertClue);
        }

        horizontalClues += `</ol> </div>`;
        verticalClues += `</ol> </div>`;
        contextClues += `${horizontalClues + verticalClues}</div> </div>`;
        this.activeContext.innerHTML += contextClues;
    }

    cloneBoards() {
        this.arrCloneBoars.push(this.activeContext.cloneNode(true));
    }

    addButtonsToBoard() {
        let contentButtons = `<div class="contentBtns"> <button class="btn-reset hidden c-btn_default" id="G${this.activeGameIndex}Restart">Reiniciar</button> <button class="btn-validate c-btn_default hidden" id="G${this.activeGameIndex}Validate">Validar</button> </div>`;
        this.activeContext.innerHTML += contentButtons;
    }

    addTooltipToBoard() {
        let contentTooltip = `<div class="clue-tooltip hidden"> <div class="clue-tooltip-arrow"></div> <div class="clue-tooltip-text"></div> </div>`;
        this.activeContext.innerHTML += contentTooltip;

        let contentTooltipError = `<div id="tooltipError" class="clue-tooltipError hidden"> <div class="clue-tooltip-arrowError"></div> <div class="clue-tooltip-text" id="messageError" >Error, este campo solo acepta letras de: A-Z.</div> </div>`;
        this.activeContext.innerHTML += contentTooltipError;
    }

    highlightSquares() {
        if (event.target.classList.contains('inputLetter')) {
            let focusSquared = event.target,
                directionSquared = focusSquared.dataset.direction;

            (directionSquared = directionSquared.split(';', 1)),
                (directionSquared = directionSquared[0]);

            let directionSquaredId =
                    directionSquared == 'vertical'
                        ? focusSquared.dataset.verticalNumber
                        : focusSquared.dataset.horizontalNumber,
                activeCLue,
                currentWord;

            if (focusSquared.classList.contains('inputLetter')) {
                focusSquared.setSelectionRange(0, 1);
            }
            this.getDirection(focusSquared);

            currentWord = this.activeContext.querySelectorAll(
                `[data-${this.directionGame}-number = "${directionSquaredId}"]`
            );
            currentWord.forEach((element) => {
                element.parentNode.classList.add('current-word');
                element.dataset.direction = directionSquared;
            });

            let allElementLi = this.activeContext.querySelectorAll('.crossWord-clues li');

            allElementLi.forEach((element) => {
                element.classList.remove('active');
            });

            activeCLue = this.activeContext.querySelector(
                `[data-clue = "${directionSquaredId}"]`
            );
            activeCLue.classList.add('active');

            this.tooltipPosition(focusSquared);

            this.tooltip.style.left = `${this.tooltipLeft}px`;
            this.tooltip.style.top = `${this.tooltipTop}px`;
        } else {
            console.log('Es Invalido');
        }
    }

    addEventToButtons() {
        let restartButton = this.activeContext.querySelector(
                `#G${this.activeGameIndex}Restart`
            ),
            validateButton = this.activeContext.querySelector(
                `#G${this.activeGameIndex}Validate`
            ),
            activeCLue = this.activeContext.querySelectorAll('LI'),
            activeSquares = this.activeContext.querySelector('.crossWord-grid');

        activeCLue.forEach((element) => {
            element.addEventListener('click', () => {
                this.directionGame = element.dataset.direction;
                this.activeContext.querySelector(
                    `[data-${this.directionGame}-number = "${element.dataset.clue}"]`
                ).dataset.direction = this.directionGame;
            });
        });
        restartButton.addEventListener('click', this.restartBoard);
        validateButton.addEventListener('click', this.validationAnswers);
        activeSquares.addEventListener('focusin', this.highlightSquares);
        activeSquares.addEventListener('focusout', this.removeHighlighting);
        activeSquares.addEventListener('keyup', this.displacementInWords);
        activeSquares.addEventListener('keydown', this.displacementThroughWords);
        this.observers();
    }

    restartBoard() {
        let newActiveContext =
            this.arrCloneBoars[this.activeGameIndex] == undefined
                ? this.arrCloneBoars[0].cloneNode(true)
                : this.arrCloneBoars[this.activeGameIndex].cloneNode(true);
        this.activeContext.replaceWith(newActiveContext);
        this.activeContext = newActiveContext;
        this.addEventToButtons();
        ariaLiveAssertive.innerHTML = `Ha activado la opción de limpiar, se ha limpiado el crucigrama ${
            this.activeGameIndex + 1
        }`;
    }

    getDirection(input) {
        if (this.getPrevLetter(input) || this.getNextLetter(input)) {
            this.directionGame = this.directionGame;
        } else {
            this.directionGame =
                this.directionGame == 'horizontal' ? 'vertical' : 'horizontal';
        }
    }

    getPrevLetter(input) {
        let direction = input.dataset.direction;
        direction = direction.split(';', 1);
        direction = direction[0];

        let numberSquaredId = `${
                direction == 'vertical'
                    ? input.dataset.verticalNumber
                    : input.dataset.horizontalNumber
            }`,
            allSquared = this.activeContext.querySelectorAll(
                `[data-${this.directionGame}-number = "${numberSquaredId}"]`
            ),
            response;

        allSquared.forEach((element, index) => {
            if (element == input) {
                if (index > 0) {
                    response = allSquared[index - 1];
                } else {
                    response = false;
                }
            }
        });

        return response;
    }

    getNextLetter(input) {
        let direction = input.dataset.direction;
        direction = direction.split(';', 1);
        direction = direction[0];

        let numberSquaredId = `${
                direction == 'vertical'
                    ? input.dataset.verticalNumber
                    : input.dataset.horizontalNumber
            }`,
            allSquared = this.activeContext.querySelectorAll(
                `[data-${this.directionGame}-number = "${numberSquaredId}"]`
            ),
            response;

        allSquared.forEach((element, index) => {
            if (element == input) {
                if (index < allSquared.length - 1) {
                    response = allSquared[index + 1];
                } else {
                    response = false;
                }
            }
        });
        return response;
    }

    getPrevWord() {
        let allClues = this.activeContext.querySelectorAll('.crossWord-clues li'),
            activeLI = this.activeContext.querySelector('.crossWord-clues li.active'),
            response;

        allClues.forEach((element, index) => {
            if (element == activeLI) {
                if (index > 0) {
                    this.prevWord = allClues[index - 1];

                    let squaredIntersection = (this.activeContext.querySelector(
                        `[data-${this.prevWord.dataset.direction}-number = "${this.prevWord.dataset.clue}"]`
                    ).dataset.direction = this.prevWord.dataset.direction);
                } else {
                    this.prevWord = allClues[allClues.length - 1];
                }
                this.directionGame = this.prevWord.dataset.direction;
            }
        });

        let cleanHighlight = this.activeContext.querySelectorAll(
            '.grid-square.current-word'
        );
        cleanHighlight.forEach((element) => {
            element.classList.remove('current-word');
        });
        response = this.activeContext.querySelector(
            `[data-${this.directionGame}-number = "${this.prevWord.dataset.clue}"]`
        );

        return response;
    }

    getNextWord() {
        let allClues = this.activeContext.querySelectorAll('.crossWord-clues li'),
            activeLI = this.activeContext.querySelector('.crossWord-clues li.active'),
            response,
            btns;

        btns = this.activeContext
            .querySelector('.btn-reset')
            .classList.contains('hidden');

        allClues.forEach((element, index) => {
            if (element == activeLI) {
                if (index < allClues.length - 1) {
                    this.nextWord = allClues[index + 1];

                    let squaredIntersection = (this.activeContext.querySelector(
                        `[data-${this.nextWord.dataset.direction}-number = "${this.nextWord.dataset.clue}"]`
                    ).dataset.direction = this.nextWord.dataset.direction);
                } else {
                    this.nextWord = allClues[0];
                }
                this.directionGame = this.nextWord.dataset.direction;
            }
        });

        let cleanHighlight = this.activeContext.querySelectorAll(
            '.grid-square.current-word'
        );

        cleanHighlight.forEach((element) => {
            element.classList.remove('current-word');
        });

        response = this.activeContext.querySelector(
            `[data-${this.directionGame}-number = "${this.nextWord.dataset.clue}"]`
        );

        return response;
    }

    tooltipPosition(input) {
        let direction = input.dataset.direction;
        direction = direction.split(';', 1);
        direction = direction[0];

        let numberSquaredId = `${
            direction == 'vertical'
                ? input.dataset.verticalNumber
                : input.dataset.horizontalNumber
        }`;

        let message = `${
            direction == 'vertical'
                ? input.dataset.verticalClue
                : input.dataset.horizontalClue
        }`;

        let initialSquare = this.activeContext.querySelector(
            `[data-${this.directionGame}-number ="${numberSquaredId}"]`
        );

        this.tooltip = this.activeContext.querySelector('.clue-tooltip');
        this.tooltip.classList.remove('hidden');
        this.tooltip.querySelector('.clue-tooltip-text').innerHTML = message;

        this.tooltipLeft =
            initialSquare.getBoundingClientRect().left -
            this.activeContext.getBoundingClientRect().left;

        this.tooltipTop =
            initialSquare.getBoundingClientRect().top -
            this.activeContext.getBoundingClientRect().top -
            10;

        this.tooltipRight = initialSquare.getBoundingClientRect().right;

        this.tooltipOffset =
            this.tooltipRight - this.activeContext.getBoundingClientRect().width;

        this.tooltipOffset = this.tooltipOffset > 0 ? this.tooltipOffset : 0;
        this.tooltipLeft = this.tooltipLeft - this.tooltipOffset;
    }

    removeHighlighting() {
        let focusSquared = event.target,
            directionSquared = focusSquared.dataset.direction,
            directionSquaredId =
                directionSquared == 'vertical'
                    ? focusSquared.dataset.verticalNumber
                    : focusSquared.dataset.horizontalNumber,
            currentWord = this.activeContext.querySelectorAll(
                `[data-${this.directionGame}-number = "${directionSquaredId}"]`
            );

        currentWord.forEach((element) => {
            element.parentNode.classList.remove('current-word');
        });

        let allElementLi = this.activeContext.querySelectorAll('.crossWord-clues li');

        allElementLi.forEach((element) => {
            element.classList.remove('active');
        });

        this.tooltip.classList.add('hidden');
    }

    displacementInWords() {
        let currentSquared = event.target,
            keyValue = event.key.toUpperCase();

        switch (keyValue) {
            case 'ARROWUP':
                this.directionGame = 'vertical';
                if (this.getPrevLetter(currentSquared)) {
                    this.getPrevLetter(currentSquared).focus();
                }
                break;
            case 'ARROWDOWN':
                this.directionGame = 'vertical';
                if (this.getNextLetter(currentSquared)) {
                    this.getNextLetter(currentSquared).focus();
                }
                break;
            case 'ARROWLEFT':
                this.directionGame = 'horizontal';
                if (this.getPrevLetter(currentSquared)) {
                    this.getPrevLetter(currentSquared).focus();
                }
                break;
            case 'ARROWRIGHT':
                this.directionGame = 'horizontal';
                if (this.getNextLetter(currentSquared)) {
                    this.getNextLetter(currentSquared).focus();
                }
                break;

            default:
                event.preventDefault();
                break;
        }
        this.showButtons();
    }

    displacementThroughWords() {
        let keyValue = event.key.toUpperCase(),
            current = event.target,
            keyAscii = keyValue.length > 1 ? 0 : keyValue.charCodeAt(0);
        this.tooltipError.classList.add('hidden');
        if (keyValue == 'TAB') {
            event.preventDefault();
            if (event.shiftKey) {
                this.getPrevWord().focus();
            } else {
                this.getNextWord().focus();
            }
        } else if (keyAscii == 65) {
            //A
            if (event.shiftKey) {
                event.preventDefault();
                this.instructions();
            } else {
                event.preventDefault();
                current.value = keyValue;
                ariaLiveAssertive.innerHTML = `Ha ingresado la letra: ${keyValue}`;
                if (this.getNextLetter(current)) {
                    this.getNextLetter(current).focus();
                }
            }
        } else if (keyAscii == 69) {
            //E
            if (event.shiftKey) {
                event.preventDefault();
                this.exitCrossword();
            } else {
                event.preventDefault();
                current.value = keyValue;
                ariaLiveAssertive.innerHTML = `Ha ingresado la letra: ${keyValue}`;
                if (this.getNextLetter(current)) {
                    this.getNextLetter(current).focus();
                }
            }
        } else if (keyAscii == 81) {
            //Q
            if (event.shiftKey) {
                event.preventDefault();
                let restartButton = this.activeContext.querySelector(
                    `#G${this.activeGameIndex}Restart`
                );
                restartButton.click();
            } else {
                event.preventDefault();
                current.value = keyValue;
                ariaLiveAssertive.innerHTML = `Ha ingresado la letra: ${keyValue}`;
                if (this.getNextLetter(current)) {
                    this.getNextLetter(current).focus();
                }
            }
        } else if ((keyAscii >= 65 && keyAscii <= 90) || keyAscii == 209) {
            //A-Z-Ñ
            event.preventDefault();
            current.value = keyValue;
            ariaLiveAssertive.innerHTML = `Ha ingresado la letra: ${keyValue}`;
            if (this.getNextLetter(current)) {
                this.getNextLetter(current).focus();
            }
        } else if (
            (keyAscii >= 33 && keyAscii <= 64) ||
            (keyAscii >= 91 && keyAscii <= 208)
        ) {
            event.preventDefault();
            messageError.innerHTML = `Ha ingresado un valor incorrecto: ${keyValue}, este campo solo acepta letras de: A-Z.`;
            ariaLiveAssertive.innerHTML = `Ha ingresado un valor incorrecto: ${keyValue}, este campo solo acepta letras de: A, a la Z.`;
            this.showCharacterError(event);
        }
    }

    validationAnswers() {
        let arrResponses = [],
            arrLetters = [],
            elementSquared,
            arrCorrectAnswers = [],
            arrWrongAnswers = [];

        elementSquared = this.activeContext.querySelectorAll('.colored');
        elementSquared.forEach((element) => {
            element.classList.remove('bien', 'mal');
        });
        for (let i = 1; i <= this.activeContent.length; i++) {
            let directionResponse = this.activeContext.querySelectorAll(
                `[data-vertical-number = "${i}"]`
            );
            if (directionResponse.length > 0) {
                directionResponse.forEach((element) => {
                    arrLetters.push(element.value);
                });
            } else {
                directionResponse = this.activeContext.querySelectorAll(
                    `[data-horizontal-number = "${i}"]`
                );

                directionResponse.forEach((element) => {
                    arrLetters.push(element.value);
                });
            }
            arrResponses.push(arrLetters.join(''));
            arrLetters = [];

            this.activeContent.forEach((element) => {
                if (element.number == i) {
                    if (element.word.toUpperCase() === arrResponses[i - 1]) {
                        directionResponse.forEach((element) => {
                            element.parentNode.classList.add('bien');
                            element.parentNode.classList.remove('mal');
                        });
                        arrCorrectAnswers.push(element.word.toUpperCase());
                    } else {
                        directionResponse.forEach((element) => {
                            if (!element.parentNode.classList.contains('bien')) {
                                element.parentNode.classList.add('mal');
                            }
                        });
                        arrWrongAnswers.push(arrResponses[i - 1]);
                    }
                }
            });
        }
        ariaLiveAssertive.innerHTML = `Ha activado la función de validar, ${
            arrCorrectAnswers.length > 0
                ? `ha obtenido ${arrCorrectAnswers.length} respuestas correctas, el listado es: ${arrCorrectAnswers}`
                : 'No ha obtenido respuestas correctas'
        }, ${
            arrWrongAnswers.length > 0
                ? `ha obtenido ${arrWrongAnswers.length} respuestas incorrectas, el listado es: ${arrWrongAnswers}`
                : 'No ha obtenido respuestas incorrectas'
        }, para un total de: ${arrResponses.length} preguntas contestadas.`;
    }

    observers() {
        let context = this.activeContext.querySelector('.crossWord-grid'),
            config = { attributes: true, childList: true, subtree: true },
            observer = new MutationObserver(this.showButtons);
        observer.observe(context, config);
    }

    showButtons() {
        let allSquared = this.activeContext.querySelectorAll('.colored').length;
        let fullSquares = this.activeContext.querySelectorAll('.inputLetter');
        let totalFullSquares = 0;
        let restartButton = this.activeContext.querySelector(
            `#G${this.activeGameIndex}Restart`
        );
        let validateButton = this.activeContext.querySelector(
            `#G${this.activeGameIndex}Validate`
        );

        fullSquares.forEach((element) => {
            if (element.value != 0) {
                totalFullSquares += 1;
            }
        });

        if (
            totalFullSquares === allSquared &&
            validateButton.classList.contains('hidden')
        ) {
            validateButton.classList.remove('hidden');
            validateButton.focus();
        } else if (totalFullSquares > 0 && totalFullSquares < allSquared) {
            restartButton.classList.remove('hidden');
            validateButton.classList.add('hidden');
        } else if (totalFullSquares === 0) {
            restartButton.classList.add('hidden');
            validateButton.classList.add('hidden');
        }
    }

    instructions() {
        ariaLiveAssertive.innerHTML = `Instrucciones activadas: Para completar el crucigrama, puede navegar entre las preguntas con la tecla de tabulación. Al estar en la pregunta, presione la letra que quiera asignar al campo, para desplazarse en los campos de la pregunta, presione las flechas de dirección en el teclado (arriba, abajo, derecha o izquierda), según la orientación de la palabra, si la palabra es vertical, podrá desplazarse con las teclas (arriba o abajo) si la palabra es horizontal, podrá desplazarse con las teclas (izquierda o derecha.), en este crucigrama deberá responde un total de ${this.activeContent.length} preguntas, para escuchar nuevamente las instrucciones, presione las teclas, SHIFT, más, A. Para reiniciar el crucigrama presione las teclas SHIFT, más, Q. Para salir del crucigrama presione las teclas  SHIFT, más, E.`;
    }

    showCharacterError(activeInput) {
        this.tooltipError.classList.remove('hidden');
        let positionRight = Math.round(
            activeInput.target.getBoundingClientRect().right -
                this.activeContext.getBoundingClientRect().left +
                15
        );
        let positionTop = Math.round(
            activeInput.target.getBoundingClientRect().top -
                this.activeContext.getBoundingClientRect().top +
                25
        );
        this.tooltipError.style.left = `${positionRight}px`;
        this.tooltipError.style.top = `${positionTop}px`;
        activeInput.target.parentNode.classList.add('inputError');
        activeInput.target.parentNode.addEventListener(
            'blur',
            function () {
                activeInput.target.parentNode.classList.remove('inputError');
            },
            true
        );
    }

    exitCrossword() {
        ariaLiveAssertive.innerHTML =
            'Ha activado la opción: salir del crucigrama, será llevado al botón de Página siguiente.';
        document.querySelector('.o-wrapper_footer .c-btn_next').focus();
    }
}
