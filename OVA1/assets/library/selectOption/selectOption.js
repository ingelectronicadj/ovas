const selectOption = (answers, context) => {
    let arr_opts = [...document.querySelectorAll('.' + context + ' select')];
    let reader = document.querySelector('.' + context + ' #reader');
    let goods = 0;
    let btnCheck = document.querySelector('.' + context + ' .checkBtn');

    const checkAnswers = () => {
        arr_opts.forEach(function(elm, i) {
            if (elm.value == answers[i]) {
                elm.previousElementSibling.className = 'icon-u-good';
                goods++;
            } else {
                elm.previousElementSibling.className = 'icon-u-wrong';
                elm.setAttribute(
                    'aria-label',
                    ', Incorrecto, haz elegido ' +
                        elm.options[elm.selectedIndex].innerHTML
                );
            }
        });
        if (goods == answers.length) {
            reader.innerHTML =
                'Muy bien, haz completado todas las afirmaciones de manera correcta';
        } else {
            reader.innerHTML =
                'Obtuviste ' +
                goods +
                'bien de ' +
                answers.length +
                ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,';
        }
        window.ova.focuser(document.querySelector('.' + context));
    };

    btnCheck.addEventListener('click', checkAnswers);

    $('.' + context + ' select').on('change', function() {
        $(this).attr(
            'aria-label',
            $(this)
                .find('option:selected')
                .text()
        );
    });
    // console.log(arr_opts);
};
