class Feedback {
    /**
     *
     * @param {*} messages
     * @param {*} game
     * @param {*} time
     * @param {*} context
     * @param {*} image_name
     * @param {*} audio_name
     */
    constructor(messages, game, time, context, slide, image_name, audio_name) {
        this.index = 0;
        this.messages = messages;
        this.context = context;
        this.time = time;
        this.slide = slide;
        this.game = game;
        this.image_name = null;
        this.audio_name = null;
    }
    /**
     * Metodo que elimnina el feedback
     */
    delete() {
        let parent = event.target.parentElement;
        parent.setAttribute('aria-hidden', 'true');
        ariaLivePolite.innerText = 'Ha cerrado el feedback.';
        window.ova.focuser(this.context);
    }
    /**
     * Metodo  que crear el feedback en una misma instancia y sin propiedades de personalizacion.
     * recordar nombrar la instancia "feedback" para que el evento de eliminar corresponda.
     * @param {*} answer  //contiene la respuesta del usuario.
     */
    create(answer) {
        let feedbackElem = document.createElement('div'); //crea el elemento div que contendra el feedback.
        let feedExist = this.context.querySelector('.feedback'); //variable que comprueba la existencia de un feedback.
        feedbackElem.classList.add('feedback'); //agrega la clase feedback.
        let message = `<button class="icon-u-wrong feedback-button close-multiplicacion" aria-label="cerrar feedback" Onclick="feedback.delete(event)" tabindex="0" > </button>`;
        message += `<div class="feedMessage ${answer}" tabindex="0">`;

        if (feedExist) {
            //verifica si ya existe un feedback mostrandose y lo remplaza
            this.context.removeChild(feedExist);
        }

        if (this.image_name != null) {
            //establece el valor del la imagen del feedback
            this.getImageName();
        }

        if (this.audio_name != null) {
            //establece el valor del audio del feedback
            this.getAudioName();
        }
        message += `<p>
        <b>Respuesta ${answer === 'bien' ? 'correcta' : 'incorrecta'}:</b>
        ${this.messages[answer][this.index]}
         </p>
        </div>`;
        feedbackElem.innerHTML += message;
        this.context.appendChild(feedbackElem); //agrega el feedback al slider actual
        window.ova.focuser(this.context.querySelector('.feedback')); //realiza focus sobre el feedback
    }
    /**
     * Metodo que crear diversos feedbacks con diferentes propiedades como mensajes personalizados, temporizador para el feedback.
     * recordar nommrar la instancia "feedbackMultiple" para que el evento elminiar corresponda correctamente.
     * @param {*} answer //contiene la respuesta del usuario.
     * @param {*} game  // contiene el slide donde se mostrara el feedback.
     */
    createMultiple(answer, game) {
        let feedbackElem = document.createElement('div'); //crea el elemento div que contendra el feedback.
        let feedExist = this.context.querySelector('.feedback'); //variable que comprueba la existencia de un feedback.
        feedbackElem.classList.add('feedback'); //agrega la clase feedback.
        let selectedSlide = this.selectSlide(); //llama al metodo que selecciona el slide donde se mostrata el mensaje
        if (selectedSlide !== false) {
            game = selectedSlide; //establece el feedback para el correspondiente slide.
            let messagesLength = this.messages.length - 1;
            if (game > messagesLength) {
                // condicional que previene el ingreso de un valor fuera de los indices
                game = 0;
            }
            let message = `<button class="icon-u-wrong feedback-button close-multiplicacion" aria-label="cerrar feedback" Onclick="feedbackMultiple.delete(event)" tabindex="0" > </button>`;
            message += `<div class="feedMessage ${answer}" tabindex="0">`;

            if (feedExist) {
                //verifica si ya existe un feedback mostrandose y lo remplaza
                this.context.removeChild(feedExist);
            }

            if (this.image_name != null) {
                //establece el valor del la imagen del feedback
                this.getImageName();
            }

            if (this.audio_name != null) {
                //establece el valor del audio del feedback
                this.getAudioName();
            }

            message += `<p>
            <b>Respuesta ${answer === 'bien' ? 'correcta' : 'incorrecta'}:</b>
            ${this.messages[game][this.index][answer][this.index]}
             </p>
            </div>`;
            feedbackElem.innerHTML += message;
            this.context.appendChild(feedbackElem); //agrega el feedback al slider actual
            window.ova.focuser(this.context.querySelector('.feedback')); //realiza focus sobre el feedback
        }
    }
    /**
     * metodo que establece el valor del audio del feedback.
     */
    getAudioName() {
        return (message += `<audio controls>
            <source src="assets/audios/${this.audio_name + answer}.mp3" type="audio/mpeg">
            </audio>`);
    }
    /**
     * Metodo que establece el valor de la imagen del feedback.
     */
    getImageName() {
        return (message += `<figure>
                <img src="assets/images/${this.image_name +
                    answer}.png" alt="Respuesta ${answer}" tabindex="0">
                </figure>`);
    }
    /**
     * Metodo que establece  el tiempo que permanecera el feedback en pantalla.
     * el valor que se ingrese al parametro duracion, se realizara en segundos.
     * @param {*} duration //contiene la duracion del feedback
     * @param {*} context  //contiene el contendedor donde se eliminara el feedback
     */

