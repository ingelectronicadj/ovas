const clasic_cloneImg = {
    contentScope: null,
    modalScope: null,
    resetElm: null,
    validateElm: null,
    list_contentImg: null,
    check: () => {
        let wrongBool = false;
        clasic_cloneImg.list_contentImg.forEach((element) => {
            if (!cloneImg_general.validate_image(element)) {
                wrongBool = true;
            }
        });
        if (wrongBool) {
            ariaLivePolite.innerHTML =
                'Algunas respuestas son erróneas. con tab shift puede devolverse y verificar las respuestas incorrectas y correctas';
        } else {
            ariaLivePolite.innerHTML = 'Muy bien. Ha contestado correctamente.';
        }
        return !wrongBool;
    },
    checkText: () => {
        let wrongBool = false;

        clasic_cloneImg.list_contentImg.forEach((element) => {
            if (!cloneImg_general.validate_text(element)) {
                wrongBool = true;
            }
        });
        if (wrongBool) {
            ariaLivePolite.innerHTML = 'Algunas respuestas son erróneas.';
        } else {
            ariaLivePolite.innerHTML = 'Muy bien. Ha contestado correctamente.';
        }
        return !wrongBool;
    },
    initialize: (contentScope, modalScope, resetElm, validateElm) => {
        clasic_cloneImg.contentScope = document.querySelector(contentScope);
        clasic_cloneImg.modalScope = document.querySelector(modalScope);
        clasic_cloneImg.resetElm = document.querySelector(resetElm);
        clasic_cloneImg.validateElm = document.querySelector(validateElm);

        if (clasic_cloneImg.contentScope.querySelectorAll('.js-waitImage').length > 0) {
            clasic_cloneImg.list_contentImg = clasic_cloneImg.contentScope.querySelectorAll(
                '.js-waitImage'
            );
            cloneImg_general.initialize(
                clasic_cloneImg.contentScope,
                clasic_cloneImg.modalScope
            );

            if (clasic_cloneImg.resetElm != null) {
                if (clasic_cloneImg.contentScope.classList.contains('cloneText')) {
                    clasic_cloneImg.resetElm.addEventListener('click', () =>
                        cloneImg_general.cleanText(clasic_cloneImg.list_contentImg)
                    );
                } else {
                    clasic_cloneImg.resetElm.addEventListener('click', () =>
                        cloneImg_general.clean(clasic_cloneImg.list_contentImg)
                    );
                }
            }
        }
    },
};
