/*
let object = {
    arrContexts: ['#game_unir_1','#game_unir_2'], //? Arreglo con los id's de los juegos.
    arrContextLineCanvas: ['#linecanvas','#linecanvas2'] //? Arrgelo con los id's  de los divs, se van a dibujar las lineas.
    feedback: true  //? Valida si se deben mostrar feedback , por defecto es false.
}
*/

class JoinColums {
    constructor(object) {
        let { arrContexts, arrContextLineCanvas, feedback = false } = object;
        this.initialize = this.initialize.bind(this);
        this.check = this.check.bind(this);
        this.clickElement = this.clickElement.bind(this);
        this.clear = this.clear.bind(this);
        this.graphics = this.graphics.bind(this);
        this.eventKeyboar = this.eventKeyboar.bind(this);
        this.instructions = this.instructions.bind(this);
        this.arrContexts = arrContexts;
        this.arrContextLineCanvas = arrContextLineCanvas;
        this.feedback = feedback;
        this.currentSlideIndex = 0;
        this.arrValuesActive = [];
        this.accumulationPairs = new Array(this.arrContexts.length).fill(0);
        this.correctPairs = 0;
    }

    initialize() {
        this.contextActive = document.querySelector(
            this.arrContexts[this.currentSlideIndex]
        );

        this.allPairs = this.contextActive.querySelectorAll('.treeItem').length / 2;

        this.getColumns();
        this.executeRandom();
        this.eventKeyboar();
        this.graphics();

        this.contextActive.addEventListener('keyup', this.instructions);
        this.contextActive.addEventListener('click', this.clickElement);
    }

    executeRandom() {
        let stateGame = this.contextActive.dataset.stateGame == 'initiated';
        if (!stateGame) {
            // console.log('no inicio, ejecutar random');
            ova.dom_randomOrganization(this.firstColumn.childNodes);
            ova.dom_randomOrganization(this.secondColumn.childNodes);
        }
    }

    getColumns() {
        this.firstColumn = this.contextActive.querySelector('[data-column = "1"]');
        this.secondColumn = this.contextActive.querySelector('[data-column = "2"]');
        this.firstColumn.childNodes.forEach((element, index) => {
            let secondElement = this.secondColumn.childNodes[index];
            let ariaLabel =
                element.textContent == null
                    ? element.dataset.description
                    : element.textContent;

            element.setAttribute(
                'aria-label',
                `${ariaLabel}. Columna 1, opción: ${index + 1}`
            );

            ariaLabel =
                secondElement.innerHTML == null
                    ? secondElement.dataset.description
                    : secondElement.textContent;

            secondElement.setAttribute(
                'aria-label',
                `${ariaLabel}. Columna 2, opción: ${index + 1}`
            );
        });

        this.btnClean = this.contextActive.querySelector('.btnClean');
        this.btnClean.addEventListener('click', this.clear);
    }

    eventKeyboar() {
        this.allColumnElements = this.contextActive.querySelectorAll('.treeItem');
        this.allColumnElements.forEach((element) => {
            element.addEventListener('keyup', (e) => {
                let activeElement = e.target;
                if (e.keyCode == 13) {
                    if (activeElement.dataset.state != undefined) {
                        if ((activeElement.dataset.state = 'correct')) {
                            ariaLivePolite.innerHTML =
                                'Esta opción ya ha sido asignada, de forma Correcta. Asigne su selección con otra opción';
                        } else {
                            ariaLivePolite.innerHTML =
                                'Esta opción ya ha sido asignada, de forma incorrecta. Asigne su selección con otra opción';
                        }
                    } else {
                        this.clickElement(e);
                        activeElement.dispatchEvent(new Event('click'));
                    }
                }
            });
        });
    }

