class OrderSentences {
    constructor(object) {
        let { container, arrOptions, arrPhrase } = object;
        this.initialize = this.initialize.bind(this);
        this.assignButton = this.assignButton.bind(this);
        this.restar = this.restar.bind(this);
        this.instructions = this.instructions.bind(this);
        this.conversionSynbols = this.conversionSynbols.bind(this);
        this.container = container;
        this.arrOptions = arrOptions;
        this.arrPhrase = arrPhrase;
    }

    initialize() {
        this.slideIndex = this.slideIndex == null ? 0 : this.slideIndex;
        this.containerActive = document.querySelector(this.container);
        this.createFields();
        this.buttonContainer = this.containerActive.querySelector('.buttonContainer');

        if (this.buttonContainer) {
            this.buttonContainer.addEventListener('click', this.assignButton);
            this.containerGame
                .querySelector('.btnReiniciar')
                .addEventListener('click', this.restar);
        }

        this.containerActive.addEventListener('keyup', this.instructions);
    }
    // Creo cada uno de los campos segun la cantidad de palabras.
    createFields() {
        this.containerGame = this.containerActive.querySelector('.game_OrderSentences');
        this.containerGame.setAttribute('role', 'Application');
        this.fields = `<div class="buttonContainer">`;
        for (let index = 0; index < this.arrOptions[this.slideIndex].length; index++) {
            this.fields += `<button class="buttonOptions" data-sentence-id ="${
                this.slideIndex
            }-${index}" aria-label="Opción: ${index + 1}, ${this.conversionSynbols(
                this.arrOptions[this.slideIndex][index]
            )}">${this.arrOptions[this.slideIndex][index]}`;
            this.fields += `</button>`;
        }
        this.fields += `</div>`;
        this.fields += `<div class="fieldResponse" data-response-id ="${this.slideIndex}" data-reader=""></div>`;
        this.fields += `<button class="btnReiniciar c-btn_navigation centrado" data-btn-reiniciar ="${this.slideIndex}" hidden="true" >Reiniciar</button>`;

        if (!this.containerGame.firstChild.classList.contains('buttonContainer')) {
            this.containerGame.innerHTML = this.fields;
        }
    }

    assignButton() {
        this.buttonActive = event.target;
        this.containerGame.querySelector('.btnReiniciar').removeAttribute('hidden');

        if (this.buttonActive && this.buttonActive.tagName === 'BUTTON') {
            this.buttonText = this.buttonActive.textContent;
            this.fieldResponse = this.containerGame.querySelector('.fieldResponse');
            this.fieldResponse.innerHTML += this.buttonText;
            this.fieldResponse.dataset.reader += this.conversionSynbols(this.buttonText);
            this.buttonActive.remove();

            window.ariaLiveAssertive.innerHTML = `Ha seleccionado la opción: ${this.conversionSynbols(
                this.buttonText
            )}. La palabra conformada es: ${this.fieldResponse.dataset.reader}`;

            if (!this.buttonContainer.firstChild) {
                this.validateResponse();
            }
        }
    }

    validateResponse() {
        if (this.fieldResponse.textContent === this.arrPhrase[this.slideIndex]) {
            this.fieldResponse.classList.add('bien');
            window.ariaLivePolite.innerHTML = `Felicidades, ordenó correctamente la pregunta: ${this
                .slideIndex + 1}. ${this.fieldResponse.textContent}`;
        } else {
            this.fieldResponse.classList.add('mal');
            window.ariaLivePolite.innerHTML = `Incorrecto!, no ordenó correctamente la pregunta: ${this
                .slideIndex + 1}. Su respuesta fue: ${
                this.fieldResponse.textContent
            }, vuelva a intentarlo.`;
        }
    }

    restar() {
        window.ariaLivePolite.innerHTML = `Ha accionado el boton de reiniciar. La pregunta: ${this
            .slideIndex + 1}. Ha sido reiniciada correctamente.`;
        this.containerGame.innerHTML = this.fields;
        this.initialize();
    }

    instructions() {
        const keyValue = event.key.toUpperCase();

        if (event.shiftKey && keyValue == 'Q') {
            window.ariaLiveAssertive.innerHTML = `Ha activado la ayuda de escucha: La oración conformada es: ${
                this.fieldResponse == undefined
                    ? 'No tiene palabras seleccionadas'
                    : this.fieldResponse.dataset.reader
            }. Para escucharla nuevamente, presione las teclas shift, más, Q.`;
        } else if (event.shiftKey && keyValue == 'A') {
            window.ariaLiveAssertive.innerHTML =
                'Instrucciones activadas: Organize cada uno de los elementos que conforman la oración, para ello desplácese sobre los elementos con la tecla tabulación, al sitúarse sobre cada elemento selecciónelo con la tecla enter o la barra espaciadora. Para escuchar la oración conformada, presione las teclas: Shift, más, Q. Para escuchar nuevamente este mensaje, presione las teclas: Shift, más, A.';
        }
    }

    conversionSynbols(symbol) {
        this.symbol = symbol;

        switch (this.symbol) {
            case '.':
            case '. ':
                this.symbol = ' signo de puntuación: punto, ';
                return this.symbol;
            case ',':
            case ', ':
                this.symbol = ' signo de puntuación: coma, ';
                return this.symbol;
            case ';':
            case '; ':
                this.symbol = ' signo de puntuación: punto y coma, ';
                return this.symbol;
            case ':':
            case ': ':
                this.symbol = ' signo de puntuación: dos puntos, ';
                return this.symbol;
            case '...':
            case '... ':
                this.symbol = ' signo de puntuación: puntos suspensivos, ';
                return this.symbol;
            case '(':
            case ' (':
            case ' ( ':
                this.symbol = ' signo de puntuación: paréntesis de apertura, ';
                return this.symbol;
            case ')':
            case ') ':
                this.symbol = ' signo de puntuación: paréntesis de cierre, ';
                return this.symbol;
            case ').':
                this.symbol =
                    ' signo de puntuación: paréntesis de cierre seguido de un punto, ';
                return this.symbol;
            case '!':
            case '! ':
                this.symbol = ' signo de puntuación: exclamación de cierre, ';
                return this.symbol;
            case '¡':
            case ' ¡':
                this.symbol = ' signo de puntuación: exclamación de apertura, ';
                return this.symbol;
            case '¿':
            case ' ¿':
                this.symbol = ' signo de puntuación: interrogación de apertura, ';
                return this.symbol;
            case '?':
            case '? ':
                this.symbol = ' signo de puntuación: interrogación de cierre, ';
                return this.symbol;
            case '“':
            case ' “':
                this.symbol = ' signo de puntuación: comillas dobles de apertura, ';
                return this.symbol;
            case '”':
            case '” ':
                this.symbol = ' signo de puntuación: comillas dobles de cierre, ';
                return this.symbol;
            case "'":
            case " '":
                this.symbol = ' signo de puntuación: comilla sencilla, ';
                return this.symbol;
            default:
                return this.symbol;
        }
    }
}
