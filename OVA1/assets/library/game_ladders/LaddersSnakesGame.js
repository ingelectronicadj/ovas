const startbutton = document.getElementById('startbutton');
const currentDiv = document.getElementById('area');
const diceContainer = document.getElementById('diceContainer');
const ladderContainer = document.getElementById('ladder-container');
let modal = document.getElementById('myModal');
let idQuestion;
let dice;
var dialogmodal = new ovaDialog('modal');
var endmodal = new ovaDialog('endmodal');
let imageDice = document.getElementById('diceImage');
class LadderSnakesGame {
    constructor(amountGrids, amountLaddersSnakes, jsonQuestions) {
        this.currentIndex = 0;
        this.amountGrids = amountGrids;
        this.amountLaddersSnakes = amountLaddersSnakes;
        this.position = {
            startleftposition: 20,
            starttopposition: 100,
        };
        this.intervalo;
        this.jsonQuestions = jsonQuestions;
    }

    StartGame() {
        this.CreateGrid();
        let newLadders = this.GetRandomNumbers();
        this.SetLadders(newLadders);
        this.CreatePlayer();
        startbutton.addEventListener('click', this.ButtonAction);
    }

    CreateGrid() {
        let newGrid = document.createElement('div');
        newGrid.classList = 'Grid';
        newGrid.setAttribute('id', 'grid');
        ladderContainer.appendChild(newGrid);
        let rowgrid = this.amountGrids / 5;
        let CurrentGrid = document.getElementById('grid');
        let rowGraph2 = '';
        let arrayStyle = [];
        let index = 1;
        for (let i = 1; i <= rowgrid; i++) {
            let newArray = [];

            for (let j = 1; j <= 5; j++) {
                let newGridItem = document.createElement('div');
                newGridItem.classList = 'Grid-item';
                newGridItem.setAttribute('id', `grid-item${index}`);
                newGridItem.innerHTML = `<span id='spam-${index}' class='numberSpan'>${index}</span>`;
                CurrentGrid.appendChild(newGridItem);
                newGridItem.setAttribute('style', `grid-area: a${index}`);
                newGridItem.setAttribute('Action', 'Question');
                newGridItem.setAttribute('gridindex', index);
                newArray.push(`a${index}`);
                newGridItem.setAttribute('direction', 'Right');
                if (index % 5 === 0) {
                    let downGridItem = document.querySelector(`#grid-item${index}`);
                    downGridItem.setAttribute('direction', 'Down');
                }
                if (i % 2 === 0 && index % 5 !== 0) {
                    let leftGridItem = document.querySelector(`#grid-item${index}`);
                    leftGridItem.setAttribute('direction', 'Left');
                }
                index++;
            }
            arrayStyle.push(newArray);
        }
        arrayStyle.forEach((element, i) => {
            if (i % 2 === 1) {
                element.reverse();
            }
            rowGraph2 += ` '${element.join(' ')}'`;
        });
        CurrentGrid.style.gridTemplateAreas = `${rowGraph2}`;
    }

    CreatePlayer() {
        let newDivPlayer = document.createElement('div');
        newDivPlayer.classList = 'player';
        newDivPlayer.setAttribute('id', 'player');
        newDivPlayer.style.left = `${LadderGame.position.startleftposition}px`;
        newDivPlayer.style.top = `${LadderGame.position.starttopposition}px`;
        ladderContainer.appendChild(newDivPlayer);
    }

    MovementPlayer() {
        let getGridItem = LadderGame.CurrentItemGrid();
        let jugador = document.getElementById('player');
        let direction = getGridItem.getAttribute('direction');
        let status = getGridItem.getAttribute('status');
        switch (direction) {
            case 'Down':
                LadderGame.position.starttopposition =
                    LadderGame.position.starttopposition + 140;
                jugador.style.top = `${LadderGame.position.starttopposition}px`;
                break;
            case 'Left':
                LadderGame.position.startleftposition =
                    LadderGame.position.startleftposition - 140;
                jugador.style.left = `${LadderGame.position.startleftposition}px`;
                break;
            case 'Up':
                LadderGame.position.starttopposition =
                    LadderGame.position.starttopposition - 140;
                jugador.style.top = `${LadderGame.position.starttopposition}px`;
                break;
            case 'Right':
                LadderGame.position.startleftposition =
                    LadderGame.position.startleftposition + 140;
                jugador.style.left = `${LadderGame.position.startleftposition}px`;
                break;
        }

        switch (status) {
            case 'Turningback':
                LadderGame.currentIndex--;
                break;
            default:
                LadderGame.currentIndex++;
                break;
        }
    }