    timer(duration, context) {
        let timer = duration; //establece el contador con la propiedad
        let clock = setInterval(function() {
            if (--timer < 0) {
                let feedExist = context.querySelector('.feedback'); //busca el objeto feedback
                context.removeChild(feedExist); //remueve el feedback
                clearInterval(clock); //despues de acabado el temporizador, detiene el intervalo.
            }
        }, 1000);
    }

    /**
     * Metodo que obtiene el Slide actual y retorna su Index
     */
    getSlide() {
        let tabContent = document.querySelectorAll('.tabContent'); //identifica el tabcontent del slide actual
        let valorIndex = 0; //establece el valor por defecto del index del slide
        tabContent.forEach((element, i) => {
            let validate = element.classList.contains('currentSlide'); //revisa la propiedad currentSlide entre los Slide en el tabContent
            if (validate) {
                valorIndex = i;
            } else {
                valorIndex = this.slide;
            }
        });
        return valorIndex; //retorna el valor del index del Slide
    }
    /**
     * Metodo que selecciona el Slide y retorna el index de los mensajes personalizados a mostrar
     */
    selectSlide() {
        let elementos = this.game; //lista de valores donde se especifica que mensajes iran en cada slide.
        let slide = this.getSlide(); // llamada al metodo que obtiene el slide actual.
        let position = elementos[slide] >= this.messages.length ? 0 : elementos[slide]; // condicional que previene el ingreso de un valor fuera de los indices.
        if (elementos[slide] !== false) {
            //condicional que verifica si se quiere mostrar o no el feedback en el slide.
            let messageIndex = this.messages[position][this.index]['index'][this.index]; //define el index de los mensajes que se van a mostrar.
            this.timer(this.time, this.context); //realiza el llamado del metodo timer para realizar el temporizador del feedback.
            let messagesLength = this.messages.length - 1;
            if (messageIndex > messagesLength) {
                //condicional que previene el ingreso de un valor fuera de los indices
                messageIndex = 0;
            }
            let valorIndex = 0; // inicializa el valor del index del slide en donde se van a mostrar los mensajes personalizados.
            elementos.forEach((element) => {
                if (messageIndex === element) {
                    if (element !== false) {
                        valorIndex = element;
                    } else {
                        valorIndex = 0;
                    }
                }
            });
            return valorIndex; //retorna el valor del index de los mensajes que se van a mostrar
        } else {
            return elementos[slide];
        } // de lo contrario retorna el valor en false, por si no se quiere crear slide
    }
}
