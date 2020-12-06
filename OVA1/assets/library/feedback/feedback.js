/**
 * feddback.initialize({
        {
            bien:[],
            mal:[]
        },
        context: document.querySelector('.foo'),
        multimedia:{
            imagen: null,
            audio: [{ type:'bien',  name: 'audio_2', id:'3', drag: true }, { type:'mal',  name: 'audio_2', id:'3', drag: true }, { type:'otro',  name: 'audio_2', id:'3', drag: true }],
            video: null
        }, index: 0
    })
 * */

const feedback = {
    messages: null,
    context: null,
    image_name: null,
    audio_name: null,
    index: 0,
    initialize: (messages, context, image_name = null, audio_name = null) => {
        feedback.messages = messages;
        feedback.context = context;
        feedback.image_name = image_name;
        feedback.audio_name = audio_name;
    },
    delete: () => {
        let parent = event.target.parentElement;
        parent.setAttribute('aria-hidden', 'true');
        ariaLivePolite.innerText = 'Ha cerrado el feedback.';
        window.ova.focuser(feedback.context);
    },
    give: (isGood) => {
        let feedbackElem = document.createElement('div');
        let feedexist = feedback.context.querySelector('.feedback');

        feedbackElem.classList.add('feedback');

        if (feedexist) {
            feedback.context.removeChild(feedexist);
        }

        let message = `<button class="icon-u-wrong feedback-button close-multiplicacion" aria-label="cerrar feedback" Onclick="feedback.delete(event)" tabindex="0" > </button>`;

        if (feedback.image_name != null) {
            message += `<figure>
                            <img src="assets/images/${
                                feedback.image_name + isGood
                            }.png" alt="Respuesta ${isGood}" tabindex="0">
                        </figure>`;
        }
        message += `<div class="feedMessage ${isGood}" tabindex="0">`;
        if (feedback.audio_name != null) {
            // const name = multimedia.audio
            message += `<audio controls>
                            <source src="assets/audios/${
                                feedback.audio_name + isGood
                            }.mp3" type="audio/mpeg">
                        </audio>`;
        }
        message += `<p>
                <b>Respuesta ${isGood === 'bien' ? 'correcta' : 'incorrecta'}:</b>
                <span class="feedBackText" id="feedBackText">${
                    feedback.messages[isGood][feedback.index]
                }</span>
            </p>
        </div>`;

        feedbackElem.innerHTML += message;
        feedback.context.appendChild(feedbackElem);
        window.ova.focuser(feedback.context.querySelector('.feedback'));
    },
};

/**
 * newFeedback.init({
        {
            bien:[],
            mal:[]
        },
        context: document.querySelector('.foo'),
        multimedia:{
            imagen: null,
            audio: [{ type:'bien',  name: 'audio_2', id:'3', drag: true }, { type:'mal',  name: 'audio_2', id:'3', drag: true }, { type:'otro',  name: 'audio_2', id:'3', drag: true }],
            video: null
        }, index: 0
    })
 *
 * */
// const newFeedback = {
//     messages: null,
//     context: null,
//     multimedia: {
//         imagen: null,
//         audio: null,
//         video: null,
//     },
//     audio_name: null,
//     index: 0,
//     init: (params) => {
//         newFeedback.messages = params.messages;
//         newFeedback.context = params.context;
//         newFeedback.multimedia.image = params.multimedia.images
//             ? params.multimedia.images
//             : null;
//         newFeedback.multimedia.audio = params.multimedia.audios
//             ? params.multimedia.audios
//             : null;
//         newFeedback.multimedia.video = params.multimedia.videos
//             ? params.multimedia.videos
//             : null;

//         console.log('newFeedback.multimedia.image', newFeedback.multimedia.image);
//     },
//     delete: () => {
//         let parent = event.target.parentElement;
//         parent.setAttribute('aria-hidden', 'true');
//         ariaLivePolite.innerText = 'Ha cerrado el feedback.';
//         window.ova.focuser(newFeedback.context);
//     },
//     give: (responseUser) => {
//         let feedbackElem = document.createElement('div');
//         let feedexist = newFeedback.context.querySelector('.feedback');

