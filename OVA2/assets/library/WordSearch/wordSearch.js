function fn_gameWordSearch(
    modalCongrats,
    PuzzleContent_id,
    arrWords,
    numberCellsExedent
) {
    // 	============================================
    var arrClues =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    function tempAttr(e) {
        return "puzzle-word-space='" + e + "'";
    }
    function getSpaceFromArray(arrFoo) {
        return arrFoo
            .split(' ')
            .join('')
            .split('')
            .join('');
    }
    function getwhiteItemFromArray(arrFoo) {
        return arrFoo.split(' ').join('');
    }
    // 	============================================
    var id_PuzzleContent = PuzzleContent_id + '_content';
    var id_tableAnswers = PuzzleContent_id + '_answers';
    var id_tablePuzzle = PuzzleContent_id + '_puzzle';
    var id_tablePuzzleCell = PuzzleContent_id + '_cell_';
    let context = document.getElementById(PuzzleContent_id);

    // 	============================================
    // Variables
    var trace = console.log.bind(console); // apply() - call()
    var wordList = arrWords.map(function(word) {
        return getwhiteItemFromArray(word);
    });

    var wordListWithSpace = arrWords;
    // trace(wordList)
    // trace(wordListWithSpace)
    var alphabet = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'ñ',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
    ];
    var answeredList = [];
    var rand1 = 0;
    var rand2 = 0;
    var wLength = 0;
    var writable = false;
    var totalWordLength = 0;
    var maxWordLength = 0;
    // var timer = "00:00.00";
    var tick = 0;
    // var timerStarted = false;
    var allAnswered = false;
    let arrAttributesByBtn; // [puzzle-span]
    let isChoosing = false; //se activa cuando el usuario acaba de seleccionar una letra por teclado;
    let selectableLetters = []; //guarda las letras que pueden ser seleccionadoas por teclado según la letra actual
    let objLetters = {
        lettersLeft: [], //almacena el indice de todas las letras que estan sobre el borde izquierdo
        lettersRight: [],
    };

    function sizeSort(a, b) {
        if (a.length > b.length) {
            return 1;
        } else if (a.length == b.length) {
            return 0;
        } else {
            return -1;
        }
    }

    // wordList.sort(sizeSort);
    // wordListWithSpace.sort(sizeSort);

    // Pass width + height and it returns a 2D Array
    function create2dArray(width, height) {
        var x = new Array(height);
        for (var i = 0; i < height; i++) {
            x[i] = new Array(width);
        }
        return x;
    }

    //Find the length of the longest word
    for (var i = 0; i < wordList.length; i++) {
        if (wordList[i].length > maxWordLength) {
            maxWordLength = wordList[i].length;
        }
        totalWordLength += wordList[i].length;
    }

    var dimensions = Math.ceil(Math.sqrt(totalWordLength)) + numberCellsExedent;

    if (dimensions < maxWordLength) {
        dimensions = maxWordLength + 5;
    }

    var wordSearch = create2dArray(dimensions, dimensions);

    // Add a Horizontal Word to the array.
    function addH(word, array) {
        wLength = word.length;
        rand1 = Math.floor(Math.random() * wordSearch.length);
        rand2 = Math.floor(Math.random() * (wordSearch.length - wLength));

        if (rand1 < 0) {
            rand1 = 0;
        }
        if (rand2 < 0) {
            rand2 = 0;
        }
        if (rand2 + wLength <= array[rand1].length) {
            for (var n = 0; n < wLength; n++) {
                if (
                    typeof array[rand1][rand2 + n] == 'undefined' ||
                    array[rand1][rand2 + n] === null ||
                    array[rand1][rand2 + n] == word.charAt(n)
                ) {
                    writable = true;
                } else {
                    writable = false;
                    break;
                }
            }
        }

        if (writable && rand2 + wLength <= array[rand1].length) {
            for (var i = 0; i < wLength; i++) {
                array[rand1][rand2 + i] = word.charAt(i);
            }
            return true;
        } else {
            return false;
        }
    }

    function addV(word, array) {
        wLength = word.length;
        rand1 = Math.floor(Math.random() * (wordSearch.length - wLength));
        rand2 = Math.floor(Math.random() * wordSearch.length);

        if (rand1 < 0) {
            rand1 = 0;
        }
        if (rand2 < 0) {
            rand2 = 0;
        }
        if (rand1 + wLength <= array.length) {
            for (var n = 0; n < wLength; n++) {
                if (
                    typeof array[rand1 + n][rand2] == 'undefined' ||
                    array[rand1 + n][rand2] === null ||
                    array[rand1 + n][rand2] == word.charAt(n)
                ) {
                    writable = true;
                } else {
                    writable = false;
                    break;
                }
            }
        }

        if (writable && rand1 + wLength <= array.length) {
            for (var i = 0; i < wLength; i++) {
                array[rand1 + i][rand2] = word.charAt(i);
            }
            return true;
        } else {
            return false;
        }
    }

    function addD(word, array) {
        wLength = word.length;
        rand1 = Math.floor(Math.random() * (wordSearch.length - wLength));
        rand2 = Math.floor(Math.random() * (wordSearch.length - wLength));

        if (rand1 < 0) {
            rand1 = 0;
        }
        if (rand2 < 0) {
            rand2 = 0;
        }
        if (rand1 + wLength <= array.length && rand2 + wLength <= array[rand1].length) {
            for (var n = 0; n < wLength; n++) {
                if (
                    typeof array[rand1 + n][rand2 + n] == 'undefined' ||
                    array[rand1 + n][rand2 + n] === null ||
                    array[rand1 + n][rand2 + n] == word.charAt(n)
                ) {
                    writable = true;
                } else {
                    writable = false;
                    break;
                }
            }
        }

        if (
            writable &&
            rand1 + wLength <= array.length &&
            rand2 + wLength <= array.length
        ) {
            for (var i = 0; i < wLength; i++) {
                array[rand1 + i][rand2 + i] = word.charAt(i);
            }
            return true;
        } else {
            return false;
        }
    }

    function selectDirection(word, array) {
        var status = false;
        for (var i = 0; i < 1000; i++) {
            status = false;
            if (Math.floor(Math.random() * 3) + 1 == 1) {
                status = addH(word, array);
            } else if (Math.floor(Math.random() * 3) + 1 == 2) {
                status = addV(word, array);
            } else {
                status = addV(word, array);
            }
            if (status) {
                break;
            }
        }
        if (!status) {
            selectDirection(word, array);
            wordList.splice(wordList.indexOf(word), 1);
        }
    }

    for (var l = wordList.length - 1; l >= 0; l--) {
        wordList[l] = wordList[l].toUpperCase();
        selectDirection(wordList[l], wordSearch);
    }

    // OUTPUT
    let defineIndexBtn = 0;
    function render() {
        var output = '';
        output += "<div class='PuzzleContent' id='" + id_PuzzleContent + "'>";

        output += "<div class='PuzzleContent__row'>";

        output += "<div class='PuzzleContent__cell'>";

        output += "<div class='tablePuzzle' id='" + id_tablePuzzle + "'>";

        for (var j = 0; j < wordSearch.length; j++) {
            if (wordSearch[j] == ' ' || wordSearch[j] == '' || wordSearch[j] == '  ') {
                continue;
            }
            objLetters.lettersLeft.push(defineIndexBtn);
            objLetters.lettersRight.push(defineIndexBtn + dimensions - 1);
            output += "<div class='tablePuzzle__row'>";
            for (var k = 0; k < wordSearch[j].length; k++) {
                // console.log(k);

                if (typeof wordSearch[j][k] != 'undefined') {
                    if (k != wordSearch[j].length - 1) {
                        output +=
                            "<div  class='tablePuzzle__cell " +
                            id_tablePuzzleCell +
                            j +
                            '-' +
                            k +
                            "'><span id='" +
                            j +
                            '-' +
                            k +
                            "'  puzzle-span='" +
                            defineIndexBtn +
                            "'  tabindex='0' aria-label='Fila " +
                            (j + 1) +
                            ', Columna ' +
                            (k + 1) +
                            ', Letra ' +
                            wordSearch[j][k] +
                            ".'>" +
                            wordSearch[j][k] +
                            '</span></div>';
                    } else {
                        output +=
                            "<div class='tablePuzzle__cell  " +
                            id_tablePuzzleCell +
                            j +
                            '-' +
                            k +
                            "'><span id='" +
                            j +
                            '-' +
                            k +
                            "'  puzzle-span='" +
                            defineIndexBtn +
                            "' tabindex='0' aria-label='Fila " +
                            (j + 1) +
                            ', Columna ' +
                            (k + 1) +
                            ', Letra ' +
                            wordSearch[j][k] +
                            ".'>" +
                            wordSearch[j][k] +
                            '</span></div>';
                        output += '</div>';
                    }
                } else {
                    if (k != wordSearch[j].length - 1) {
                        wordSearch[j][k] = alphabet[
                            Math.floor(Math.random() * alphabet.length)
                        ].toUpperCase();
                        output +=
                            "<div class='tablePuzzle__cell " +
                            id_tablePuzzleCell +
                            j +
                            '-' +
                            k +
                            "'><span id='" +
                            j +
                            '-' +
                            k +
                            "'  puzzle-span='" +
                            defineIndexBtn +
                            "' tabindex='0' aria-label='Fila " +
                            (j + 1) +
                            ', Columna ' +
                            (k + 1) +
                            ', Letra ' +
                            wordSearch[j][k] +
                            ".'>" +
                            wordSearch[j][k] +
                            '</span></div>';
                    } else {
                        wordSearch[j][k] = alphabet[
                            Math.floor(Math.random() * alphabet.length)
                        ].toUpperCase();
                        output +=
                            "<div class=' tablePuzzle__cell " +
                            id_tablePuzzleCell +
                            j +
                            '-' +
                            k +
                            "'><span  id='" +
                            j +
                            '-' +
                            k +
                            "'  puzzle-span='" +
                            defineIndexBtn +
                            "' tabindex='0' aria-label='Fila " +
                            (j + 1) +
                            ', Columna ' +
                            (k + 1) +
                            ', Letra ' +
                            wordSearch[j][k] +
                            ".'>" +
                            wordSearch[j][k] +
                            '</span></div>';
                        output += '</div>';
                    }
                }
                defineIndexBtn++;
            }
        }

        output += '</div>';

        output += '</div>';

        output += "<div class='PuzzleContent__cell'>";

        output +=
            "<div class='tableAnswers' id='" + id_tableAnswers + "' class='anscss'>";
        for (var i = 0; i < wordList.length; i++) {
            // if (wordList[i] == ' ' || wordList[i] == '' || wordList[i] == '  ') { continue }
            // trace((arrClues != false) ? tempAttr(arrClues[i]) : tempAttr(wordListWithSpace[i]))
            if (i % 2 === 0) {
                if (arrClues != false) {
                    output +=
                        "<div class='answers' tabindex='0' puzzle-word-space='" +
                        arrClues[i] +
                        "'>";
                } else {
                    output +=
                        "<div class='answers' tabindex='0' puzzle-word-space='" +
                        wordListWithSpace[i] +
                        "'>";
                }
                output += '<span>' + wordList[i] + '</span>';
                output += '</div>';
            } else {
                if (arrClues != false) {
                    output +=
                        "<div class='answers' tabindex='0' puzzle-word-space='" +
                        arrClues[i] +
                        "'>";
                } else {
                    output +=
                        "<div class='answers' tabindex='0' puzzle-word-space='" +
                        wordListWithSpace[i] +
                        "'>";
                }
                output += '<span>' + wordList[i] + '</span>';
                output += '</div>';
            }
        }
        output += '</div>';

        output += '</div>';

        output += '</div>';

        output += '</div>';
        output +=
            '<p id="info" class="c-jaws"> Dimensiones: ' +
            dimensions +
            ' de alto por ' +
            dimensions +
            ' de ancho. ' +
            'Para seleccionar una letra pulse enter. Para deseleccionar o validar si formó la palabra correcta pulse control Q. Para conoceer las palabras a buscar y repetir esta información pulse shift, más, A. Pulse tab para entrar al juego y desplácese con las flechas. Para salir del juego presione las teclas SHIFT, más, E.</p>';
        // Inset output on PuzzleContent_id
        document.getElementById(PuzzleContent_id).innerHTML = output;
        // Get all spans on id_PuzzleContent by puzzle-span attribute
        arrAttributesByBtn = document.querySelectorAll(
            `#${id_PuzzleContent} [puzzle-span]`
        );
    }

    document.addEventListener('keyup', function(e) {
        const keyCode = e.keyCode;
        const btnIndex = parseInt(e.target.getAttribute(`puzzle-span`));
        const limitMaxOnY = defineIndexBtn - dimensions;
        const limitMinOnY = dimensions - 1;

        if (!isChoosing) {
            if (keyCode == 40 && btnIndex < limitMaxOnY) {
                arrAttributesByBtn[btnIndex + dimensions].focus();
            } else if (keyCode == 38 && btnIndex > limitMinOnY) {
                arrAttributesByBtn[btnIndex - dimensions].focus();
            } else if (keyCode == 39 && btnIndex < defineIndexBtn - 1) {
                arrAttributesByBtn[btnIndex + 1].focus();
            } else if (keyCode == 37 && btnIndex > 0) {
                arrAttributesByBtn[btnIndex - 1].focus();
            }
        } else {
            if (
                keyCode == 40 &&
                btnIndex < limitMaxOnY &&
                selectableLetters.includes(arrAttributesByBtn[btnIndex + dimensions])
            ) {
                arrAttributesByBtn[btnIndex + dimensions].focus();
            } else if (
                keyCode == 38 &&
                btnIndex > limitMinOnY &&
                selectableLetters.includes(arrAttributesByBtn[btnIndex - dimensions])
            ) {
                arrAttributesByBtn[btnIndex - dimensions].focus();
            } else if (
                keyCode == 39 &&
                btnIndex < defineIndexBtn &&
                selectableLetters.includes(arrAttributesByBtn[btnIndex + 1])
            ) {
                arrAttributesByBtn[btnIndex + 1].focus();
            } else if (
                keyCode == 37 &&
                btnIndex > 0 &&
                selectableLetters.includes(arrAttributesByBtn[btnIndex - 1])
            ) {
                arrAttributesByBtn[btnIndex - 1].focus();
            }
        }
    });
    function main() {
        var colors = [
            '#FF6633',
            '#FFB399',
            '#854385',
            '#d3d386',
            '#029bc5',
            '#E6B333',
            '#3366E6',
            '#999966',
            '#99FF99',
            '#B34D4D',
            '#80B300',
            '#809900',
            '#E6B3B3',
            '#6680B3',
            '#66991A',
            '#c76cb0',
            '#b1db17',
            '#FF1A66',
            '#E6331A',
            '#32c49f',
            '#66994D',
            '#B366CC',
            '#4D8000',
            '#B33300',
            '#CC80CC',
            '#66664D',
            '#991AFF',
            '#E666FF',
            '#4DB3FF',
            '#1AB399',
            '#E666B3',
            '#33991A',
            '#CC9999',
            '#B3B31A',
            '#05c06c',
            '#4D8066',
            '#809980',
            '#FFB300',
            '#23c536',
            '#999933',
            '#FF3380',
            '#CCCC00',
            '#6fc25e',
            '#4D80CC',
            '#9900B3',
            '#E64D66',
            '#4DB380',
            '#FF4D4D',
            '#6ea8a8',
            '#6666FF',
        ];
        let selectedArray = [];
        let compareString = '';
        let reversedString = '';
        let comparison = false;
        let isMouseDown = false;
        let isKeyDown = false;
        let prevID = 0;
        let touch = 0;

        $('#' + id_PuzzleContent + ' #' + id_tableAnswers + ' div span').each(function(
            i
        ) {
            if (!$(this).hasClass('correct')) {
                allAnswered = false;
                return false;
            } else {
                allAnswered = true;
            }
        });
        $('#' + id_PuzzleContent + ' #' + id_tablePuzzle + ' div span').bind(
            'mousedown touchstart keydown',
            function(event) {
                // if (!allAnswered) { timerStarted = true; }
                const eventType = event.type;
                const keyCode = event.keyCode;
                prevID = $(this).attr('id');

                function selectLetter(targetBtn) {
                    if (!targetBtn.hasClass('highlighted')) {
                        selectedArray.push(targetBtn.text());
                        targetBtn.addClass('highlighted');
                    }
                }

                isMouseDown = eventType == 'mousedown' || eventType == 'touchstart';
                isKeyDown = eventType == 'keydown';

                isMouseDown && selectLetter($(this));
                if (event.keyCode == 9 && isChoosing) {
                    event.preventDefault();
                }
                //guardo las letras que pueden ser seleccionadas por el usuario

                if (isKeyDown && keyCode == 13) {
                    const btnIndex = parseInt(event.target.getAttribute(`puzzle-span`));

                    selectableLetters = [];
                    isChoosing = true;

                    selectableLetters.push(arrAttributesByBtn[btnIndex]);
                    if (
                        !objLetters.lettersLeft.includes(
                            parseInt(event.target.getAttribute('puzzle-span'))
                        )
                    ) {
                        selectableLetters.push(arrAttributesByBtn[btnIndex - 1]);
                        selectableLetters.push(
                            arrAttributesByBtn[btnIndex + dimensions - 1]
                        );
                        selectableLetters.push(
                            arrAttributesByBtn[btnIndex - dimensions - 1]
                        );
                    }
                    if (
                        !objLetters.lettersRight.includes(
                            parseInt(event.target.getAttribute('puzzle-span'))
                        )
                    ) {
                        selectableLetters.push(arrAttributesByBtn[btnIndex + 1]);
                        selectableLetters.push(
                            arrAttributesByBtn[btnIndex + dimensions + 1]
                        );
                        selectableLetters.push(
                            arrAttributesByBtn[btnIndex - dimensions + 1]
                        );
                    }
                    selectableLetters.push(arrAttributesByBtn[btnIndex - dimensions]);
                    selectableLetters.push(arrAttributesByBtn[btnIndex + dimensions]);

                    selectLetter($(this));
                    let arr_letters = document.querySelectorAll('.highlighted');
                    let word_created = '';
                    arr_letters.forEach(function(letter) {
                        word_created += letter.innerText;
                    });
                    ariaLivePolite.innerText =
                        'Ha seleccionado la letra ' +
                        event.target.innerText +
                        '. La palabra formada es ' +
                        word_created;
                }
            }
        );
        /*--------*/
        $('#' + id_PuzzleContent + ' #' + id_tablePuzzle + ' span')
            .bind('mousemove touchmove', function(e) {
                var addedToArray;
                e.preventDefault();
                if ($(this).attr('id') != prevID) {
                    addedToArray = false;
                }
                if (isMouseDown) {
                    if (e.originalEvent.touches || e.originalEvent.changedTouches) {
                        touch =
                            e.originalEvent.touches[0] ||
                            e.originalEvent.changedTouches[0];
                    } else {
                        touch = e;
                    }
                    for (var q = 0; q < dimensions; q++) {
                        for (var a = 0; a < dimensions; a++) {
                            var offset = $('#' + q + '-' + a).offset();
                            var x = touch.pageX - offset.left;
                            var y = touch.pageY - offset.top;

                            if (
                                x < $('#' + q + '-' + a).outerWidth() - 4 &&
                                x > 4 &&
                                y < $('#' + q + '-' + a).outerHeight() - 4 &&
                                y > 2 &&
                                !addedToArray &&
                                !$('#' + q + '-' + a).hasClass('highlighted')
                            ) {
                                //trace('x: ' + x + ' y: ' + y);
                                addedToArray = true;
                                selectedArray.push($('#' + q + '-' + a).text());
                                prevID = $('#' + q + '-' + a).attr('id');
                                $('#' + q + '-' + a).addClass('highlighted');
                                break;
                            }
                        }
                    }
                }
            })
            .bind('selectstart', function(e) {
                return false; // prevent text selection in IE
            });
        /*--------*/
        function validatePuzzle(event) {
            const eventType = event.type;
            const keyCode = event.keyCode;

            function validateByEvent() {
                isMouseDown = !(eventType == 'mouseup' || eventType == 'touchend');
                isKeyDown = eventType == 'keydown' && keyCode == 13;
                if (selectedArray.length > 0) {
                    prevID = 0;
                    comparison = false;
                    compareString = '';
                    reversedString = '';
                    for (var i = 0; i < selectedArray.length; i++) {
                        compareString = compareString.concat(selectedArray[i]);
                    }
                    for (var j = 0; j < wordList.length; j++) {
                        var color_random =
                            colors[Math.floor(Math.random() * colors.length)];

                        if (compareString == wordList[j]) {
                            answeredList.push(wordList[j]);
                            comparison = true;
                            $(
                                '#' +
                                    id_PuzzleContent +
                                    ' .tablePuzzle__row div span.highlighted'
                            ).each(function(i) {
                                if (!$(this).hasClass('correct')) {
                                    $(this).removeClass('highlighted');
                                    $(this).addClass('correct');
                                    $(this).css('background-color', color_random);
                                }
                            });
                            $(
                                '#' +
                                    id_PuzzleContent +
                                    ' #' +
                                    id_tableAnswers +
                                    ' .answers'
                            ).each(function(i) {
                                if (
                                    $(this).text() == compareString &&
                                    !$(this).hasClass('correct')
                                ) {
                                    $(this).removeClass('answers');
                                    $(this).addClass('correct');
                                    $(this).addClass('checkWord');
                                    $(this).css('background-color', color_random);
                                    $(this).attr(
                                        'aria-label',
                                        ' ya encontró la palabra ' + compareString
                                    );

                                    ariaLivePolite.innerText =
                                        'Muy bien, ha encontrado la palabra ' +
                                        compareString;
                                    if (
                                        context.querySelectorAll('.checkWord').length ==
                                        arrWords.length
                                    ) {
                                        //ariaLivePolite.innerHTML += '. Encontraste todas las palabras';
                                        modalCongrats.open();
                                    }
                                    return false;
                                }
                            });
                            break;
                        } else {
                            ariaLivePolite.innerText =
                                'La palabra ' + compareString + ' es incorrecta';
                        }
                        reversedString = compareString
                            .split('')
                            .reverse()
                            .join('');

                        if (reversedString == wordList[j]) {
                            answeredList.push(wordList[j]);
                            comparison = true;
                            $(
                                '#' +
                                    id_PuzzleContent +
                                    ' #' +
                                    id_PuzzleContent +
                                    ' .tablePuzzle__row div span.highlighted'
                            ).each(function(i) {
                                if (!$(this).hasClass('correct')) {
                                    $(this).removeClass('highlighted');
                                    $(this).addClass('correct');
                                    $(this).css('background-color', color_random);
                                }
                            });
                            $(
                                '#' +
                                    id_PuzzleContent +
                                    ' #' +
                                    id_PuzzleContent +
                                    ' #' +
                                    id_tableAnswers +
                                    ' .answers'
                            ).each(function(i) {
                                if (
                                    $(this).text() == reversedString &&
                                    !$(this).hasClass('correct')
                                ) {
                                    $(this).removeClass('answers');
                                    $(this).addClass('correct');
                                    $(this).css('background-color', color_random);
                                    return false;
                                }
                            });
                            break;
                        }
                    }
                    $(
                        '#' + id_PuzzleContent + ' .tablePuzzle__row div span.highlighted'
                    ).each(function(i) {
                        $(this).removeClass('highlighted');
                    });
                    for (var k = selectedArray.length - 1; k >= 0; k--) {
                        selectedArray.splice(k, 1);
                    }
                }
            }

            isMouseDown = eventType == 'mouseup' || eventType == 'touchend';
            isKeyDown = eventType == 'keyup';

            isMouseDown && validateByEvent();

            if (isKeyDown && event.ctrlKey && keyCode == 81) {
                isChoosing = false;
                selectableLetters = [];
                validateByEvent();
            }
        }
        function tellWords(event) {
            event.preventDefault();
            if (event.shiftKey && event.keyCode == 65) {
                let live = 'Instrucciones activadas: Las palabras que debe buscar son: ';
                let arr_goods = document.querySelectorAll('.correct.checkWord');

                arrWords.forEach((word_sp) => {
                    live += word_sp + ', ';
                });
                if (arr_goods.length == 0) {
                    live += '. Aún no ha encontrado ninguna palabra ';
                } else {
                    live += '. Las palabras que ha encontrado son: ';
                }
                document.querySelectorAll('.correct.checkWord').forEach((correctWord) => {
                    live += correctWord.innerText + ',';
                });
                live += '. Recuerde la siguiente información: ' + info.innerText;
                ariaLiveAssertive.innerText = live;
            } else if (event.shiftKey && event.keyCode == 69) {
                document.querySelector('.c-btn_next').focus();
                ariaLiveAssertive.innerText =
                    'Ha activado el comando para salir de la sopa de letras, ahora esta en el botón de página siguiente.';
            }
        }
        /*--------*/
        $(document).bind('mouseup touchend', validatePuzzle);
        $(document).bind('keyup', validatePuzzle);
        $(document).bind('keyup', tellWords, event);
    }

    render();
    main();

    $('.tablePuzzle__cell').css({
        width: 100 / dimensions + '%',
        paddingTop: 100 / dimensions + '%',
    });

    function instructions() {
        let contex = document.querySelector('#game_wordSearch'),
            message;

        message =
            'Esta es una actividad de sopa de letras, para ingresar a la actividad presione la tecla tabulación, una vez en la actividad podrá ejecutar los siguientes comandos: Para escuchar las instrucciones, presione las teclas: shift, más, a. Para salir de la actividad presione las teclas: shift, más, e.';

        contex.setAttribute('aria-label', message);
        contex.setAttribute('tabindex', '0');
    }
    instructions();
}