    AmountDiceMovement(amountDice) {
        let counter = 1;
        startbutton.disabled = true;
        LadderGame.intervalo = setInterval(function () {
            counter++;
            LadderGame.MovementPlayer();
            if (counter > amountDice) {
                clearInterval(LadderGame.intervalo);
            }
            if (LadderGame.currentIndex > 14) {
                clearInterval(LadderGame.intervalo);
            }
        }, 500);
        counter = 1;
    }

    AmountDiceMovementAction(dice) {
        for (let diceCount = 1; diceCount <= dice; diceCount++) {
            LadderGame.MovementPlayer();
        }
    }

    GenerateValue(max, min) {
        return Math.round(Math.random() * (max - min) + min);
    }

    GetRandomNumbers() {
        let allGridsItems = document.querySelectorAll('.Grid-item');
        let amountGridItems = allGridsItems.length;
        let numbers = [];
        let selectedNumbers = [];
        for (let j = 1; j <= amountGridItems; j++) {
            numbers.push(j);
        }

        for (let i = 0; i < LadderGame.amountLaddersSnakes; i++) {
            let randonNumber = numbers[Math.floor(Math.random() * (numbers.length - 1))];
            let pos = numbers.indexOf(randonNumber);
            let arrayLength = selectedNumbers.length;

            if (numbers.includes(randonNumber)) {
                if (!selectedNumbers.includes(randonNumber)) {
                    let currentNumber = selectedNumbers[arrayLength - 1];
                    let suma = currentNumber + 3;
                    let maxNumbers = numbers.length;

                    if (i % 2 === 0 && i !== 0) {
                        randonNumber = numbers[i];
                        selectedNumbers.push(randonNumber);
                        numbers.splice(pos, 1);
                    } else {
                        if (selectedNumbers.length > 0) {
                            if (randonNumber > currentNumber && randonNumber > suma) {
                                selectedNumbers.push(randonNumber);
                                numbers.splice(pos, 1);
                            } else {
                                i--;
                                numbers.splice(pos, 1);
                            }
                        } else {
                            if (randonNumber >= numbers[maxNumbers - 5]) {
                                i--;
                            } else {
                                if (randonNumber < numbers.length / 2) {
                                    selectedNumbers.push(randonNumber);
                                    numbers.splice(pos, 1);
                                } else {
                                    i--;
                                }
                            }
                        }
                    }
                } else {
                    i--;
                    numbers.splice(pos, 1);
                }
            } else {
                i--;
            }
        }
        return selectedNumbers;
    }

    SetLadders(selectedGridsArray) {
        let AmountLadder = selectedGridsArray.length;
        let FinalLadder = selectedGridsArray.length / 2;
        let AmountSnake = FinalLadder + 1;

        for (let i = 1; i <= FinalLadder; i++) {
            let currentGridItem = document.getElementById(
                'grid-item' + selectedGridsArray[i - 1]
            );
            let Ladder = document.createElement('div');
            let LadderIcon = document.createElement('div');
            Ladder.classList = 'grid-item-background';
            LadderIcon.classList = 'grid-item-icon';
            Ladder.setAttribute('id', `ladder${i}`);
            currentGridItem.appendChild(Ladder);
            currentGridItem.appendChild(LadderIcon);
            if (i % 2 === 1) {
                currentGridItem.setAttribute('Action', 'PortalInicio');
                Ladder.style.backgroundImage = "url('assets/images/slide16_5.png')";
                LadderIcon.style.backgroundImage = "url('assets/images/slide16_11.png')";
            } else {
                currentGridItem.setAttribute('Action', 'PortalFinal');
                Ladder.style.backgroundImage = "url('assets/images/slide16_5.png')";
                LadderIcon.style.backgroundImage = "url('assets/images/slide16_10.png')";
            }
        }
        for (let i = AmountSnake; i <= AmountLadder; i++) {
            let currentGridItem = document.getElementById(
                'grid-item' + selectedGridsArray[i - 1]
            );
            let Snake = document.createElement('div');
            let SnakeIcon = document.createElement('div');
            Snake.classList = 'grid-item-background';
            SnakeIcon.classList = 'grid-item-icon';
            Snake.setAttribute('id', `snake${i};`);
            currentGridItem.appendChild(Snake);
            currentGridItem.appendChild(SnakeIcon);
            if (i % 2 === 1) {
                currentGridItem.setAttribute('Action', 'SnakeFinal');
                Snake.style.backgroundImage = "url('assets/images/slide16_4.png')";
                SnakeIcon.style.backgroundImage = "url('assets/images/slide16_9.png')";
            } else {
                currentGridItem.setAttribute('Action', 'SnakeInicio');
                Snake.style.backgroundImage = "url('assets/images/slide16_4.png')";
                SnakeIcon.style.backgroundImage = "url('assets/images/slide16_8.png')";
            }
        }
    }