    instructions() {
        if (event.shiftKey && event.key.toUpperCase() == 'A') {
            ariaLiveAssertive.innerText = `Instrucciones activadas: Relacione los conceptos con su respectivo significado. Este juego consta de dos columnas, cada una con ${
                this.allPairs
            } opciones que puede seleccionar con la tecla: enter y o barra espaciadora según el lector, puede avanzar con la tecla: tabulación y retroceder con las teclas: shift, más, tabulación. Además cuenta con un botón limpiar que le ayudará a reiniciar el juego. (Recuerde, ha relacionado ${
                this.correctPairs == 0
                    ? '0 parejas correctas'
                    : this.correctPairs == 1
                    ? this.correctPairs + ' pareja correta'
                    : this.correctPairs + ' parejas correctas'
            } de ${
                this.allPairs
            }) Para repetir esta información presione las teclas: shift, más, A.`;
        }
    }

    clear() {
        this.contextActive.querySelector(
            this.arrContextLineCanvas[this.currentSlideIndex]
        ).innerHTML = '';
        [].slice.call(this.allColumnElements).map(function (child) {
            child.hasAttribute('style') ? child.removeAttribute('style') : '';
            child.removeAttribute('jsblock');
            child.classList.add('treeItem');
            child.classList.remove('treeItem_hi');
            child.classList.remove('treeItem_set');
            child.removeAttribute('data-state');
            child.removeAttribute('correcta');
        });
        this.oSource = null;
        this.oTarget = null;
        this.contextActive.removeAttribute('data-state-game');
        this.accumulationPairs[this.currentSlideIndex] = 0;
        ariaLivePolite.innerHTML =
            'Opción de limpiar activada: El juego ha sido restablecido.';
    }

    check(activeElement) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let spanValue = activeElement.target.attributes.valor.value;
                let spanId = activeElement.target.attributes.id.value;
                let isGood = 'pending';
                ariaLivePolite.innerText = `Ha seleccionado: ${
                    activeElement.target.textContent == ''
                        ? activeElement.target.dataset.description
                        : activeElement.target.textContent
                }`;

                this.arrValuesActive.push(spanValue);
                this.arrValuesActive.push(spanId);

                if (
                    this.arrValuesActive.length === 4 &&
                    this.arrValuesActive[1] !== this.arrValuesActive[3]
                ) {
                    let itemsSet = this.contextActive.querySelectorAll('.treeItem_set');
                    if (this.arrValuesActive[0] === this.arrValuesActive[2]) {
                        itemsSet.forEach((item) => {
                            item.setAttribute('jsblock', 'jsblock');
                            item.setAttribute('data-state', 'correct');
                            item.setAttribute('correcta', 'bien');
                        });

                        isGood = true;
                        ariaLivePolite.innerHTML = 'Esta relación es Correcta!';
                        this.accumulationPairs[this.currentSlideIndex] += 1;
                    } else {
                        let valOne = this.arrValuesActive[1];
                        valOne = valOne.split('_', 1);
                        valOne = valOne.join(valOne);

                        let valTwo = this.arrValuesActive[3];
                        valTwo = valTwo.split('_', 1);
                        valTwo = valTwo.join(valTwo);

                        if (valOne === valTwo) {
                            ariaLivePolite.innerHTML = `Ha seleccionado dos opciones de la misma columna. Por favor seleccione una opcion de la otra columna, presione la tecla enter para seleccionar: ${activeElement.target.textContent}`;
                        } else {
                            itemsSet.forEach((item) => {
                                item.setAttribute('jsblock', 'jsblock');
                                item.setAttribute('data-state', 'incorrect');
                                item.setAttribute('correcta', 'mal');
                            });
                            isGood = false;

                            ariaLivePolite.innerHTML = 'Esta relación es incorrecta!';
                            this.accumulationPairs[this.currentSlideIndex] += 1;
                        }
                    }

                    itemsSet.forEach((item) => {
                        item.classList.replace('treeItem_set', 'treeItem');
                    });

                    this.arrValuesActive = [];
                } else if (this.arrValuesActive[1] === this.arrValuesActive[3]) {
                    let itemsHi = this.contextActive.querySelectorAll('.treeItem_hi');
                    let canvas = this.arrContextLineCanvas[this.currentSlideIndex];
                    canvas = this.contextActive.querySelector(canvas).innerHTML = '';
                    itemsHi.forEach((item) => {
                        item.classList.replace('treeItem_hi', 'treeItem');
                    });
                    ariaLiveAssertive.innerHTML = `Ha deseleccionado: ${activeElement.target.textContent}`;
                    this.arrValuesActive = [];
                }

