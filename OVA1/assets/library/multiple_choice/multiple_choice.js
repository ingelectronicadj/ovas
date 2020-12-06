const multiple_choice = {
    context: null,
    limit: null,
    arr_groups: null,
    index: 0,
    info_bar: null,
    check_cb: null,
    initialize: (context, limitChoice, groups, check_cb = null) => {
        multiple_choice.context = document.querySelector(context);
        multiple_choice.limit = limitChoice;
        multiple_choice.arr_groups = groups;
        multiple_choice.info_bar = multiple_choice.context.querySelector('.c-opt_info');
        multiple_choice.check_cb = check_cb;

        multiple_choice.context.addEventListener('keyup', function() {
            if (event.shiftKey && event.keyCode == 65) {
                ariaLivePolite.innerText = multiple_choice.context.querySelector(
                    '.c-jaws'
                ).innerText;
            }
        });
    },
    onChoice: (e) => {
        const self = multiple_choice;
        if (e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            ariaLivePolite.innerHTML = 'deseleccionado. ';
        } else {
            e.target.classList.add('active');
            ariaLivePolite.innerHTML = 'Seleccionado. ';
        }

        let arr_answers = self.context.querySelectorAll('.active');
        let isWrong = false;
        if (self.info_bar != null) {
            self.info_bar.innerHTML = `<p>${arr_answers.length}/${self.limit} ${
                self.arr_groups[self.index]
            }</p>`;
        }
        ariaLivePolite.innerHTML +=
            'Se han escogido ' +
            arr_answers.length +
            ' de ' +
            self.limit +
            ' para ' +
            self.arr_groups[self.index];
        if (arr_answers.length >= self.limit) {
            arr_answers.forEach((element) => {
                if (element.getAttribute('data') != self.arr_groups[self.index]) {
                    isWrong = true;
                    element.classList.add('mal');
                    element.parentElement.classList.add('icon-u-wrong');
                } else {
                    element.classList.add('bien');
                    element.parentElement.classList.add('icon-u-good');
                }
                element.classList.remove('active');
            });

            arr_answers.forEach((element) => {
                if (!isWrong) {
                    element.setAttribute('disabled', 'disabled');
                    element.nextElementSibling.innerText = self.arr_groups[self.index];
                } else {
                    setTimeout(() => {
                        element.classList.remove('mal', 'bien');
                        element.parentElement.classList.remove(
                            'icon-u-wrong',
                            'icon-u-good'
                        );
                    }, 800);
                }
            });
            if (self.check_cb != null) {
                self.check_cb();
            }
            if (!isWrong) {
                ariaLivePolite.innerHTML =
                    'Muy bién, ha encontrado todas las definiciones de ' +
                    self.arr_groups[self.index] +
                    '. ';
                if (self.index + 1 < self.arr_groups.length) {
                    self.index++;
                    ariaLivePolite.innerHTML +=
                        '. Ahora seleccione las definiciones para ' +
                        self.arr_groups[self.index];
                } else {
                    ariaLivePolite.innerHTML +=
                        'Además, ha encontrado todas las definiciones para cada término';
                }
            } else {
                ariaLivePolite.innerHTML =
                    'Algunos de  los conceptos que seleccionó no corresponden a ' +
                    self.arr_groups[self.index];
            }
            if (self.info_bar != null) {
                self.info_bar.innerHTML = `<p>0/${self.limit} ${
                    self.arr_groups[self.index]
                }</p>`;
            }
        }
    },
};
