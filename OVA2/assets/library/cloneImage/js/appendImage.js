const appendImage = (container, slideIndex, answer) => {
    let context = container.querySelector(`.gameMusic`);
    let pentagram = context.querySelector(`.js-pentagrama`);
    let imageOnModal = context.querySelector('.js-modalMusic');
    let btnCheck = container.querySelector('.btnCheck');
    let btnClear = document.querySelector('.btnClear');
    let reader = document.querySelector('#accordionServ div');

    const checkAnswers = () => {
        let arr_responses = [...pentagram.children];
        let user_answer = 0;
        arr_responses.forEach((element) => {
            user_answer += parseFloat(element.getAttribute('datafigure'));
        });
        if (user_answer == answer[slideIndex]) {
            reader.innerHTML = 'Muy bien, tu respuesta es correcta.';
            feedback.give('bien');
        } else {
            reader.innerHTML = 'Vuelve a intentarlo tu respuesta no es correcta.';
            feedback.give('mal');
        }
    };

    const clearPentagram = () => {
        pentagram.innerHTML = '';
        pentagram.classList.remove('icon-u-wrong', 'icon-u-good');
        pentagram.setAttribute('aria-label', 'Pentagrama. ');
        reader.innerHTML = 'Haz limpiado el pentagrama.';
    };

    const onSelectFigure = (element) => {
        if (element.tagName != 'SPAN') {
            if (pentagram.childNodes.length < 10) {
                let _thisNote = element.cloneNode(true);
                let cur_ariaLabel = pentagram.getAttribute('aria-label');
                let nameNote = _thisNote.querySelector('img').alt;
                pentagram.setAttribute(
                    'aria-label',
                    cur_ariaLabel + ' ' + nameNote + '.'
                );
                pentagram.appendChild(_thisNote);
                reader.innerHTML =
                    'Seleccionaste ' + nameNote + '. Haz salido del modal.';
            } else {
                reader.innerHTML = 'No puedes agregar mas de 10 figuras';
            }
        }
    };

    const clickModal = (e) => {
        onSelectFigure(e.target);
    };
    const keyModal = (e) => {
        if (e.keyCode == 13) {
            e.target.click();
        }
    };
    //removemos listerners para evitar ejecucion multiple de funciones
    imageOnModal.removeEventListener('click', clickModal);
    imageOnModal.removeEventListener('keyup', keyModal);
    btnCheck.removeEventListener('click', checkAnswers);
    btnClear.removeEventListener('click', clearPentagram);

    btnCheck.addEventListener('click', checkAnswers);
    btnClear.addEventListener('click', clearPentagram);
    imageOnModal.addEventListener('click', clickModal, event);
    imageOnModal.addEventListener('keyup', keyModal, event);
    context.addEventListener('keyup', function() {
        if (event.shiftKey && event.keyCode == 65) {
            ariaLivePolite.innerText = context.querySelector('.c-jaws').innerText;
        }
    });
};
