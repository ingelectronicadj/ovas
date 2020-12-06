const progressbar = {
    bar: null,
    progressText: null,
    btnCorrect: null,
    totalAnswers: null,
    qualitative: null,
    initialize: (context, numAnwers, isQualitative = false) => {
        context = progressbar.bar = document.querySelector(context);
        progressbar.progressText = context.querySelector('.c-respuestasAcertadas_text');
        progressbar.btnCorrect = context.querySelector('.c-respuestasAcertadas_icon');
        progressbar.totalAnswers = numAnwers;

        if (isQualitative) {
            progressbar.qualitative = document.querySelector('.c-qualitative img');
            progressbar.qualitative.src = 'assets/images/bar_0.png';
        }
    },
    onIncrement: (asnwerCorrect) => {
        document
            .querySelector('html')
            .style.setProperty(
                '--progressBar',
                asnwerCorrect / (progressbar.totalAnswers / 100) + '%'
            );
        progressbar.progressText.innerHTML = `<span> ${asnwerCorrect} / ${progressbar.totalAnswers} </span>`;

        progressbar.progressText.setAttribute(
            'aria-label',
            `${asnwerCorrect} de ${progressbar.totalAnswers}`
        );
        if (asnwerCorrect === progressbar.totalAnswers) {
            progressbar.btnCorrect.classList.add('completado');
        }
        if (progressbar.qualitative) {
            progressbar.qualitative.src = `assets/images/bar_${asnwerCorrect}.png`;
        }
    },
};
