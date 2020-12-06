const grabButton = document.getElementById('actionGrab');
const spanElement = document.getElementById('spanElement');
const InButton = document.getElementById('InButton');
const ControlButton = document.getElementById('ControlButton');
const OutButton = document.getElementById('OutButton');
const TopLever = document.getElementById('TopLever');
let verticalPosition = 0;
let amountCoint = 0;
let valueAction;
let allItems = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
];
let deleteItemsArray = [];
const claw = document.getElementById('clawGrab');
var dialogmodal = new ovaDialog('modal');
var finalmodal = new ovaDialog('modalfinal');
const uiMachine = document.getElementById('Lever');
const coinValue = document.getElementById('CoinValue');
const containers = document.querySelectorAll('.item-container');
class clawMachine {
    StartGame() {
        this.SetContainers();
        this.FillContainers();
    }

    SetContainers() {
        let leftValue = 20;
        containers.forEach((element) => {
            element.style.left = `${leftValue}%`;
            leftValue = leftValue + 14;
        });
    }

    FillContainers() {
        let containers = document.querySelectorAll('.item-container');
        containers.forEach((element) => {
            this.EstablishItem(element);
        });
    }

    EstablishItem(container) {
        let indexvalue = allItems[Math.floor(Math.random() * allItems.length)];
        let itemFound = this.FindIndex(indexvalue);
        if (itemFound) {
            let newIndexvalue;
            do {
                newIndexvalue = allItems[Math.floor(Math.random() * allItems.length)];
                itemFound = this.FindIndex(newIndexvalue);
            } while (itemFound);
            this.SetItemInContainer(container, newIndexvalue);
        } else {
            this.SetItemInContainer(container, indexvalue);
        }
    }

    SetItemInContainer(container, indexvalue) {
        let item = ClawGame.SetItem(indexvalue);
        container.appendChild(item);
    }

    FindIndex(indexvalue) {
        let found = deleteItemsArray.find((element) => element === indexvalue);
        return found;
    }

    MoveLeverImage(direction) {
        switch (direction) {
            case 'Left':
                TopLever.style.backgroundImage = `url('assets/images/slide10_4.png')`;
                TopLever.style.left = `-45px`;
                TopLever.style.width = `100px`;
                break;
            case 'Center':
                TopLever.style.backgroundImage = `url('assets/images/slide10_3.png')`;
                TopLever.style.left = `0px`;
                TopLever.style.width = `90px`;
                break;
            case 'Right':
                TopLever.style.backgroundImage = `url('assets/images/slide10_5.png')`;
                TopLever.style.left = `30px`;
                TopLever.style.width = `100px`;
                break;
        }
    }

    SendGrab() {
        grabButton.disabled = true;
        let stratGrabHeight = 50;
        claw.style.height = `${stratGrabHeight}%`;
        let grabInterval = setInterval(function () {
            stratGrabHeight = stratGrabHeight + 1;
            claw.style.height = `${stratGrabHeight}%`;
            ariaLiveAssertive.innerHTML = `La garra esta empezando a bajar para intentar obtener un elemento `;
            if (stratGrabHeight === 85) {
                clearInterval(grabInterval);
                ClawGame.GrabItem();
            }
        }, 20);
    }

    GetBackGrab() {
        let claw = document.getElementById('clawGrab');
        let stratGrabHeight = 85;
        claw.style.height = `${stratGrabHeight}%`;
        ariaLiveAssertive.innerHTML = `La garra esta volviendo a su lugar de inicio`;
        let grabInterval = setInterval(function () {
            stratGrabHeight = stratGrabHeight - 1;
            claw.style.height = `${stratGrabHeight}%`;
            if (stratGrabHeight === 50) {
                ariaLiveAssertive.innerHTML = `La garra esta lista para volverse a lanzar`;
                clearInterval(grabInterval);
                grabButton.disabled = false;
            }
        }, 20);
    }

