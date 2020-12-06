let valueMissionSelected;
let arrayMissions = [];
let amountCorrectMission = 0;
var dialogmodal = new ovaDialog('modal');

const stand = document.getElementById('stand');
const sendButton1 = document.getElementById('send-button1');
const sendButton2 = document.getElementById('send-button2');
const cleanButton1 = document.getElementById('clean-button1');
const cleanButton2 = document.getElementById('clean-button2');
const verifyButton1 = document.getElementById('verify-button1');
const verifyButton2 = document.getElementById('verify-button2');
const missionTex = document.getElementById('amountCompleteMissions');
const quitButton = document.getElementById('buttonQuit');

class sendConveyorBelt {
    constructor(objectArray, missionArray, objectBox1, objectBox2, feedbackArray) {
        this.missionArray = missionArray;
        this.objectArray = objectArray;
        this.objectBox1 = objectBox1;
        this.objectBox2 = objectBox2;
        this.feedbackArray = feedbackArray;
        this.UpdateList = this.UpdateList.bind(this);
    }

    StartGame() {
        this.CreateObject();
        this.SetMission(1);
        this.SetMission(2);
        this.ActiveButtons(1, true, 'add');
        this.ActiveButtons(2, true, 'add');
        this.VerifyBox(1);
        this.VerifyBox(2);
    }

    CreateObject() {
        for (let i = 0; i < this.objectArray.length; i++) {
            let Object = document.createElement('div');
            Object.setAttribute('id', this.objectArray[i][0]);
            Object.setAttribute('numberId', this.objectArray[i][2]);
            Object.classList = 'item';
            Object.setAttribute('draggable', 'true');
            Object.setAttribute('ondragstart', 'SendConveyorGame.Drag(event)');
            Object.setAttribute('tabindex', '0');
            Object.setAttribute('aria-label', `Elemento ${this.objectArray[i][0]}`);
            Object.setAttribute('type', this.objectArray[i][1]);
            Object.style.backgroundImage = `url('assets/images/slide11_1_${i}.png')`;
            stand.appendChild(Object);
        }
    }

    SetMission(box) {
        let missionBox = document.getElementById(`mision${box}`);
        valueMissionSelected = this.GenerateValue(missionArray.length - 1, 0);
        arrayMissions.push(valueMissionSelected);
        missionBox.innerHTML = `<b>Pedido: </b>${missionArray[valueMissionSelected][0]}`;
        ariaLiveAssertive.innerHTML = `Se ha realizado un nuevo pedido en la banda transportadora ${box} y el pedido es ${missionArray[valueMissionSelected][0]}`;
    }

    GenerateValue(max, min) {
        return Math.round(Math.random() * (max - min) + min);
    }

    ActiveButtons(box, action, listAction) {
        let currentCleanBUtton = document.getElementById(`clean-button${box}`);
        let currentVerifyBUtton = document.getElementById(`verify-button${box}`);
        if (listAction === 'add') {
            currentCleanBUtton.classList.add('disabled');
            currentVerifyBUtton.classList.add('disabled');
        } else {
            currentCleanBUtton.classList.remove('disabled');
            currentVerifyBUtton.classList.remove('disabled');
        }
        currentCleanBUtton.disabled = action;
        currentVerifyBUtton.disabled = action;
    }

    SendPackage(box) {
        let currentSendButton = document.getElementById(`send-button${box}`);
        let valueLeft = 70;
        let divBox = document.getElementById(`box${box}`);
        let modalActive = document.getElementById(`myPopup${box}`);
        modalActive.classList.remove('show');
        let intervalo = setInterval(function () {
            SendConveyorGame.ActiveButtons(box, true, 'add');
            currentSendButton.classList.add('disabled');
            currentSendButton.disabled = true;
            valueLeft = valueLeft - 1;
            divBox.style.left = `${valueLeft}%`;
            if (valueLeft === 0) {
                ariaLiveAssertive.innerHTML = `Se ha realizado el envio del pedido en la banda transportadora ${box} `;
                SendConveyorGame.GetIdAnswer(box);
                SendConveyorGame.VerifyMission(box, arrayMissions[box - 1]);
                clearInterval(intervalo);
            }
        }, 40);
    }