    CurrentItemGrid() {
        let currentGridItem;
        if (LadderGame.currentIndex === 0) {
            currentGridItem = document.getElementById('grid-item1');
        } else {
            currentGridItem = document.getElementById(
                `grid-item${LadderGame.currentIndex}`
            );
        }
        return currentGridItem;
    }

    DestinationItemGrid() {
        let currentGridItem;
        let destinationIndex = LadderGame.currentIndex;
        destinationIndex = destinationIndex + dice;
        currentGridItem = document.getElementById(`grid-item${destinationIndex}`);
        return currentGridItem;
    }

    LastItemGrid() {
        let currentGridItem;
        let lastIndex = LadderGame.currentIndex;
        lastIndex = lastIndex - dice;
        if (LadderGame.lastIndex < 0) {
            currentGridItem = document.getElementById('grid-item1');
        } else {
            currentGridItem = document.getElementById(`grid-item${lastIndex}`);
        }
        return currentGridItem;
    }

    SetLabelOption() {
        let totalOptions = Object.keys(LadderGame.jsonQuestions[idQuestion].options)
            .length;
        let finalLabel = '';
        for (let index = 0; index < totalOptions; index++) {
            let optionLabel = `<div class="option"><b>${
                LadderGame.jsonQuestions[idQuestion].options[index].letter
            }</b><label class="c-input_radio" tabindex="0" role="application" aria-label="${
                LadderGame.jsonQuestions[idQuestion].options[index].answer
            }" for="id_${
                LadderGame.jsonQuestions[idQuestion].options[index].id
            }"><input class="js-input_validate" tabindex="-1" aria-hidden="true" type="radio" id="id_${
                LadderGame.jsonQuestions[idQuestion].options[index].id
            }" name="name_${LadderGame.jsonQuestions[idQuestion].questionindex}" value="${
                index + 1
            }" data="${
                LadderGame.jsonQuestions[idQuestion].options[index].answer
            }"><span>${
                LadderGame.jsonQuestions[idQuestion].options[index].answer
            }</span></label></div>`;
            finalLabel += optionLabel;
        }

        return finalLabel;
    }

