window.ova.gameHangman = (arrClue, ovaId) => {
    if (arrClue == undefined) {
        console.error(
            'Parametro de [{ type: string, answer: string, value: string }] es requerido para el juego.'
        );
        return;
    }
    const alphabet = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ];
    let level = 0;
    let totalLevel = arrClue.length;
    let lifes = 3; // default;
    let attemptsDefault = 3; // attempts by clue, if lose all attempts lose once live;
    let attempts = attemptsDefault; // attempts by clue, if lose all attempts lose once live;
    let answerLength = 0;
    let currentAnswers = [];
    let corretAnswers = 0; // sirve para validad answerLength en la función fn_pressKey
    let globalScore;
    let globalTime = 2;
    let timeInterval;
    let answerWord;
    let pressedKeys = []; // Este arreglo almacenará las teclas presionadas por el usuario.
    let wordsCorrect = [];

    // Elements
    let clueNewAudio = document.createElement('audio');
    clueNewAudio.setAttribute('controls', 'true');
    let clueNewImage = document.createElement('img');
    let clueNewText = document.createElement('h6');
    let message = document.createElement('div');

    let timeGameElm = document.querySelector('.c-game_time');
    let lifesGameElm = document.querySelector('.c-game_lifes');
    let alertGameElm = document.querySelector('.c-game_alert');
    let finishGameElm = document.querySelector('.c-game_finish');
    let field = document.querySelector('.c-game_field');

    let attemptsElem = document.querySelector('.game-hangman_attempts');
    let clueElem = document.querySelector('.game-hangman_clue');
    let answerWaitedElm = document.querySelector('.game-hangman_answerWaited');
    let keyBoardElem = document.querySelector('.game-hangman_keyboard');

    let messageStatus = document.getElementById('messageStatus');
    let imageAvatar = document.getElementById('image-Avatar');
    let question = document.getElementById('question');
    let classGame = document.querySelector('.c-game_scene');
    let btnGoGame = document.querySelector('[btn= "mostrar"]');
    let contyouWin = document.querySelector('.c-game_win');
    let btnNext = document.createElement('button');
    let messageAssertive = document.querySelector('#ariaLiveAssertive');

    window.ova.focuser(question);
    let keyActive;

    //! Funcion para detectar teclas ↓↓
    function navigationKeyboard(event) {
        let tecla = event.key;
        let newAlphabet = alphabet.toString();
        newAlphabet = newAlphabet.split(',');

        if (
            newAlphabet.includes(tecla.toUpperCase()) &&
            pressedKeys.includes(tecla.toUpperCase())
        ) {
            messageAssertive.innerHTML = `la letra ${tecla} ya ha sido ingresada.`;
        } else if (newAlphabet.includes(tecla.toUpperCase())) {
            pressedKeys.push(tecla.toUpperCase());
            fn_pressKey(tecla);
        } else {
            if (document.activeElement != keyActive) {
                if (keyActive != undefined) {
                    keyActive.setAttribute('role', 'dialog');
                    keyActive.setAttribute('disabled', 'true');
                }
            }
        }
    }

    //! funcion para crear los botones [A-Z] → pantalla.

    let set_keyboard = (alphabet) => {
        if (!keyBoardElem.hasChildNodes()) {
            alphabet.map((row) => {
                let newRow = document.createElement('div');
                newRow.classList.add('game-hangman_keyboard-row');
                row.map((letter) => {
                    let key = document.createElement('input');
                    key.classList.add('game-hangman_keyboard-key');
                    key.setAttribute('letter-key', letter.toLowerCase());
                    key.setAttribute('type', 'button');
                    key.setAttribute('value', letter);
                    key.addEventListener('click', function() {
                        fn_pressKey(key);
                    });
                    document.addEventListener('keyup', navigationKeyboard);
                    newRow.appendChild(key);
                });
                keyBoardElem.appendChild(newRow);
            });
        }
    };

    //! funcion para limpiar los botones, elimina clases y atributos.
    let clean_keyboard = () => {
        [].slice.call(keyBoardElem.children).map((row) => {
            [].slice.call(row.children).map((key) => {
                key.classList.remove('is-good', 'is-wrong');
                key.removeAttribute('aria-label');
                key.removeAttribute('tabindex');
                key.removeAttribute('disabled');
                keyActive = undefined;
            });
        });
    };

    //! función para crear los inputs contenedores de la respuesta. (cantidad de lineas).
    let set_answerWaited = (answer) => {
        answerWord = answer;
        answerWaitedElm.innerHTML = '';

        let countLetterAnswers = answer.length;

        for (let i = 0; i < answer.length; i++) {
            let letter = document.createElement('input');
            let className = [
                'game-hangman_answerWaited-letter',
                'game-hangman_answerWaited-space',
            ];
            letter.setAttribute('type', 'button');
            letter.setAttribute('tabindex', '-1');
            letter.setAttribute('letter', answer[i]);
            letter.setAttribute(
                'aria-label',
                `Este campo se llenara con la letra que usted seleccione mas adelante.`
            );

            if (answer[i] == ' ') {
                letter.classList.add(className[1]);
                --countLetterAnswers;
            } else {
                letter.classList.add(className[0]);
                currentAnswers.push(answer[i].toLowerCase());
            }
            answerWaitedElm.appendChild(letter);
        }
        answerLength = countLetterAnswers;
    };

    //! Función para validar si se completaron todos los niveles, obtiene la pregunta.
    let set_scene = (currentLevel) => {
        if (level >= totalLevel) {
            youWin();
            return;
        }
        // Set info attempts
        attempts = attemptsDefault;
        attemptsElem.setAttribute('attempts', attempts);

        // Set clue and answer and include into scene
        const { type, answer, clue } = arrClue[currentLevel];
        let typeClue;
        switch (
            type // string: img || audio || text.
        ) {
            case 'img':
                typeClue = clueNewImage;
                typeClue.setAttribute('src', clue);
                break;
            case 'audio':
                typeClue = clueNewAudio;
                typeClue.setAttribute('src', clue);
                break;
            default:
                typeClue = clueNewText;
                typeClue.textContent = clue;
                break;
        }
        clueElem.innerHTML = '';
        clueElem.appendChild(typeClue);

        clueElem.setAttribute(
            'aria-label',
            `la pregunta es: ${clue}, la cantidad de letras para esta respuesta es de: ${answer.length}`
        );

        set_answerWaited(answer);
        // set globalScore and include into scene
    };

    //! Función para avanzar de nivel.
    let nextLevel = () => {
        // console.log(level + 1 < totalLevel, level, totalLevel);

        if (level + 1 < totalLevel) {
            level++;
            console.log('Que paso: ', level);
        } else {
            console.log('Ganaste', level);

            youWin();
        }

        // console.log(level, totalLevel);
        corretAnswers = 0;
        currentAnswers = [];
        fn_cleanScene();
        set_scene(level);
    };

    //! funcion para dectar en que boton hizo clic
    let fn_pressKey = (key) => {
        [].slice.call(answerWaitedElm.children).forEach((child) => {
            let letter = child.getAttribute('letter').toLowerCase();
            //Aqui se compara el valor del boton (a,v,g,d...)

            //? Se valida si es por clic o por 'tab + enter' y muestra la letra en las lineas.
            if (key.value != undefined) {
                keyActive = document.activeElement;
                // console.log(keyActive);

                if (key.value.toLowerCase() === letter) {
                    child.setAttribute('value', key.value);
                    ++corretAnswers;
                }
            } else {
                if (key.toLowerCase() === letter) {
                    child.setAttribute('value', key.toUpperCase());
                    ++corretAnswers;
                }
            }
        });

        //? Validación por click o 'tab + enter' o presión de la tecla
        if (key.value != undefined) {
            let elementValue = document.querySelector(
                '[letter-key="' + key.value.toLowerCase() + '"]'
            );

            if (currentAnswers.includes(key.value.toLowerCase())) {
                key.classList.add('is-good');
                elementValue.setAttribute(
                    'aria-label',
                    `Letra ${key.value}, es correcta!`
                );
            } else {
                key.classList.add('is-wrong');
                elementValue.setAttribute(
                    'aria-label',
                    `Letra ${key.value}, es Incorrecta!`
                );

                attempts--;
                attemptsElem.setAttribute('attempts', attempts);
                if (attempts == 0) {
                    setTimeout(() => {
                        lifeLose();
                    }, 2800);
                }
            }
            fn_numberLettersInWord(answerWord.toUpperCase(), key.value);
        } else {
            //? Validación para teclado.

            let elementValue = document.querySelector(
                '[letter-key="' + key.toLowerCase() + '"]'
            );

            if (currentAnswers.includes(key.toLowerCase())) {
                elementValue.classList.add('is-good');
                elementValue.setAttribute('aria-label', `Letra ${key}, es correcta!`);
            } else {
                elementValue.classList.add('is-wrong');
                elementValue.setAttribute('aria-label', `Letra ${key}, es Incorrecta!`);
                attempts--;
                attemptsElem.setAttribute('attempts', attempts);
                if (attempts == 0) {
                    setTimeout(() => {
                        lifeLose();
                    }, 2800);
                }
            }
            fn_numberLettersInWord(answerWord.toUpperCase(), key.toUpperCase());
            elementValue.setAttribute('tabindex', '-1');
            elementValue.setAttribute('disabled', 'true');
        }

        //? Validación de vidas.
        if (lifes == 0) {
            youLose();
        }

        //? Validacón de respuestas correctas, llamá al siguiente nivel.
        if (answerLength == corretAnswers) {
            // console.log('Supper, next.', level, totalLevel);
            keyBoardElem.appendChild(btnNext);
            btnNext.setAttribute('id', 'btnNext');
            btnNext.classList.add('icon-u-arrow-right');
            btnNext.classList.add('bounceIn');
            btnNext.setAttribute('animation', 'bounceIn duration-1');
            btnNext.innerHTML = 'Siguiente';
            setFocustoImgWin = contyouWin.children[0];
            if (level < totalLevel) {
                messageAssertive.textContent = `Acertaste!!, la palabra es: ${answerWord}, siguiente pregunta.`;
                window.ova.focuser(btnNext);
            } else {
                messageAssertive.textContent = `Juego completado!!.`;
                window.ova.focuser(setFocustoImgWin);
            }

            attemptsElem.setAttribute('attempts', 4);
            words = document.querySelector('.game-wordsCorrect').firstChild;
            document.getElementById('btnNext').addEventListener('click', BtnNext, false);
        }
    };

    let fn_cleanScene = () => {
        clean_keyboard();
    };
    let fn_resetKeys = () => {
        answerWaitedElm.innerHTML = '';
    };
    let fn_resetGame = () => {
        level = 0;
        lifes = 3;
        attempts = attemptsDefault;
        attemptsElem.setAttribute('attempts', attempts);
        answerLength = 0;
        currentAnswers = [];
        corretAnswers = 0;
        globalTime = 60;
        fn_resetKeys();
        fn_cleanScene();
        set_keyboard(alphabet);
        clearInterval(timeInterval);
        fn_init(level);
    };

    let lifeLose = () => {
        // --lifes; // se comenta porque no se requieren intentos.
        // lifesGameElm.textContent = lifes;
        attempts = attemptsDefault;
        attemptsElem.setAttribute('attempts', attempts);
    };
    let youWin = () => {
        field.setAttribute('aria-hidden', 'true');
        contyouWin.setAttribute('aria-hidden', 'false');
    };

    let youLose = () => {
        message.textContent = 'Perdiste';
        alertGameElm.style.display = 'block';
        finishGameElm.style.display = 'block';
        finishGameElm.appendChild(message);

        setTimeout(() => {
            alertGameElm.style.display = 'none';
            finishGameElm.style.display = 'none';
            message.textContent = 'none';
            fn_resetGame();
        }, 2000);
    };

    //! Esta función permite determinar cuantas veces esta una letra en la palabra.
    let fn_numberLettersInWord = (word, key) => {
        let positionKey = []; // Array que almacenará las posiciones de la letra en la palabra.
        let letterPosition = word.indexOf(key); // Posición de la letra por cada recorrido.
        let numberLetters; // Cantidad de letras  encontradas en la palabra.

        while (letterPosition != -1) {
            positionKey.push(letterPosition + 1); // Se alamacena la posición de la letra encontrada.
            letterPosition = word.indexOf(key, letterPosition + 1); // Se aumenta el numero de la posición en busqueda de más letras.
        }
        numberLetters = positionKey.length; // se alamacena el número de letras encontradas.

        if (numberLetters > 1) {
            messageAssertive.innerHTML = `La letra: ${key} es correcta, se encontró ${numberLetters} veces en las posiciones ${positionKey}.`;
        } else if (numberLetters == 1) {
            messageAssertive.innerHTML = `La letra: ${key} es correcta, se encontró una vez en la posición ${positionKey}.`;
        } else {
            messageAssertive.innerHTML = `La letra: ${key} es incorrecta, no se encuentra en la palabra.`;
        }

        setTimeout(() => {
            keyActive && window.ova.focuser(keyActive);
        }, 6000);
    };

    let fn_init = (currentLevel) => {
        btnGoGame.remove();
        field.setAttribute('aria-hidden', 'false');
        imageAvatar.style.display = 'block';
        imageAvatar.setAttribute('tabIndex', '0');
        clueElem.setAttribute('tabindex', '0');
        keyBoardElem.setAttribute('tabindex', '0');
        // classGame.style.backgroundImage = "url('./assets/images/slider_fondo.png')";
        set_scene(currentLevel);
        set_keyboard(alphabet);
        //setGlobalTime(globalTime, timeGameElm, youLose); // Reinicia el jugo al completar el tiempo.
        // lifesGameElm.textContent = lifes; // contador de vidas
    };

    let BtnNext = () => {
        // Asignar palabra correcta en listado
        words.children[level].textContent = answerWord.toUpperCase();
        nextLevel();
        imageAvatar.src = `./assets/images/slide${ovaId}_${level + 1}.gif`;
        imageAvatar.alt = `imagen de 5 engranajes, ${level} / ${totalLevel} preguntas contestadas`;
        window.ova.focuser(question);
        messageStatus.setAttribute('tabindex', '-1');
        messageStatus.setAttribute('aria-label', '');
        pressedKeys = [];
        // console.log(level);
        btnNext.remove();
    };

    fn_init(level);
};