                this.correctPairs =
                    this.contextActive.querySelectorAll('[data-state = "correct"]') ==
                    undefined
                        ? 0
                        : this.contextActive.querySelectorAll('[data-state = "correct"]');

                this.correctPairs = this.correctPairs.length / 2;
                this.contextActive.dataset.stateGame = 'initiated';

                if (this.accumulationPairs[this.currentSlideIndex] === this.allPairs) {
                    ariaLivePolite.innerHTML = `Actividad terminada, ha obtenido: ${
                        this.correctPairs == 0
                            ? '0 parejas correctas'
                            : this.correctPairs == 1
                            ? this.correctPairs + ' pareja correta'
                            : this.correctPairs + ' parejas correctas'
                    } de ${this.allPairs}`;
                }

                resolve(isGood);
            }, 100);
        });
    }

    async clickElement(activeElement) {
        if (activeElement.target.tagName == 'SPAN') {
            this.isGood = await this.check(activeElement);
            if (this.feedback && this.isGood != 'pending') {
                feedback.give(joinGame.isGood ? 'bien' : 'mal');
            } else {
                if (this.allOptionsFirst != null) {
                    this.allOptionsFirst.forEach((element) => {
                        if (!element.dataset.state) {
                            element.removeAttribute('jsblock');
                        }
                    });
                }
                if (this.allOptionsSecond != null) {
                    this.allOptionsSecond.forEach((element) => {
                        if (!element.dataset.state) {
                            element.removeAttribute('jsblock');
                        }
                    });
                }
            }
        }
    }

    graphics() {
        this.color = 'var(--theme-body-txt)';
        this.backbuffer = '';
        this.oSource = null;
        this.oTarget = null;
        this.itemHeightFactor = 16;

        this.lineCanvasActive = this.contextActive.querySelector(
            this.arrContextLineCanvas[this.currentSlideIndex]
        );
    }

    checkbrowser() {
        this.body = document.body;
        this.dom = document.getElementById ? 1 : 0;

        this.ie = this.body && typeof this.body.insertAdjacentHTML != 'undefined';

        this.mozilla =
            typeof document.createRange != 'undefined' &&
            typeof document.createRange().setStartBefore != 'undefined';

        if (this.ie) {
            this.lineCanvasActive.insertAdjacentHTML('BeforeEnd', this.backbuffer);
            this.backbuffer = '';
        } else {
            let range = document.createRange();
            range.setStartBefore(this.lineCanvasActive);
            this.lineCanvasActive.appendChild(
                range.createContextualFragment(this.backbuffer)
            );
            this.backbuffer = '';
        }
    }

    clearCanvas() {
        this.lineCanvasActive.innerHTML = '';
        this.backbuffer = '';
    }

    setPixel(x, y, w, h) {
        var myID = `Pixel_${x},${y},${w},${h}`;
        this.backbuffer += `<div id="${myID}" mySrc="${this.oSource.id} class="" myTar="${
            this.oTarget.id
        }" style="position: absolute; left: ${x}px; top:${y}px; width:${w}px; height:${h}px; background-color:${
            this.oSource.attributes.valor.value == this.oTarget.attributes.valor.value
                ? '#07710f'
                : '#d41313'
        }; overflow:hidden; border-radius: 100%;"></div>`;
    }

    drawLine(x1, y1, x2, y2) {
        if (x1 > x2) {
            var tmpx = x1;
            var tmpy = y1;
            x1 = x2;
            y1 = y2;
            x2 = tmpx;
            y2 = tmpy;
        }

        var dx = x2 - x1;
        var dy = y2 - y1;
        var sy = 1;
        if (dy < 0) {
            sy = -1;
            dy = -dy;
        }
        dx = dx << 1;
        dy = dy << 1;
        if (dy <= dx) {
            let fraction = dy - (dx >> 1);
            var mx = x1;
            while (x1 != x2) {
                x1++;
                if (fraction >= 0) {
                    this.setPixel(mx, y1, x1 - mx, 1);
                    y1 += sy;
                    mx = x1;
                    fraction -= dx;
                }
                fraction += dy;
            }
            this.setPixel(mx, y1, x1 - mx, 1);
        } else {
            let fraction = dx - (dy >> 1);
            var my = y1;
            if (sy > 0) {
                while (y1 != y2) {
                    y1++;
                    if (fraction >= 0) {
                        this.setPixel(x1++, my, 1, y1 - my);
                        my = y1;
                        fraction -= dy;
                    }
                    fraction += dx;
                }
                this.setPixel(x1, my, 1, y1 - my);
            } else {
                while (y1 != y2) {
                    y1--;
                    if (fraction >= 0) {
                        this.setPixel(x1++, y1, 1, my - y1);
                        my = y1;
                        fraction -= dy;
                    }
                    fraction += dx;
                }
                this.setPixel(x1, y1, 1, my - y1);
            }
        }
    }

    canva() {
        let nSrcY = this.oSource.offsetTop, //relative to bounding DIV's coordinates
            nTarY = this.oTarget.offsetTop, //relative to bounding DIV's coordinates
            nRightEdge = parseInt(this.lineCanvasActive.style.width.replace('px', ''));

        try {
            this.drawLine(
                0,
                nSrcY + this.itemHeightFactor,
                nRightEdge,
                nTarY + this.itemHeightFactor
            );
            this.checkbrowser();
            this.oSource.classList.replace('treeItem_hi', 'treeItem_set');
            this.oTarget.classList.replace('treeItem_hi', 'treeItem_set');

            this.oSource = null;
            this.oTarget = null;
        } catch (e) {
            console.log('e', e);
        }
    }

    setSource(oSrc) {
        this.oSource = null;
        // Toma el valor del span que genera el evento de la primera columna

        let removeClass = this.firstColumn.querySelectorAll('.treeItem_hi');

        if (this.oSource != null) {
            if (this.oSource.className == 'treeItem_hi') {
                this.oSource.classList.replace('treeItem_hi', 'treeItem');
            }
            this.oSource = null;
        }

        if (removeClass.length > 0) {
            removeClass.forEach((element) => {
                element.classList.replace('treeItem_hi', 'treeItem');
            });
        }

        this.oSource = oSrc;

        this.allOptionsFirst = this.firstColumn.querySelectorAll('.treeItem');

        this.allOptionsFirst.forEach((element) => {
            element.setAttribute('jsblock', 'jsblock');
        });

        if (this.allOptionsSecond != null) {
            this.allOptionsSecond.forEach((element) => {
                if (!element.dataset.state) {
                    element.removeAttribute('jsblock');
                }
            });
        }

        if (this.oSource != null) {
            this.oSource.classList.replace('treeItem', 'treeItem_hi');
        } else {
            this.oSource;
        }

        if (this.oTarget != null) {
            this.canva();
            this.oSource = null;
            this.oTarget = null;
        }
    }

    setTarget(oTar) {
        this.oTarget = null;
        // Toma el valor del span que genera el evento de la segunda columna
        let removeClass = this.secondColumn.querySelectorAll('.treeItem_hi');

        if (this.oTarget != null) {
            if (this.oTarget.className == 'treeItem_hi') {
                this.oTarget.classList.replace('treeItem_hi', 'treeItem');
            }
            this.oTarget = null;
        }

        if (removeClass.length > 0) {
            removeClass.forEach((element) => {
                element.classList.replace('treeItem_hi', 'treeItem');
            });
        }

        this.oTarget = oTar;

        this.allOptionsSecond = this.secondColumn.querySelectorAll('.treeItem');

        this.allOptionsSecond.forEach((element) => {
            element.setAttribute('jsblock', 'jsblock');
        });

        if (this.allOptionsFirst != null) {
            this.allOptionsFirst.forEach((element) => {
                if (!element.dataset.state) {
                    element.removeAttribute('jsblock');
                }
            });
        }

        this.oTarget != null
            ? this.oTarget.classList.replace('treeItem', 'treeItem_hi')
            : this.oTarget;

        if (this.oSource != null) {
            this.canva();
            this.oSource = null;
            this.oTarget = null;
        }
    }
}
