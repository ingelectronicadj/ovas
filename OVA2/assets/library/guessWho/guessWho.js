const guessWho = (context, clues) => {
    context = document.getElementById(context);
    let clueTxt = context.querySelector('.clueTxt');
    let inputAnswer = context.querySelector('.answerTxt');
    let characterImg = context.querySelector('.characterImg');
    let words = Object.keys(clues);
    let numWord = 0; //numero de adivinanza, si hay q adivinar mas de un personaje
    let numClue = 0; //numero de pista

    const askClue = () => {
        let currentWord = clues[words[numWord]];

        if (numClue < currentWord.length) {
            clueTxt.innerHTML = currentWord[numClue];
            ariaLivePolite.innerHTML = currentWord[numClue];
            numClue++;
        } else {
            ariaLivePolite.innerHTML = 'Las pistas se han agotado';
        }
    };
    const checkAnswer = () => {
        let isGood = ova.checkActivity(
            inputAnswer.previousElementSibling,
            inputAnswer.value.toLowerCase().trim() == words[numWord],
            'icon-u-good',
            'icon-u-wrong'
        );

        if (isGood) {
            characterImg.classList.remove('img-hidden');
            ariaLivePolite.innerHTML = 'ENHORABUENA HA SUPERADO LA ACTIVIDAD';
        } else {
            characterImg.classList.add('img-hidden');
            ariaLivePolite.innerHTML = 'Su respuesta es incorrecta';
        }
    };
    const clear = () => {
        inputAnswer.value = '';
        inputAnswer.previousElementSibling.classList.remove(
            'icon-u-good',
            'icon-u-wrong'
        );
        numClue = 0;
        ariaLivePolite.innerHTML = 'Ha limpiado el juego.';
    };
    context.querySelector('.clueBtn').addEventListener('click', askClue);
    context.querySelector('.checkBtn').addEventListener('click', checkAnswer);
    context.querySelector('.clearBtn').addEventListener('click', clear);
};