    MoveGrab(action) {
        let leftInterval, rightInterval;
        let claw = document.getElementById('clawGrab');
        switch (action) {
            case 'mouseright':
                leftGrab.disabled = false;
                rightInterval = setInterval(function () {
                    verticalPosition++;
                    claw.style.left = `${verticalPosition}%`;
                    ariaLiveAssertive.innerHTML = `La garra se esta desplazando hacia la derecha`;
                    rightGrab.addEventListener('mouseup', function () {
                        clearInterval(rightInterval);
                    });
                    if (verticalPosition === 80) {
                        ariaLiveAssertive.innerHTML = `La garra se detuvo, usted ha llegado al extremo de la maquina, y la garra no se movera mas hacia la derecha`;
                        clearInterval(rightInterval);
                    }
                }, 20);
                break;
            case 'keyright':
                if (verticalPosition < 80) {
                    rightInterval = setInterval(function () {
                        claw.style.left = `${verticalPosition}%`;
                        ariaLiveAssertive.innerHTML = `La garra se esta desplazando hacia la derecha`;
                    }, 20);
                    Lever.addEventListener('keyup', function () {
                        clearInterval(rightInterval);
                        ClawGame.MoveLeverImage('Center');
                    });
                    verticalPosition++;
                } else {
                    ariaLiveAssertive.innerHTML = `La garra se detuvo, usted ha llegado al extremo de la maquina, y la garra no se movera mas hacia la derecha`;
                }

                break;
            case 'mouseleft':
                leftInterval = setInterval(function () {
                    verticalPosition--;
                    claw.style.left = `${verticalPosition}%`;
                    ariaLiveAssertive.innerHTML = `La garra se esta desplazando hacia la izquierda`;
                    leftGrab.addEventListener('mouseup', function () {
                        clearInterval(leftInterval);
                    });
                    if (verticalPosition === 0) {
                        clearInterval(leftInterval);
                        ariaLiveAssertive.innerHTML = `La garra se detuvo, usted ha llegado al extremo de la maquina, y la garra no se movera mas hacia la izquierda`;
                    }
                }, 20);
                break;
            case 'keyleft':
                if (verticalPosition > 0) {
                    leftInterval = setInterval(function () {
                        ariaLiveAssertive.innerHTML = `La garra se esta desplazando hacia la izquierda`;
                        claw.style.left = `${verticalPosition}%`;
                    }, 20);
                    Lever.addEventListener('keyup', function () {
                        clearInterval(leftInterval);
                        ClawGame.MoveLeverImage('Center');
                    });
                    verticalPosition--;
                } else {
                    ariaLiveAssertive.innerHTML = `La garra se detuvo, usted ha llegado al extremo de la maquina, y la garra no se movera mas hacia la izquierda`;
                }
                break;
        }
    }

    SetItem(index) {
        let item = document.createElement('div');
        item.classList.add('item');
        item.setAttribute('id', PositionItemArray[index - 1][0]);
        item.setAttribute('name', PositionItemArray[index - 1][1]);
        item.setAttribute('action', PositionItemArray[index - 1][2]);
        item.style.backgroundImage = `url('assets/images/slide11_1_${index - 1}.png')`;
        deleteItemsArray.push(index);
        let itemtoerase = allItems.indexOf(index);
        allItems.splice(itemtoerase, 1);
        return item;
    }

    GrabItem() {
        let currentLeft = claw.style.left;
        let valueCurrentLeft = parseInt(currentLeft.substring(2, 0)) + 5;
        containers.forEach((element) => {
            let containerLeft = element.style.left;
            let containerLeftFinal = parseInt(containerLeft.substring(2, 0));
            if (containerLeftFinal === valueCurrentLeft) {
                claw.appendChild(element.firstChild);
                claw.firstChild.classList.add('grabbed');
                claw.firstChild.style.display = 'none';
                dialogmodal.open();
                let modalCloseButton = document.querySelector(
                    '#modal .c-modal_contBtn-button'
                );
                let modalOverlay = document.querySelector('#area .js-close_modal');
                modalOverlay.style.pointerEvents = 'none';
                modalCloseButton.style.display = 'none';
                spanElement.innerHTML = `Elemento: ${claw.firstChild.getAttribute(
                    'name'
                )}`;
                ariaLiveAssertive.innerHTML = `La garra ha logrado atrapar un elemento el cual es ${claw.firstChild.getAttribute(
                    'name'
                )}`;
            } else {
                ariaLiveAssertive.innerHTML = `La garra no ha logrado atrapar ningun elemento`;
            }
        });
    }

    VerifiyOption() {
        dialogmodal.close();
        let grabbedItem = document.querySelector('.grabbed');
        let itemValueAction = grabbedItem.getAttribute('action');
        let badMessage;
        ArrayMessages.forEach((element) => {
            if (element[0] === itemValueAction) {
                badMessage = element[1];
            }
        });
        let feedbackMessages = {
            bien: [
                'Felicitaciones, Ha definido correctamente el tipo del elemento seleccionado',
            ],
            mal: [badMessage],
        };
        feedback.messages = feedbackMessages;
        if (valueAction === itemValueAction) {
            if (allItems.length > 0) {
                let getEmptyContainer = this.VerifyEmptyContainer();
                this.EstablishItem(getEmptyContainer);
            }
            if (amountCoint === 220) {
                finalmodal.open();
                allItems = [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                    21,
                    22,
                    23,
                ];
                amountCoint = 0;
                this.StartGame();
            }
            amountCoint = amountCoint + 10;
            coinValue.innerHTML = amountCoint;
            claw.removeChild(grabbedItem);
            feedback.create('bien');
        } else {
            let getEmptyContainer = this.VerifyEmptyContainer();
            getEmptyContainer.appendChild(grabbedItem);
            grabbedItem.style.display = 'block';
            feedback.create('mal');
        }
    }

    GenerateValue(max, min) {
        return Math.round(Math.random() * (max - min) + min);
    }

    VerifyEmptyContainer() {
        let selectedElement;
        containers.forEach((element) => {
            if (element.children.length === 0) {
                selectedElement = element;
            }
        });
        return selectedElement;
    }
}