    ResetPackage(box) {
        let currentSendButton = document.getElementById(`send-button${box}`);
        let valueLeft = 0;
        let divBox = document.getElementById(`box${box}`);
        let items = document.querySelectorAll('div[belt="' + box + '"]');
        for (let i = 0; i < items.length; i++) {
            divBox.removeChild(items[i]);
        }
        let intervalo = setInterval(function () {
            SendConveyorGame.ActiveButtons(box, true, 'add');
            valueLeft = valueLeft + 1;
            divBox.style.left = `${valueLeft}%`;
            if (valueLeft === 70) {
                clearInterval(intervalo);
                ariaLiveAssertive.innerHTML = `La banda transportadora ${box} se ha limpiado y esta lista para hacer un nuevo pedido.`;
                currentSendButton.classList.remove('disabled');
                currentSendButton.disabled = false;
            }
        }, 40);
        currentObjectArray1 = [];
        currentObjectArray2 = [];
    }

    Drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    AllowDrop(ev) {
        ev.preventDefault();
    }

    DropTable(ev, box) {
        SendConveyorGame.ActiveButtons(box, false, 'remove');
        ev.preventDefault();
        let data = ev.dataTransfer.getData('text');
        let currentObject = document.getElementById(data);
        let cln = currentObject.cloneNode(true);
        ev.target.appendChild(cln);
        let idBox = ev.target.id;
        let numberIdObject = cln.getAttribute('numberId');
        cln.removeAttribute('draggable');
        cln.removeAttribute('ondragstart');
        cln.style.pointerEvents = 'none';
        cln.style.position = 'absolute';
        cln.style.marginBotton = '0px';
        cln.style.width = '60px';
        cln.style.height = '60px';
        cln.style.left = '35px';
        cln.style.top = '-15px';
        cln.setAttribute('send', true);
        if (idBox === 'box1') {
            cln.setAttribute('belt', 1);
            currentObjectArray1.push(numberIdObject);
        }
        if (idBox === 'box2') {
            cln.setAttribute('belt', 2);
            currentObjectArray2.push(numberIdObject);
        }
    }

    CleanBox(box) {
        let divBox = document.getElementById(`box${box}`);
        let items = document.querySelectorAll('div[belt="' + box + '"]');
        let modalActive = document.getElementById(`myPopup${box}`);
        modalActive.classList.remove('show');
        for (let i = 0; i < items.length; i++) {
            divBox.removeChild(items[i]);
        }
        currentObjectArray1 = [];
        currentObjectArray2 = [];
        ariaLiveAssertive.innerHTML = `Se ha limpiado el contenido de la caja ${box} en la banda transportadora ${box}`;
    }

    VerifyBox(box) {
        let boxActive = document.querySelector(`#box${box}`);
        let popupSpan = document.getElementById(`myPopup${box}`);
        popupSpan.classList.toggle('show');

        let observer = new MutationObserver(function (mutation) {
                if (mutation[0].type == 'childList') {
                    if (mutation[0].removedNodes.length == 0) {
                        SendConveyorGame.UpdateList(box);
                    } else {
                        console.log('Se limpio la lista.');
                        SendConveyorGame.UpdateList(box, 'removed');
                    }
                }
            }),
            config = { attributes: true, childList: true, characterData: true };
        observer.disconnect();
        observer.observe(boxActive, config);

        let temporalArray = [];
        if (box === 1) {
            temporalArray = currentObjectArray1;
        } else {
            temporalArray = currentObjectArray2;
        }
    }