    DoAction() {
        idQuestion = LadderGame.GenerateValue(9, 0);
        let toGoGridItem;
        let toGoIndex;
        let newIndex;
        let getGridItem = LadderGame.CurrentItemGrid();
        let fromIndex = getGridItem.getAttribute('gridindex');
        let Action = getGridItem.getAttribute('action');
        switch (Action) {
            case 'Question':
                ariaLiveAssertive.innerHTML = `Ha Llegado a una posición en el tablero donde se encuentra una pregunta`;
                let selectoptionmodal = `<div class="row-flex"><div class="col xs12"><p class="question"></p><p  tabindex="0"><b>${
                    LadderGame.jsonQuestions[idQuestion].questionindex
                }.</b>${
                    LadderGame.jsonQuestions[idQuestion].question
                }</p><div class="answers" data-order="${
                    LadderGame.jsonQuestions[idQuestion].questionindex
                }">${this.SetLabelOption()}</div></div></div>`;
                dialogmodal.open();
                let modalContent = document.querySelector('#modal .c-modal_body');
                let modalCloseButton = document.querySelector(
                    '#modal .c-modal_contBtn-button'
                );
                let modalOverlay = document.querySelector('#area .js-close_modal');
                modalContent.innerHTML = selectoptionmodal;
                modalOverlay.style.pointerEvents = 'none';
                modalCloseButton.style.display = 'none';
                this.clickLabel();
                break;
            case 'PortalInicio':
                ariaLiveAssertive.innerHTML = `Ha Llegado a una posición en el tablero donde se encuentra una escalera`;
                toGoGridItem = document.querySelector(
                    ".Grid-item[action = 'PortalFinal']"
                );
                toGoIndex = toGoGridItem.getAttribute('gridindex');
                newIndex = parseInt(toGoIndex) - parseInt(fromIndex);
                LadderGame.AmountDiceMovementAction(newIndex);
                startbutton.disabled = false;
                startbutton.focus();
                break;
            case 'PortalFinal':
            case 'SnakeFinal':
                startbutton.disabled = false;
                startbutton.focus();
                break;
            case 'SnakeInicio':
                ariaLiveAssertive.innerHTML = `Ha Llegado a una posición en el tablero donde se encuentra una Serpiente`;
                toGoGridItem = document.querySelector(
                    ".Grid-item[action = 'SnakeFinal']"
                );
                toGoIndex = toGoGridItem.getAttribute('gridindex');
                newIndex = parseInt(fromIndex) - parseInt(toGoIndex);
                let tempo1 = parseInt(fromIndex);
                let tempo2 = parseInt(toGoIndex);
                for (let i = tempo1 + 1; i > tempo2; i--) {
                    let selectedGrids = document.getElementById('grid-item' + i);
                    let currentGrids = document.getElementById('grid-item' + (i - 1));
                    let currentDirection = currentGrids.getAttribute('direction');
                    switch (currentDirection) {
                        case 'Down':
                            selectedGrids.setAttribute('direction', 'Up');
                            selectedGrids.setAttribute('status', 'Turningback');
                            break;
                        case 'Left':
                            selectedGrids.setAttribute('direction', 'Right');
                            selectedGrids.setAttribute('status', 'Turningback');
                            break;
                        case 'Right':
                            selectedGrids.setAttribute('direction', 'Left');
                            selectedGrids.setAttribute('status', 'Turningback');
                            break;
                    }
                }
                LadderGame.AmountDiceMovementAction(newIndex);
                startbutton.disabled = false;
                startbutton.focus();
                for (let i = tempo2 + 1; i < tempo1; i++) {
                    let selectedGrids = document.getElementById('grid-item' + i);
                    let currentGrids = document.getElementById('grid-item' + (i + 1));
                    let currentDirection = currentGrids.getAttribute('direction');
                    switch (currentDirection) {
                        case 'Up':
                            selectedGrids.setAttribute('direction', 'Down');
                            selectedGrids.removeAttribute('status');
                            break;
                        case 'Right':
                            selectedGrids.setAttribute('direction', 'Left');
                            selectedGrids.removeAttribute('status');
                            break;
                        case 'Left':
                            selectedGrids.setAttribute('direction', 'Right');
                            selectedGrids.removeAttribute('status');
                            break;
                    }
                }

                let end = document.querySelectorAll('div[status]');
                for (let i = 0; i < 2; i++) {
                    let endStatus = end[i].getAttribute('direction');
                    switch (endStatus) {
                        case 'Up':
                            end[i].setAttribute('direction', 'Down');
                            end[i].removeAttribute('status');
                            break;
                        case 'Right':
                            end[i].setAttribute('direction', 'Left');
                            end[i].removeAttribute('status');
                            break;
                        case 'Left':
                            end[i].setAttribute('direction', 'Right');
                            end[i].removeAttribute('status');
                            break;
                    }
                }
                break;
        }
    }

    ActionReverse(amount) {
        let player = document.getElementById('player');
        let reverseGridItem;
        let action;
        for (let i = 1; i < amount + 1; i++) {
            reverseGridItem = document.getElementById(
                `grid-item${this.currentIndex - i}`
            );
            if (reverseGridItem === null) {
                reverseGridItem = document.getElementById(`grid-item1`);
            }
            action = reverseGridItem.getAttribute('direction');
            switch (action) {
                case 'Right':
                    LadderGame.position.startleftposition =
                        LadderGame.position.startleftposition - 140;
                    player.style.left = `${LadderGame.position.startleftposition}px`;
                    break;
                case 'Left':
                    LadderGame.position.startleftposition =
                        LadderGame.position.startleftposition + 140;
                    player.style.left = `${LadderGame.position.startleftposition}px`;
                    break;
                case 'Up':
                    LadderGame.position.starttopposition =
                        LadderGame.position.starttopposition + 140;
                    player.style.top = `${LadderGame.position.starttopposition}px`;
                    break;
                case 'Down':
                    LadderGame.position.starttopposition =
                        LadderGame.position.starttopposition - 140;
                    player.style.top = `${LadderGame.position.starttopposition}px`;
                    break;
            }
        }
        if (this.currentIndex > 0) {
            this.currentIndex = this.currentIndex - amount;
        } else {
            this.currentIndex = 0;
        }
    }

