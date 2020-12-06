class WordCookiesCross {
    constructor(wordObject) {
        let { arrContents, arrScene, arrSVG, arrFeedbacks, context, board } = wordObject;

        this.score = 0;

        this.arrContents = arrContents;
        this.context = document.querySelector(context);
        this.board = board;
        this.arrScene = arrScene;
        this.arrSVG = arrSVG;
        this.arrFeedbacks = arrFeedbacks;
        this.initialize = this.initialize.bind(this);
        this.assignEvents = this.assignEvents.bind(this);
        this.insertLetterButtons = this.insertLetterButtons.bind(this);
        this.compareWords = this.compareWords.bind(this);
        this.validateWords = this.validateWords.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.calculateNextLevel = this.calculateNextLevel.bind(this);
        this.cleanGame = this.cleanGame.bind(this);
    }

    initialize(indexGame = 0) {
        this.activeGameIndex = indexGame;
        this.arrWordsFound = [];
        this.btnValidarGame = this.context.querySelector('#btnValidarGame');
        this.btnReiniciarGame = this.context.querySelector('#btnReiniciarGame');
        this.btnSiguienteNivel = this.context.querySelector('#btnSiguienteNivel');

        this.scoreGame = this.context.querySelector('.scoreGame');

        this.btnLimpiarPalabra = this.context.querySelector('#btnLimpiarPalabra');

        this.btnValidarGame.addEventListener('click', this.validateWords);
        this.btnLimpiarPalabra.addEventListener('click', this.clearInput);
        this.btnReiniciarGame.addEventListener('click', this.cleanGame);

        this.activeScene = document.querySelector(this.arrScene[this.activeGameIndex]);
        this.activeContent = this.arrContents[this.activeGameIndex];

        this.activeFeedback = this.arrFeedbacks[this.activeGameIndex];

        this.insertLetterButtons();
        this.activeLevel();
    }

    activeLevel() {
        let levels = document.querySelectorAll('[data-order-game]');
        levels.forEach((element) => {
            if (parseInt(element.dataset.orderGame) == this.activeGameIndex) {
                element.querySelectorAll('.letter').forEach((element) => {
                    element.classList.add('hidden');
                });
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    insertLetterButtons() {
        let buttonContainer = this.context.querySelector('.lettersButtons');
        buttonContainer.innerHTML = '';

        // console.log(
        //     'Valor para: WordCookiesCross -> insertLetterButtons -> this.activeContent',
        //     this.activeContent
        // );

        let allLetters = this.activeContent[0].letters;

        allLetters.forEach((element) => {
            buttonContainer.innerHTML += `<button id="${this.activeGameIndex}-${element}" data-value-letter ="${element}">${element}</button>`;
        });

        buttonContainer.addEventListener('click', this.assignEvents);
    }

    assignEvents() {
        if (event.target.tagName == 'BUTTON') {
            this.storeLetters();
        }
    }

    storeLetters() {
        let letter = event.target.dataset.valueLetter;
        ariaLiveAssertive.innerHTML = `Ha oprimido la letra ${letter}. `;
        // console.log(`Ha oprimido la letra ${letter}. `);
        let writtenWord = this.context.querySelector('.writtenWord');
        this.inputWrittenWord = this.context.querySelector('.inputWrittenWord');
        this.inputWrittenWord.value += letter;

        let arrLetters = [...this.inputWrittenWord.value]; //! Validar Maximo 10 Letras.
    }

    compareWords(inputWrittenWord) {
        if (
            this.activeContent[0].words.includes(inputWrittenWord) &&
            !this.arrWordsFound.includes(inputWrittenWord)
        ) {
            this.arrWordsFound.push(inputWrittenWord);
            this.showWord(inputWrittenWord);
            this.score += 50;
            this.scoreGame.value = this.score;
            // console.log(this.arrWordsFound.length, this.activeContent[0].words.length);

            if (this.arrWordsFound.length == this.activeContent[0].words.length) {
                // console.log('Mostrar botón');
                this.btnSiguienteNivel.classList.remove('hidden');
                this.btnSiguienteNivel.addEventListener('click', this.calculateNextLevel);
            }

            ariaLiveAssertive.innerHTML = `Correcto, ${inputWrittenWord} es una palabra valida, se han añadido 50 unidades a su puntaje, su puntaje actual es: ${this.score}.`;
            // console.log(`Correcto, ${inputWrittenWord}  es una palabra valida.`);
            this.inputWrittenWord.classList.add('bien');

            setTimeout(() => {
                this.clearInput();
                this.inputWrittenWord.classList.remove('bien');
            }, 3000);
        } else if (
            this.activeContent[0].words.includes(inputWrittenWord) &&
            this.arrWordsFound.includes(inputWrittenWord)
        ) {
            ariaLiveAssertive.innerHTML = `La palabra: ${inputWrittenWord} es valida, pero ya se encuentra en el tablero.`;
            // console.log(
            //     `La palabra: ${inputWrittenWord} es valida, pero ya se encuentra en el tablero.`
            // );
            setTimeout(() => {
                this.clearInput();
            }, 3000);
        } else {
            ariaLiveAssertive.innerHTML = `Incorrecto, ${inputWrittenWord} no es una palabra valida, se ha restado una unidad a su puntaje, su puntaje actual es: ${this.score}.`;
            this.score -= 1;
            this.scoreGame.value = this.score;
            // console.log(
            //     `Incorrecto, ${inputWrittenWord} no es una palabra valida, se ha restado una unidad a su puntaje, puntaje actual: ${this.score}.`
            // );
            this.inputWrittenWord.classList.add('mal');

            setTimeout(() => {
                this.clearInput();
                this.inputWrittenWord.classList.remove('mal');
            }, 3000);
        }
    }

    validateWords() {
        this.compareWords(this.inputWrittenWord.value);
    }

    showWord(inputWrittenWord) {
        let allLetters = this.context.querySelectorAll(`.${inputWrittenWord}`);
        allLetters.forEach((element) => {
            element.classList.remove('hidden');
            element.style.fill = 'green';
        });
    }

    clearInput() {
        this.inputWrittenWord.value = '';
        ariaLiveAssertive.innerHTML = `Ha limpiado la palabra correctamente. `;
    }

    calculateNextLevel() {
        let containerLevel = this.context.querySelector('.levelContainer');
        this.btnSiguienteNivel.classList.add('hidden');
        if (this.activeGameIndex < this.arrContents.length - 1) {
            this.activeGameIndex += 1;
            containerLevel.innerHTML = `Level ${this.activeGameIndex + 1}`;
            ariaLiveAssertive.innerHTML = `Ha avanzado al nivel ${this.activeGameIndex +
                1} `;
            this.initialize(this.activeGameIndex);
        } else if (this.activeGameIndex == this.arrContents.length) {
            this.context.innerHTML += `<img src="img/Fondo2.jpg" alt="">`;
            ariaLiveAssertive.innerHTML = `Ha finalizado la actividad correctamente. `;
        } else {
            console.log(this.activeGameIndex, this.arrContents.length - 1);
            console.log(this.activeGameIndex == this.arrContents.length - 1);
        }
    }

    cleanGame() {
        this.initialize();
        this.score = 0;
        this.scoreGame.value = 0;
        this.inputWrittenWord.value = '';
        let containerLevel = (this.context.querySelector(
            '.levelContainer'
        ).innerHTML = `Level 1`);

        ariaLiveAssertive.innerHTML = `Ha reiniciado la actividad correctamente.`;
    }
}