    GetIdAnswer(box) {
        if (box === 1) {
            let currentAnswer1 = currentObjectArray1.sort();
            return currentAnswer1;
        }
        if (box === 2) {
            currentObjectArray2.sort();
            let currentAnswer2 = currentObjectArray2.toString();
            currentAnswer2 = currentAnswer2.replace(/,/g, '');
            return currentAnswer2;
        }
    }

    VerifyMission(box, idMission) {
        let currentObjectArray;
        if (box === 1) {
            currentObjectArray = currentObjectArray1;
            feedback.context = document.getElementById('container1');
        } else {
            currentObjectArray = currentObjectArray2;
            feedback.context = document.getElementById('container2');
        }
        let type;
        let correctSensor,
            correctController,
            correctActor,
            alternativecorrectActor,
            findActor,
            findSensor;
        let amountInItem = [];
        let tipocaso = SendConveyorGame.missionArray[idMission][2];
        console.log(
            `Valor para: sendConveyorBelt -> VerifyMission -> tipocaso`,
            tipocaso
        );
        switch (tipocaso) {
            case 'Caso1':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                        }
                    });
                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][0][0]
                            ) {
                                correctSensor = true;
                            } else {
                                correctSensor = false;
                            }
                            break;
                        case 'Elementos de Salida':
                            if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][2][0]
                            ) {
                                correctActor = true;
                            } else {
                                correctActor = false;
                            }
                            break;
                        case 'Elementos de Control':
                            correctController = true;
                            break;
                    }
                }
                if (correctActor && correctController && correctSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    amountCorrectMission = amountCorrectMission + 1;
                    SendConveyorGame.SetMission(box);
                    feedback.create('bien');
                } else if (correctActor && correctController && !correctSensor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][1]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                } else if (!correctActor && correctController && correctSensor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                }
                break;
            case 'Caso3':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                        }
                    });
                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][0][0]
                            ) {
                                correctSensor = true;
                            } else {
                                correctSensor = false;
                            }
                            break;
                        case 'Elementos de Salida':
                            if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][2][0]
                            ) {
                                correctActor = true;
                            } else if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][2][1]
                            ) {
                                alternativecorrectActor = true;
                            } else {
                                correctActor = false;
                                alternativecorrectActor = false;
                            }
                            break;
                        case 'Elementos de Control':
                            correctController = true;
                            break;
                    }
                }
                if (
                    correctActor &&
                    correctController &&
                    correctSensor &&
                    !alternativecorrectActor
                ) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    amountCorrectMission = amountCorrectMission + 1;
                    SendConveyorGame.SetMission(box);
                } else if (
                    alternativecorrectActor &&
                    correctController &&
                    correctSensor &&
                    !correctActor
                ) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][1]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    amountCorrectMission = amountCorrectMission + 1;
                } else if (
                    (correctActor || alternativecorrectActor) &&
                    correctController &&
                    !correctSensor
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                } else if (
                    (!correctActor || !alternativecorrectActor) &&
                    correctController &&
                    correctSensor
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][4]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                }
                break;
            case 'Caso4':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                        }
                    });
                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][0][0]
                            ) {
                                correctSensor = true;
                            } else {
                                correctSensor = false;
                            }
                            break;
                        case 'Elementos de Salida':
                            if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][2][0]
                            ) {
                                correctActor = true;
                            } else if (
                                currentObjectArray[i] ===
                                SendConveyorGame.missionArray[idMission][1][2][1]
                            ) {
                                alternativecorrectActor = true;
                            } else {
                                correctActor = false;
                                alternativecorrectActor = false;
                            }
                            break;
                        case 'Elementos de Control':
                            correctController = true;
                            break;
                    }
                }
                if (
                    (correctActor || alternativecorrectActor) &&
                    correctController &&
                    correctSensor
                ) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    SendConveyorGame.SetMission(box);
                    amountCorrectMission = amountCorrectMission + 1;
                } else if (
                    (correctActor || alternativecorrectActor) &&
                    correctController &&
                    !correctSensor
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][1]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                } else if (
                    (!correctActor || !alternativecorrectActor) &&
                    correctController &&
                    correctSensor
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    SendConveyorGame.SetMission(box);
                    feedback.create('mal');
                }
                break;

            case 'Caso5':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                            if (type === 'Elementos de Salida') {
                                amountInItem.push(item);
                            }
                        }
                    });
                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            findSensor = SendConveyorGame.missionArray[
                                idMission
                            ][1][0].every(
                                (element) => currentObjectArray.indexOf(element) > -1
                            );
                            break;
                        case 'Elementos de Salida':
                            if (amountInItem.length > 1) {
                                findActor = SendConveyorGame.missionArray[
                                    idMission
                                ][1][2].every(
                                    (element) => currentObjectArray.indexOf(element) > -1
                                );
                            } else {
                                if (
                                    currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[idMission][1][2][0]
                                ) {
                                    correctActor = true;
                                } else {
                                    correctActor = false;
                                }
                            }

                            break;
                        case 'Elementos de Control':
                            if (
                                SendConveyorGame.missionArray[idMission][1][1].length > 1
                            ) {
                                correctController = true;
                            } else {
                                if (
                                    currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[idMission][1][1][0]
                                ) {
                                    correctController = true;
                                } else {
                                    correctController = false;
                                }
                                break;
                            }
                    }
                }
                if (findActor && correctController && findSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    SendConveyorGame.SetMission(box);
                    amountCorrectMission = amountCorrectMission + 1;
                } else if (!findSensor && correctController && findActor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][1]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else if (findSensor && !correctController && findActor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else if (
                    findSensor &&
                    correctController &&
                    !findActor &&
                    !correctActor
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else if (findSensor && correctController && correctActor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][4]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][5]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                }
                break;
            case 'Caso2':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                        }
                    });
                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            findSensor = SendConveyorGame.missionArray[
                                idMission
                            ][1][0].every(
                                (element) => currentObjectArray.indexOf(element) > -1
                            );
                            break;
                        case 'Elementos de Salida':
                            findActor = SendConveyorGame.missionArray[
                                idMission
                            ][1][2].every(
                                (element) => currentObjectArray.indexOf(element) > -1
                            );
                            break;
                        case 'Elementos de Control':
                            if (
                                currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[
                                        idMission
                                    ][1][1][1][0] ||
                                currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[idMission][1][1][1][1]
                            ) {
                                correctController = false;
                            } else {
                                correctController = true;
                            }
                            break;
                    }
                }
                if (findActor && correctController && findSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    amountCorrectMission = amountCorrectMission + 1;
                    SendConveyorGame.SetMission(box);
                } else if (findActor && !correctController && findSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][1]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    amountCorrectMission = amountCorrectMission + 1;
                    SendConveyorGame.SetMission(box);
                } else if (findActor && !findSensor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else if (!findActor && findSensor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][4]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                }
                break;
            case 'Caso6':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                            if (type === 'Elementos de Entrada') {
                                amountInItem.push(item);
                            }
                        }
                    });
                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            if (amountInItem.length > 1) {
                                findSensor = SendConveyorGame.missionArray[
                                    idMission
                                ][1][0].every(
                                    (element) => currentObjectArray.indexOf(element) > -1
                                );
                            } else {
                                if (
                                    currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[idMission][1][0][0]
                                ) {
                                    correctSensor = true;
                                } else {
                                    correctSensor = false;
                                }
                            }
                            break;
                        case 'Elementos de Salida':
                            findActor = SendConveyorGame.missionArray[
                                idMission
                            ][1][2].every(
                                (element) => currentObjectArray.indexOf(element) > -1
                            );
                            break;
                        case 'Elementos de Control':
                            if (
                                currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[
                                        idMission
                                    ][1][1][1][0] ||
                                currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[idMission][1][1][1][1]
                            ) {
                                correctController = false;
                            } else {
                                correctController = true;
                            }
                            break;
                    }
                }
                if (findActor && correctController && findSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    SendConveyorGame.SetMission(box);
                } else if (findActor && correctController && correctSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][1]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    amountCorrectMission = amountCorrectMission + 1;
                    SendConveyorGame.SetMission(box);
                } else if (
                    findActor &&
                    correctController &&
                    (!correctSensor || !findSensor)
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    feedback.create('mal');
                } else if (
                    findActor &&
                    !correctController &&
                    (correctSensor || findSensor)
                ) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else if (!findActor && (correctSensor || findSensor)) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][4]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][5]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                }
                break;
            case 'Caso7':
                for (let i = 0; i < currentObjectArray.length; i++) {
                    objectArray.forEach(function (item) {
                        if (item[2] === currentObjectArray[i]) {
                            type = item[1];
                            if (type === 'Elementos de Salida') {
                                amountInItem.push(item);
                            }
                        }
                    });

                    console.log(
                        `Valor para: sendConveyorBelt -> VerifyMission -> type`,
                        type
                    );
                    switch (type) {
                        case 'Elementos de Entrada':
                            findSensor = SendConveyorGame.missionArray[
                                idMission
                            ][1][0].every(
                                (element) => currentObjectArray.indexOf(element) > -1
                            );
                            break;
                        case 'Elementos de Salida':
                            findActor = SendConveyorGame.missionArray[
                                idMission
                            ][1][2].every(
                                (element) => currentObjectArray.indexOf(element) > -1
                            );
                            break;
                        case 'Elementos de Control':
                            if (
                                SendConveyorGame.missionArray[idMission][1][1].length > 1
                            ) {
                                correctController = true;
                            } else {
                                if (
                                    currentObjectArray[i] ===
                                    SendConveyorGame.missionArray[idMission][1][1][0]
                                ) {
                                    correctController = true;
                                } else {
                                    correctController = false;
                                }
                                break;
                            }
                    }
                }

                if (findActor && correctController && findSensor) {
                    feedback.messages = {
                        bien: [SendConveyorGame.feedbackArray[idMission][0]],
                        mal: [''],
                    };
                    feedback.create('bien');
                    SendConveyorGame.SetMission(box);
                    amountCorrectMission = amountCorrectMission + 1;
                } else if (!findSensor && correctController && findActor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][1]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else if (findSensor && correctController && !findActor) {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][2]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                } else {
                    feedback.messages = {
                        bien: [''],
                        mal: [SendConveyorGame.feedbackArray[idMission][3]],
                    };
                    feedback.create('mal');
                    SendConveyorGame.SetMission(box);
                }

                break;
        }

        missionTex.innerHTML = `Pedidos Completados: ${amountCorrectMission}`;
        if (amountCorrectMission === 5) {
            SendConveyorGame.EndGame();
        }
    }

    UpdateList(idElement, status = 'added') {
        let boxActive = document.querySelectorAll(`#box${idElement} .item`);
        let modalElement = document.querySelector(`#myPopup${idElement}`);
        let arrElementa = [];

        if (status == 'added') {
            modalElement.querySelector('UL') != null
                ? modalElement.querySelector('UL').remove()
                : null;

            let ulActive = document.createElement('ul');

            boxActive.forEach((element) => {
                let txtLi = element.getAttribute('id');
                let liActive = document.createElement('li');
                liActive.innerHTML = txtLi;
                ulActive.appendChild(liActive);
                arrElementa.push(` ${txtLi}`);
            });

            ariaLiveAssertive.innerHTML = `Se ha añadido un elemento el listado contiene: ${arrElementa.length}, elementos, estos son: ${arrElementa}`;

            modalElement.appendChild(ulActive);
        } else {
            modalElement.querySelector('UL') != null
                ? modalElement.querySelector('UL').remove()
                : null;
        }
    }

    EndGame(box) {
        dialogmodal.open();
        amountCorrectMission = 0;
    }
}
