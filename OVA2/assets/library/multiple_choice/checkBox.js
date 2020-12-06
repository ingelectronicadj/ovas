let cb = null;
const checkBox = {
    context: null,
    arr_groups: null,
    index: 0,
    info_bar: null,
    arr_cb: null,
    limit: null,
    check_cb: null,
    onChoice: (e) => {
        let input_ck = e.target || e;
        let arr_answers = cb.context.querySelectorAll('input:not([disabled]):checked');
        if (input_ck.checked) {
            let isGood = false;
            ariaLivePolite.innerHTML = 'Seleccionado, ';

            isGood = input_ck.value == cb.arr_groups[cb.index];
            if (isGood) {
                input_ck.nextSibling.classList.add('icon-u-good');
                ariaLivePolite.innerHTML += 'correcto. ';
            } else {
                input_ck.nextSibling.classList.add('icon-u-wrong');
                ariaLivePolite.innerHTML += 'incorrecto. ';
            }
            if (cb.limit != 1) {
                ariaLivePolite.innerHTML += arr_answers.length + ' de ' + cb.limit;
            }
            isGood =
                cb.limit != 1
                    ? cb.context.querySelectorAll('.icon-u-good').length == cb.limit
                    : isGood;

            if (arr_answers.length >= cb.limit) {
                arr_answers.forEach((elm) => {
                    if (isGood) {
                        elm.disabled = true;
                    } else {
                        setTimeout(() => {
                            elm.checked = false;
                            elm.nextElementSibling.classList.remove('icon-u-wrong');
                            elm.nextElementSibling.classList.remove('icon-u-good');
                            elm.parentNode.parentNode.firstChild.classList.remove('mal');
                            elm.nextSibling.classList.remove('bien', 'mal');
                            elm.parentNode.parentNode.firstChild.classList.remove('bien');

                            ariaLiveAssertive.innerHTML =
                                'Se ha limpiado la selección, debido a la respuesta incorrecta. vuelva a seleccionar las que considere correctas.';
                        }, 500);
                    }
                });
                if (cb.check_cb != null) {
                    cb.check_cb(isGood);
                }
            }
        } else {
            ariaLivePolite.innerHTML =
                'deseleccionado. ' + arr_answers.length + ' de ' + cb.limit;
            input_ck.nextSibling.classList.remove('icon-u-wrong', 'icon-u-good');
        }
    },
    initialize: (context, limitChoice, groups, index) => {
        cb = checkBox;
        cb.context = document.querySelector(context);
        cb.arr_groups = groups;
        cb.arr_cb = cb.context.querySelectorAll('.js-check_b');
        cb.arr_labels = cb.context.querySelectorAll('.c-input_radio');
        cb.info_bar = cb.context.querySelector('.c-opt_info');
        cb.limit = limitChoice;
        cb.index = index;
        cb.arr_cb.forEach(function(elm) {
            elm.addEventListener('change', cb.onChoice, event);
            elm.nextSibling.addEventListener('keyup', function(e) {
                if (e.keyCode == 13) {
                    e.target.previousElementSibling.checked = !e.target
                        .previousElementSibling.checked;
                    cb.onChoice(e.target.previousElementSibling);
                }
            });
        });

        cb.arr_labels.forEach((label) => {
            label.addEventListener('keydown', (e) => {
                let key = e.key,
                    radioId;
                if (key == 'Enter' || key == ' ') {
                    radioId = e.target.htmlFor;
                    if (radioId != undefined) {
                        cb.context.querySelector(`#${radioId}`).click();
                    } else {
                        radioId = e.target.dataset.radioId;
                        radioId != undefined
                            ? cb.context.querySelector(`#${radioId}`).click()
                            : console.log('No tiene radio.');
                    }
                }
            });
        });

        cb.context.addEventListener('keyup', function() {
            if (event.shiftKey && event.keyCode == 65) {
                ariaLivePolite.innerText = cb.context.querySelector('.c-jaws').innerText;
            }
        });
    },
};
