let self = null;
const fullDragDrop = {
    html_copy: null,
    bool_paste: false,
    word: null,
    context: null,
    maxDragsPerDrop: null,
    originalContain: null,
    selfWinding: false,
    isFeedback: false,
    arr_answers: '',
    context_selector: null,
    autoFeedBack: null,
    onFeedBack: (isGood) => {
        if (self.isFeedback) {
            if (isGood) {
                feedback.give('bien');
            } else {
                feedback.give('mal');
            }
        } else {
            if (isGood) {
                ariaLiveAssertive.innerText = 'Muy bien, ha contestado correctamente';
            } else {
                ariaLiveAssertive.innerText = 'Algunas de sus respuestas son incorrectas';
            }
        }
        return isGood;
    },
    autoRate: (dragElm, dropElm) => {
        let isGood = self.onChecking(dragElm.get(0), dropElm.get(0));
        dragElm.draggable({ revert: 'valid' });
        setTimeout(() => {
            dragElm.draggable({ revert: 'invalid' });
        }, 100);

        if (self.autoFeedBack == null) {
            self.onFeedBack(isGood);

            if (isGood) {
                self.onDropping(dragElm, dropElm);
            }
        } else {
            self.onFeedBack(self.autoFeedBack);
        }
    },
    onDropping: (dragElm, dropElm) => {
        if (self.cloneDrag && dragElm.hasClass('cloneable')) {
            let elmToClone = dragElm;
            dragElm.draggable({ disabled: false });
            dragElm.attr('style', '');
            elmToClone.clone().appendTo(dropElm);
        } else {
            dragElm.draggable({ disabled: true });
            dropElm.append(dragElm);
            dragElm.attr('style', '');
            dragElm.attr('tabindex', '-1');
        }

        if (dropElm.find('.js-drag').length == self.maxDragsPerDrop) {
            dropElm.droppable({ disabled: true });
        }

        // ↓↓↓ Ajuste de Juego Tabla Periodica ↓↓↓
        let tablaDados = document.querySelector('.tableDados');
        if (tablaDados) {
            let btnRollDice = document.querySelector('.btnRollDice');
            btnRollDice.classList.remove('element-display');
        }
    },
    copy: (event) => {
        if (document.activeElement.classList.contains('js-drag')) {
            self.html_copy = document.activeElement;
            self.word = self.html_copy.getAttribute('alt');

            event.clipboardData.setData('text', self.word);
            ariaLiveAssertive.innerHTML = `Ha copiado ${self.word}, ahora con que elemento debería relacionarlo ?, será llevado al apartado en donde están las diferentes opciones para pegar su selección.`;
            setTimeout(function() {
                //pregunta si el actual elemento tiene la clase js- drag para evitar hacer un focus inesperado en caso de que el usuario ya se encuentre en el drop
                if (document.activeElement.classList.contains('js-drag')) {
                    self.context.querySelector('.dataDropFocus').focus();
                }
            }, 5000);
        }
    },
    confirmPaste: (e) => {
        let dropItem = document.activeElement;
        if (
            self.html_copy != undefined &&
            dropItem.classList.contains('js-drop') &&
            self.html_copy.classList.contains('js-drag')
        ) {
            ariaLiveAssertive.innerHTML =
                '¿Está seguro de que desea pegar ' +
                self.word +
                ' en la opción ' +
                dropItem.getAttribute('dropDescription') +
                '?. presione s si lo desea de lo contrario presione n';
            self.bool_paste = true;
        } else {
            ariaLiveAssertive.innerHTML = 'No tiene copiado ningún elemento';
        }
        e.preventDefault();
    },
    paste: (e) => {
        let dropItem = document.activeElement;
        if (e.keyCode == 83 && self.bool_paste) {
            let contentDrags = document.querySelector('#drags');
            if (self.selfWinding) {
                self.autoRate($('#' + self.html_copy.id), $('#' + dropItem.id));
            } else {
                self.onDropping($('#' + self.html_copy.id), $('#' + dropItem.id));
            }
            self.bool_paste = false;
            if (!self.selfWinding) {
                dropItem.setAttribute('aria-label', '');
                self.html_copy.setAttribute(
                    'aria-label',
                    `${dropItem.getAttribute('dropdescription')} Aquí ha pegado ${
                        self.word
                    }`
                );
                ariaLiveAssertive.innerText = 'Ha pegado ' + self.word;
            }
            self.html_copy = undefined;
            if (contentDrags.querySelectorAll('.drag').length === 0) {
                contentDrags.setAttribute(
                    'aria-label',
                    'Todos los elementos han sido asignados'
                );
            }
        }
    },
    onChecking: (elmDrag, elmDrop) => {
        if (self.maxDragsPerDrop == 1) {
            self.arr_answers = '';
        }

        self.arr_answers += ` ${
            elmDrag.getAttribute('alt') == null
                ? elmDrag.innerHTML
                : elmDrag.getAttribute('alt')
        }`;
        if (elmDrop.getAttribute('data') == elmDrag.getAttribute('data')) {
            self.arr_answers += ` es correcto.  ${elmDrop.getAttribute(
                'dropdescription'
            )} `;
            elmDrag.classList.remove('mal', 'icon-u-wrong');
            elmDrag.classList.add('bien', 'icon-u-good');
            elmDrop.setAttribute('aria-label', self.arr_answers);
            if (elmDrop.getAttribute('data-contact') == 'true') {
                elmDrop.classList.remove('mal');
                elmDrop.classList.add('bien');
                ariaLivePolite.innerHTML = ` es correcto.  ${elmDrop.getAttribute(
                    'dropdescription'
                )} `;
                self.autoFeedBack = true;
                return false;
            } else {
                return true;
            }
        } else {
            self.arr_answers += ` es incorrecto. ${elmDrop.getAttribute(
                'dropdescription'
            )}`;
            elmDrag.classList.remove('bien', 'icon-u-good');
            elmDrag.classList.add('mal', 'icon-u-wrong');
            if (!self.selfWinding) {
                elmDrop.setAttribute('aria-label', self.arr_answers);
            } else {
                if (elmDrop.getAttribute('data-contact') == 'true') {
                    elmDrop.classList.remove('bien');
                    elmDrop.classList.add('mal');
                    ariaLivePolite.innerHTML = ` es incorrecto. ${elmDrop.getAttribute(
                        'dropdescription'
                    )}`;
                    self.autoFeedBack = false;
                } else {
                    ariaLivePolite.innerHTML =
                        'Incorrecto!, este elemento no ha sido pegado, intente con otra opción.';
                    setTimeout(() => {
                        elmDrag.classList.remove('mal', 'icon-u-wrong');
                    }, 1000);
                }
            }
            return false;
        }
    },

    checkAnswer: () => {
        let arr_drops = [...self.context.querySelectorAll('.drop')];
        let count = 0;
        self.arr_answers = '';
        arr_drops.forEach(function(elm) {
            elm.childNodes.forEach(function(elementDrag) {
                self.onChecking(elementDrag, elm) && count++;
            });
            self.arr_answers = '';
        });
        return self.onFeedBack(arr_drops.length == count);
    },
    clean: () => {
        let parent = self.context.parentElement;
        self.context.parentElement.innerHTML = '';
        parent.appendChild(self.originalContain);
        document.removeEventListener('copy', self.copy);
        document.removeEventListener('paste', self.confirmPaste);
        document.removeEventListener('keyup', (e) => self.paste(e));
        fullDragDrop.initialize(
            self.context_selector,
            self.maxDragsPerDrop,
            self.isFeedback,
            self.selfWinding,
            self.cloneDrag
        );
        ariaLiveAssertive.innerHTML = 'Ha limpiado el juego';
    },
    initialize: (
        container,
        maxDragsPerDrop,
        isFeedback = false,
        selfWinding = false,
        cloneDrag = false
    ) => {
        self = fullDragDrop;
        self.context_selector = container;
        self.context = document.querySelector(container);
        self.originalContain = self.context.cloneNode(true);
        self.maxDragsPerDrop = maxDragsPerDrop;
        self.selfWinding = selfWinding;
        self.isFeedback = isFeedback;
        self.cloneDrag = cloneDrag;

        $(function() {
            if (self.cloneDrag) {
                $(container + ' .cloneable').draggable({ revert: true, helper: 'clone' });
                $(container + ' .js-drag').draggable({ revert: 'invalid' });
            } else {
                $(container + ' .js-drag').draggable(
                    { revert: 'invalid' }
                    //{ disabled: true }
                );
            }

            $(container + ' .js-drop').droppable({
                drop: function(event, ui) {
                    if (self.selfWinding) {
                        self.autoRate(ui.draggable, $(this));
                    } else {
                        self.onDropping(ui.draggable, $(this));
                    }
                },
            });
        });

        document.addEventListener('copy', self.copy);
        document.addEventListener('paste', self.confirmPaste);
        document.addEventListener('keyup', (e) => self.paste(e));
        self.context.addEventListener('keyup', (e) => self.instructions(e));
    },
    initPuzzle: () => {
        $(function() {
            $('.js-drag').draggable({
                revert: 'invalid',
            });
            $(' .js-drop').droppable({
                drop: function(event, ui) {
                    $(this).droppable({ disabled: true });
                    if (ui.draggable.parent().hasClass('js-drop')) {
                        ui.draggable.parent().droppable({ disabled: false });
                    }
                    $(this).append(ui.draggable);
                },
            });
        });
    },
    instructions: (e) => {
        let instruction = self.context.querySelector('.c-jaws');
        if (e.shiftKey && e.key.toUpperCase() == 'A') {
            ariaLiveAssertive.innerHTML = instruction.innerHTML;
        }
    },
};
