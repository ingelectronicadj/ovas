const flipCard = function (nombreAudio, totalPairs, type) {
    var callback = nombreAudio
        ? { audio: nombreAudio, funcion: window.ova.playAudio }
        : null;
    var typeApp = type ? { type } : 'game';
    let cardCurrent;
    let numGoods = 0;
    let reader = document.getElementById('ariaLivePolite');
    var flip_card = 'flip_card',
        classGood = 'is-good',
        classWrong = 'is-wrong',
        preventClick = 'is-prevDefault';

    $(document).ready(function () {
        $('.flip_card').flip({
            axis: 'y',
            trigger: 'manual',
            reverse: true,
        });
    });

    function flip(card) {
        if (typeApp === 'game') {
            if (card.attr('isFlip') == 'back') {
                if ($('.' + flip_card).hasClass(classGood)) {
                    card.removeClass(classGood);
                }
                if ($('.' + flip_card).hasClass(classWrong)) {
                    card.removeClass(classWrong);
                }
                card.attr('seleccion', 1);
                //if (currentBrowser != 'msie') {
                card.flip(true);
                card.attr('isFlip', 'front');

                reader.innerHTML = cardCurrent
                    .find('.content-card')
                    .get(0)
                    .getAttribute('alt');
                //}
                var contador = $('.' + flip_card + '[seleccion=1]').length;
                if (contador == 2) {
                    if (typeApp === 'game') {
                        checkAnswer();
                    }
                }
            }
        } else {
            card.flip('toggle');
        }
    }

    $('.' + flip_card).click(function () {
        flip($(this));
    });
    $('.' + flip_card).focus(function () {
        cardCurrent = $(this);
    });

    document
        .querySelector('.flip_card-container')
        .addEventListener('keyup', function (event) {
            if (event.keyCode == 13) {
                flip(cardCurrent);
            }
        });

    $('.' + classGood).hide();
    $('.' + classWrong).hide();

    function checkAnswer() {
        var i = 0,
            seleccionadouno = '',
            seleccionadodos = '',
            total = void 0;

        $('.' + flip_card + '[seleccion=1]').each(function (indice, campo) {
            i++;
            if (i == 1) {
                seleccionadouno = $(this).attr('pareja');
            } else if (i == 2) {
                seleccionadodos = $(this).attr('pareja');
            }
        });

        if (seleccionadouno == seleccionadodos) {
            reader.innerHTML += ', la pareja es correcta';
            numGoods++;

            // console.log('Correctas: ', numGoods);

            setTimeout(function () {
                $('.' + flip_card + '[seleccion=2]').addClass(
                    classGood + ' ' + preventClick
                );

                /**
                 * Callback audio notificacion
                 * @service audioNotification
                 */
                if (callback) {
                    callback.funcion(callback.audio);
                }
                //el arailabel se cambia a solucionado para las cartas en verde
                $('.' + classGood).each(function () {
                    $(this).attr(
                        'aria-label',
                        'Solucionado, ' + $(this).find('.content-card').attr('alt')
                    );
                });
                if (numGoods == totalPairs) {
                    reader.innerHTML =
                        'Felicitaciones, ha completado el juego correctamente';
                }
            }, 700);

            $('.' + flip_card + '[seleccion=1]').attr('seleccion', 2);
            total = $('.' + flip_card + '[seleccion=2]').length;

            //$('.js-flipCard').html(total);
        } else {
            reader.innerHTML += ', la pareja es incorrecta';
            $('.' + flip_card + '[seleccion=1]').each(function (indice, campo) {
                $('.' + flip_card + '[seleccion=1]').addClass(classWrong);
                $('.' + flip_card + '[seleccion=1]').attr('seleccion', 0);

                setTimeout(function () {
                    $('.' + flip_card + '[seleccion=0]').flip(false);
                    $('.' + flip_card + '[seleccion=0]').attr('isFlip', 'back');
                    $('.' + flip_card + '[seleccion=0]').css('background', 'tranparent');
                }, 1000);
            });
        }
    }
};
