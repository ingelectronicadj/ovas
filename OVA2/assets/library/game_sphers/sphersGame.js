const $initBtn = document.getElementById('stargame');
let topInterval;
let status = true;
let metodoAleatorio = 'Polya';
const textos = [
    {
        GarcíayZayas: [
            'Identificar el problema',
            'Analizar el problema',
            'Soluciones potenciales',
        ],
    },
    {
        Polya: ['Plan de acción', 'Ejecutar el plan', 'Evaluar plan'],
    },
];
const metodos = ['Polya', 'GarcíayZayas'];

$initBtn.addEventListener('click', () => {
    startGame();
});

function startGame() {
    let area = document.getElementById('area');
    area.style.cursor = 'none';
    player.style.display = 'initial';
    $initBtn.disabled = true;
    status = true;
    metodoAleatorio = getRandomMetodo();
    showMetodo(metodoAleatorio);
    ballMovement();
    createGoodGuys(3, 'Polya', '#FFEE58', 1, '#424242');
    createGoodGuys(3, 'GarcíayZayas', '#212121', 0, '#FCF3CF');
}

function generateValue(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

function createGoodGuys(amount, set, color, idText, spamColor) {
    let currentDiv = document.getElementById('area');
    let windowWidth = currentDiv.clientWidth - 100;
    let windowHeight = currentDiv.clientHeight - 100;

    for (let i = 1; i <= amount; i++) {
        let ballTop = generateValue(windowHeight, 0);
        let ballLeft = generateValue(windowWidth, 0);
        let newDiv = document.createElement('div');
        newDiv.classList = 'good-guy';
        newDiv.setAttribute('id', 'goodguy-' + set + i);
        newDiv.setAttribute('group', set);
        newDiv.setAttribute('tabindex', '0');
        newDiv.setAttribute('aria-label', `Elemento${textos[idText][set][i - 1]}`);
        currentDiv.appendChild(newDiv);
        let ball = document.getElementById('goodguy-' + set + i);
        ball.style.left = ballLeft + 'px';
        ball.style.top = ballTop + 'px';
        ball.style.background = color;
        ball.innerHTML =
            "<span id='spam-" +
            set +
            '-texto-' +
            i +
            "'>" +
            textos[idText][set][i - 1] +
            '</span>';
        let spamText = document.getElementById('spam-' + set + '-texto-' + i);
        spamText.classList = 'spam-texto';
        spamText.style.color = spamColor;
        let newValueTop = (document.getElementById(
            'goodguy-' + set + i
        ).style.top = ballTop);
        let newValueLeft = (document.getElementById(
            'goodguy-' + set + i
        ).style.left = ballLeft);
        let offsetXup = false;
        let offsetXdown = true;
        let offsetYup = true;
        let offsetYdown = false;

        if (i === amount && !status) {
            eatGoodGuys(i, metodoAleatorio);
        }
        topInterval = setInterval(function() {
            if (ball !== null) {
                if (newValueTop < windowHeight && offsetXup === true) {
                    ball.style.top = newValueTop + 'px';
                    newValueTop++;
                }

                if (newValueTop > 0 && offsetXdown === true) {
                    ball.style.top = newValueTop + 'px';
                    newValueTop--;
                }

                if (newValueTop == 0) {
                    offsetXup = true;
                    offsetXdown = false;
                }

                if (newValueTop == windowHeight) {
                    offsetXup = false;
                    offsetXdown = true;
                }

                if (newValueLeft < windowWidth && offsetYup === true) {
                    ball.style.left = newValueLeft + 'px';
                    newValueLeft++;
                }

                if (newValueLeft > 0 && offsetYdown === true) {
                    ball.style.left = newValueLeft + 'px';
                    newValueLeft--;
                }

                if (newValueLeft == 0) {
                    offsetYup = true;
                    offsetYdown = false;
                }

                if (newValueLeft == windowWidth) {
                    offsetYup = false;
                    offsetYdown = true;
                }
            }
        }, generateValue(35, 15));
    }

    if (status) {
        status = false;
    }
}

function ballMovement() {
    let player = document.getElementById('player');
    player.style.display = 'none';
    let area = document.getElementById('area');
    area.addEventListener('mousemove', (e) => {
        player.setAttribute('style', `left: ${e.pageX}px; top: ${e.clientY}px;`);
    });
}

function eatGoodGuys(index, set) {
    let area = document.getElementById('area');
    let player = document.getElementById('player');
    let ballCount = 0;
    let goodGuys = document.querySelectorAll('.good-guy');
    switch (set) {
        case 'GarcíayZayas':
            feedback.messages = {
                bien: [
                    'Excelente, te has apropiado los conceptos de solución de problemas de garcía y zayas.',
                ],
                mal: [
                    'Oh, has seleccionado una opción que no hace parte del método propuesto por garcía y zayas. Te recomendamos revisar el material nuevamente.',
                ],
            };
            break;
        case 'Polya':
            feedback.messages = {
                bien: [
                    'Excelente, te has apropiado los conceptos de solución de problemas de Polya.',
                ],
                mal: [
                    'Oh, has seleccionado una opción que no hace parte del método propuesto por Polya. Te recomendamos revisar el material nuevamente.',
                ],
            };
            break;
    }
    goodGuys.forEach(($coin) => {
        $coin.addEventListener('mouseenter', (e) => {
            let setAttribute = e.target.getAttribute('group');
            if (setAttribute === set) {
                ballCount = ballCount + 1;
                if (ballCount === index) {
                    area.removeEventListener('mousemove', function() {});
                    resetGame($initBtn, area, player, topInterval);
                    feedback.create('bien');
                }
            } else {
                area.removeEventListener('mousemove', function() {});
                resetGame($initBtn, area, player, topInterval);
                feedback.create('mal');
            }
            const element = e.target;
            element.remove();
        });
        $coin.addEventListener('keydown', (e) => {
            switch (event.key) {
                case 'Enter':
                    let setAttribute = e.target.getAttribute('group');
                    if (setAttribute === set) {
                        ballCount = ballCount + 1;
                        ariaLiveAssertive.innerHTML = `Ha seleccionado un metodo propuesto por la actividad`;
                        if (ballCount === index) {
                            resetGame($initBtn, area, player, topInterval);
                            feedback.create('bien');
                        }
                    } else {
                        resetGame($initBtn, area, player, topInterval);
                        feedback.create('mal');
                    }
                    const element = e.target;
                    element.remove();
                    break;
            }
        });
    });
}

function getRandomMetodo() {
    let metodo = metodos[Math.floor(Math.random() * metodos.length)];
    return metodo;
}

function showMetodo(metodo) {
    let misionText = document.getElementById('mission-span');
    misionText.innerHTML = 'Metodo: ' + metodo;
    ariaLiveAssertive.innerHTML = `Metodo Selecionado es: ${metodo}`;
}

function resetGame(button, area, player, interval) {
    area.innerHTML = '';
    clearInterval(interval);
    button.disabled = false;
    area.style.cursor = 'auto';
    player.style.display = 'none';
    area.removeEventListener('mousemove', function() {});
}