    ButtonAction() {
        imageDice.setAttribute('src', ``);
        startbutton.disabled = true;
        dice = LadderGame.GenerateValue(6, 1);
        ariaLiveAssertive.innerHTML = `El dado ha sido lanzado usted se movera ${dice} posiciones en el tablero`;
        let newTimte = dice + 3;
        let time = parseInt(newTimte + '000');
        imageDice.setAttribute('src', `assets/images/slide16_12_${dice}.gif`);
        setTimeout(function () {
            LadderGame.AmountDiceMovement(dice);
        }, 3000);
        setTimeout(function () {
            LadderGame.DoAction();
        }, time);
    }

    getEventsModal() {
        if (this.status === 'bien') {
            dialogmodal.close();
            if (LadderGame.currentIndex > 14) {
                ladderContainer.innerHTML = '';
                LadderGame.currentIndex = 0;
                this.position.startleftposition = 20;
                this.position.starttopposition = 100;
                LadderGame.EndGame();
                LadderGame.StartGame();
            }
            startbutton.disabled = false;
            startbutton.focus();
        } else {
            dialogmodal.close();
            LadderGame.ActionReverse(dice);
            startbutton.disabled = false;
            startbutton.focus();
        }
    }

    Instructions() {
        let instructionText =
            'Presione el botón "Girar dado" para lanzar, la ficha se moverá  dependiendo la cantidad de puntos que salga en el dado, en cada casilla hay una pregunta que usted  tiene que responder de manera correcta para poder volver a lanzar  si la respuesta no es correcta la ficha se devuelve a la posición anterior.  Las casillas  de la serpiente  le ayudara  a llegar mas rápido a la meta y la de la escalera  lo devolverá.';
        let containmodal = `<div class="row-flex"><div class="col xs12"><p class="p-instrucciones><b>Instrucciónes.</b></p><div class="contain-instructions" tabindex="0">${instructionText}</div></div></div>`;
        let modalContent = document.querySelector('#modal .c-modal_body');
        modalContent.parentNode.parentNode.classList.add('close-modal');
        let modalCloseButton = document.querySelector('#modal .c-modal_contBtn-button');
        modalContent.innerHTML = containmodal;
        modalCloseButton.addEventListener('click', function () {
            dialogmodal.close();
        });
        modalCloseButton.style.display = 'block';
        dialogmodal.open();
    }

    clickLabel() {
        let modalContext = document.querySelector('#modal');

        let labels = [...modalContext.querySelectorAll('.answers label')];

        labels.map((label) => {
            label.addEventListener('keydown', (e) => {
                let key = e.key,
                    radioId;
                if (key == 'Enter' || key == ' ') {
                    radioId = e.target.htmlFor;
                    if (radioId != undefined) {
                        modalContext.querySelector(`#${radioId}`).click();
                        setTimeout(() => {
                            modalContext.querySelector(`#${radioId}`)
                                .previousElementSibling == null
                                ? modalContext
                                      .querySelector(`#${radioId}`)
                                      .nextElementSibling.click()
                                : modalContext
                                      .querySelector(`#${radioId}`)
                                      .previousElementSibling.click();
                        }, 1000);
                    } else {
                        radioId = e.target.dataset.radioId;
                        radioId != undefined
                            ? modalContext.querySelector(`#${radioId}`).click()
                            : console.log('No tiene radio.');
                    }
                }
            });
        });
    }

    EndGame() {
        let instructionText = 'Usted ha Completado la escalera.';
        let containmodal = `<div class="row-flex"><div class="col xs12"><p class="p-finalmessage"><b>Felicitaciones.</b></p><div class="contain-finalmessage">${instructionText}</div></div></div>`;
        let modalContent = document.querySelector('#endmodal .c-modal_body');
        modalContent.parentNode.parentNode.classList.add('close-modal');
        let modalCloseButton = document.querySelector(
            '#endmodal .c-modal_contBtn-button'
        );
        modalContent.innerHTML = containmodal;
        modalCloseButton.addEventListener('click', function () {
            endmodal.close();
        });
        endmodal.open();
    }
}