//         feedbackElem.classList.add('feedback');

//         if (feedexist) {
//             newFeedback.context.removeChild(feedexist);
//         }

//         let message = `<button class="icon-u-wrong feedback-button close-multiplicacion" aria-label="cerrar feedback" Onclick="feedback.delete(event)" tabindex="0" > </button>`;

//         if (newFeedback.multimedia.image.length > 0) {
//             message += `<figure>
//                             <img src="assets/images/${
//                                 newFeedback.multimedia.image[newFeedback.index].name
//                             }${
//                 newFeedback.multimedia.image[newFeedback.index].type
//             }" alt="Respuesta ${responseUser}" tabindex="0">
//                         </figure>`;
//         }
//         message += `<div class="feedMessage ${responseUser}" tabindex="0">`;
//         if (newFeedback.multimedia.audio.length > 0) {
//             // const name = multimedia.audio
//             message += `<audio controls>
//                             <source src="assets/audios/${
//                                 newFeedback.multimedia.audio[newFeedback.index].name
//                             }_${responseUser}.mp3" type="audio/mpeg">
//                         </audio>

//             <span class="c-content-video draggable-video" video-accesibility="video-accesibility">
//                             <div class="c-video">
//                                 <div class="video c-video_multimedia on-pause" data-state="m">
//                                     <video class="c-video_multimedia-video" id="${
//                                         newFeedback.index
//                                     }_video_drag
//             " poster="assets/images/poster_video.png" aria-hidden="true">
//                                         <source src="assets/videos/${
//                                             newFeedback.multimedia.audio[
//                                                 newFeedback.index
//                                             ].nameDrag
//                                         }_${responseUser}.mp4" type="video/mp4">
//                                     </video>
//                                     <div class="content-controls c-video_controls" id="controlbar_2">
//                                         <div class="controls"><button class="button-control c-video_controls-play icon-u-play" id="control_2" aria-label="botón para reproducir video"></button><button class="button-muted c-video_controls-mute icon-u-volume-up" id="muted_2" aria-label="botón para silenciar video"></button><input class="bar-audio c-video_controls-volume" id="volume_2" type="range" value="1" step="any" aria-label="Barra de control de volumen de video." max="1"><span class="c-video_timer" id="time_2">00:00</span><input class="bar-video c-video_controls-time" id="range_2" type="range" value="0" step="any" aria-label="Barra de control de tiempo de video." max="18.819"><button class="button-text icon-u-book c-video_controls-caption" id="caption_2" aria-label="botón para habilitar subtitulos de video"></button><button class="button-screen icon-u-fullscreen c-video_controls-fullscreen" id="screen_2" aria-label="botón para poner el video en pantalla completa"></button></div>
//                                     </div>
//                                 </div>
//                                 <div class="contain-text c-video_subtitles" id="subtitles_2">
//                                     <div class="c-video_subtitles-draggable ui-draggable ui-draggable-handle">
//                                         <div class="c-video_subtitles-heading">
//                                             <h6 class="c-video_subtitles-heading-txt">Subtítulos</h6>
//                                             <div class="c-video_subtitles-toggle-drag">
//                                                 <div class="c-video_subtitles-toggle-drag--control"><input type="checkbox" id="videoToggleDrag" name="video_toggle-draggable" value="none" checked="checked"><label for="videoToggleDrag"></label></div>
//                                             </div>
//                                         </div>
//                                         <div class="c-video_subtitles-cues js-video_subtitle"></div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </span>`;

//             console.log('Valor para: message', message);
//         }
//         message += `<p>
//                 <b>Respuesta ${responseUser === 'bien' ? 'correcta' : 'incorrecta'}:</b>
//                 ${newFeedback.messages[responseUser][newFeedback.index]}
//             </p>
//         </div>`;

//         feedbackElem.innerHTML += message;
//         newFeedback.context.appendChild(feedbackElem);
//         window.ova.focuser(newFeedback.context.querySelector('.feedback'));
//     },
// };
