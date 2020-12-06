let self_cg = null;
const cloneImg_general = {
    waitImg: null,
    assign_image: (e, waitImg) => {
        let imgElement = e.target.querySelector('.c-gallery-image');

        cloneImg_general.waitImg = waitImg;
        //waitImg es el elemnto q esta en espera por imagen

        if (imgElement.nodeName === 'IMG') {
            waitImg.setAttribute(
                'aria-label',
                waitImg.parentElement.getAttribute('texto') + '. ' + imgElement.alt
            );

            ova.addAttributes(waitImg, {
                src: `${imgElement.getAttribute('src')}`,
                'xlink:href': `${imgElement.getAttribute('src')}`,
                imgRecibida: `${imgElement.getAttribute('img-pareja')}`,
                alt: imgElement.alt,
            });
            waitImg = '';

            ariaLivePolite.innerHTML = 'ha elegido ' + imgElement.alt;
        } else if (imgElement.nodeName === 'P') {
            let textSelected;

            imgElement.dataset.value
                ? (textSelected = e.target.querySelector('.c-gallery-image').dataset
                      .value)
                : (textSelected = e.target.querySelector('.c-gallery-image').innerText);

            waitImg.setAttribute(
                'aria-label',
                waitImg.getAttribute('texto') + ' ' + textSelected
            );

            ova.addAttributes(waitImg, {
                phraseReceived: `${imgElement.getAttribute('phrasePartner')}`,
            });
            waitImg.textContent = textSelected;
            ariaLivePolite.innerHTML = 'ha elegido ' + textSelected;
        }
    },
    validate_image: (elm_li) => {
        let textImg = elm_li.querySelector('.imgClass'); // image
        let imgEsperada = textImg.getAttribute('imgesperada');
        let imgRecibida = textImg.getAttribute('imgRecibida');
        textImg.setAttribute('aria-labelledby', '');
        if (
            ova.checkActivity(elm_li, imgEsperada == imgRecibida, 'is-good', 'is-wrong')
        ) {
            textImg.setAttribute(
                'aria-label',
                'Respuesta correcta. ' +
                    elm_li.getAttribute('texto') +
                    '. ' +
                    textImg.getAttribute('alt')
            );
            return true;
        } else {
            textImg.setAttribute(
                'aria-label',
                'Respuesta incorrecta. ' +
                    elm_li.getAttribute('texto') +
                    '. ' +
                    textImg.getAttribute('alt')
            );
            return false;
        }
    },
    validate_text: (elm_li) => {
        let phraseExpected = elm_li.getAttribute('phraseExpected');
        let phraseReceived = elm_li.getAttribute('phraseReceived');

        if (
            ova.checkActivity(
                elm_li,
                phraseExpected == phraseReceived,
                'is-good',
                'is-wrong'
            )
        ) {
            elm_li.setAttribute(
                'aria-label',
                ` ${elm_li.getAttribute('texto')} ${
                    elm_li.textContent
                }.Respuesta correcta.`
            );

            return true;
        } else {
            elm_li.setAttribute(
                'aria-label',
                `${elm_li.getAttribute('texto')} ${
                    elm_li.textContent
                }. Respuesta incorrecta.`
            );
            return false;
        }
    },
    clean: (list_contentImg) => {
        list_contentImg.forEach((element) => {
            element.classList.remove('is-good', 'is-wrong');
            console.log('TCL: element', element);
            ova.addAttributes(element.firstElementChild, {
                src: ``,
                imgRecibida: '',
                alt: '',
                'aria-label': element.getAttribute('texto'),
            });
        });
        ariaLivePolite.innerHTML = 'Ha limpiado el juego';
    },
    cleanText: (list_contentImg) => {
        list_contentImg.forEach((element) => {
            element.classList.remove('is-good', 'is-wrong');
            ova.addAttributes(element, {
                phraseReceived: '',
                'aria-label': element.getAttribute('texto'),
            });

            element.textContent = '';
        });
        ariaLivePolite.innerHTML = 'Ha limpiado el juego';
    },
    initialize: (contentScope, modalScope) => {
        let waitImg;
        contentScope.querySelectorAll('.imgClass').forEach((elm, index) => {
            elm.addEventListener('click', (e) => {
                waitImg = e.target;
            });
            elm.addEventListener('keyup', (e) => {
                if (e.keyCode == 13) {
                    waitImg = e.target;
                    e.target.click();
                }
            });
        });
        modalScope.querySelectorAll('li').forEach((elm, index) => {
            elm.addEventListener('click', (e) => {
                cloneImg_general.assign_image(e, waitImg);
            });
            elm.addEventListener('keyup', (e) => {
                if (e.keyCode == 13) {
                    e.target.click();
                }
            });
        });
        contentScope.addEventListener('keyup', function() {
            if (event.shiftKey && event.keyCode == 65) {
                ariaLivePolite.innerText = contentScope.querySelector(
                    '.c-jaws'
                ).innerText;
            }
        });
    },
};
