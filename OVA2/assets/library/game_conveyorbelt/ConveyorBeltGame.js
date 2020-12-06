let actionReturn;
let modalReturn;
let isWarningBack, isReturningGame, isEndingGame;
let arrayIndexobject;
let intervaloObjects;
const area = document.getElementById('area')
const belt = document.getElementById('banda')
const outButton = document.getElementById('Out-Button');
const inButton = document.getElementById('In-Button');
const mixButton = document.getElementById('Mix-Button');
const startbutton = document.getElementById('startbutton')
const helpButton = document.getElementById('help-Button');
const score = document.getElementById('score-div');
const Errors = document.getElementById('errors-div');
const attemps = document.getElementById('attemps-div');
let popup = document.getElementById("myPopup");
let buttonModalYes = document.getElementById('buttonModalYes');
let buttonModalNo = document.getElementById('buttonModalNo');
var dialogmodal = new ovaDialog('modal');

class ConveyorBeltGame {

    constructor(objectArray, tries) {
        this.objectArray = objectArray;
        this.tries = tries;
        this.totalScore = 0;
        this.totalAttemps = 0;
        this.totalMistakes = 0;
        this.objectPosition = 0;
        this.counter = 0;
    }

    StartGame(amount) {
        isWarningBack = false
        isEndingGame = false
        isReturningGame = false
        ConveyorGame.SendObject();
    }

    SendObject() {
        startbutton.disabled = true;
        arrayIndexobject = ConveyorGame.GenerateValue(0, ObjectArray.length - 1);
        ConveyorGame.SetObject();
        ConveyorGame.MovementObject();
    }

    SetObject() {
        let Object = document.createElement('div');
        Object.setAttribute('id', ObjectArray[arrayIndexobject][0]);
        Object.setAttribute('action', ObjectArray[arrayIndexobject][1]);
        Object.classList = "item";
        Object.style.left = "80%";
        Object.style.backgroundImage = `url('assets/images/slide7_2_${arrayIndexobject}.png')`;
        belt.appendChild(Object);
    }

    DestroyObject() {
        let currentObject = document.getElementById(ObjectArray[arrayIndexobject][0]);
        belt.removeChild(currentObject)

    }

    MovementObject() {
        outButton.disabled = true;
        mixButton.disabled = true;
        inButton.disabled = true;
        ConveyorGame.objectPosition = 80;
        let currentObject = document.getElementById(ObjectArray[arrayIndexobject][0]);
        let intervalo = setInterval(function() {
            ConveyorGame.objectPosition = ConveyorGame.objectPosition - 1;
            currentObject.style.left = `${ConveyorGame.objectPosition}%`;
            if (ConveyorGame.objectPosition === 40) {
                clearInterval(intervalo);
                outButton.disabled = false;
                mixButton.disabled = false;
                inButton.disabled = false;
            }
        }, 50);
    }

    MoveBack(){
        return new Promise(resolve => {
            let currentObject = document.getElementById(ObjectArray[arrayIndexobject][0]);
            let intervaloOut = setInterval(function() {
                ConveyorGame.objectPosition = ConveyorGame.objectPosition - 1;
                currentObject.style.left = `${ConveyorGame.objectPosition}%`;
                if (ConveyorGame.objectPosition === 0) {
                    clearInterval(intervaloOut);
                    ConveyorGame.DestroyObject();
                    resolve(intervaloOut);
                }
            }, 50);
        });
    }

    async DoAction() {
        let objectAction = ObjectArray[arrayIndexobject][1];
        let verify = await ConveyorGame.MoveBack();

        if (objectAction === actionReturn) {
            ConveyorGame.totalScore = ConveyorGame.totalScore + 20;
            ConveyorGame.totalAttemps = ConveyorGame.totalAttemps + 1;
            score.innerHTML = `${ConveyorGame.totalScore}`;
            attemps.innerHTML = `${ConveyorGame.totalAttemps}`;
            
        } else {
            ConveyorGame.totalMistakes++;
            ConveyorGame.totalAttemps++;
            Errors.innerHTML = `${ConveyorGame.totalMistakes}`;
            attemps.innerHTML = `${ConveyorGame.totalAttemps}`;
        }
        
        if (ConveyorGame.totalMistakes === 3 && !isWarningBack) {
            
            isWarningBack = true
            isReturningGame = true;
            dialogmodal.open();

            buttonModalYes.addEventListener("click",function(){
                isWarningBack = true;
                isReturningGame = true;
                dialogmodal.close(); 
                ConveyorGame.SendObject();
            });

            buttonModalNo.addEventListener("click",function(){
                ConveyorGame.EndGame();
                feedback.create('mal');
                dialogmodal.close();
            });
        } else if(verify && (ConveyorGame.totalScore !== 200 && ConveyorGame.totalMistakes !== 6)){
            ConveyorGame.SendObject();
        }
      
        if (ConveyorGame.totalMistakes === 6) {
            isEndingGame = true
            ConveyorGame.EndGame();
            feedback.create('mal');
        }

        if (ConveyorGame.totalScore === 200) {
            isEndingGame = true;
            ConveyorGame.EndGame();
            feedback.create('bien');
        }


      /* if( && ){
            setTimeout(, 5000);
        }*/

    }

    GenerateValue(max, min) {
        return Math.round(Math.random() * (max - min) + min)
    }

    EndGame() {
        ConveyorGame.totalMistakes = 0;
        ConveyorGame.totalAttemps = 0;
        ConveyorGame.totalScore = 0;
        score.innerHTML = `${ConveyorGame.totalScore}`;
        attemps.innerHTML = `${ConveyorGame.totalAttemps}`;
        Errors.innerHTML = `${ConveyorGame.totalMistakes}`;
        startbutton.disabled = false;
    }

    HelpAction() {
        popup = document.getElementById("myPopup");
        popup.classList.toggle("show");
        let Object = this.objectArray[arrayIndexobject];
        if (Object === undefined) {
            popup.innerHTML = "No hay objecto actual";
        } else {
            popup.innerHTML = Object[2];
        } 
      
    }

}