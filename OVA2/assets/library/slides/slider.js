let sl = null;
const slider = {
    callback: null,
    numSlides: 1,
    scope: null,
    changeAudioAndVideo: (index) => {
        let containerAudio =
            document.querySelector('.audio') == null
                ? false
                : document.querySelector('.audio');
        if (containerAudio) {
            let sourceAudio = containerAudio.childNodes[0];
            let splitSourceAudio = sourceAudio.src.split('accesibility_');
            let containerAud = document.querySelector('.c-content-audio');
            let newAudio = document.createElement('AUDIO');
            newAudio.classList.add('audio');
            JSON.parse(localStorage.getItem('obj_settings'))['accesiblity'] == 2
                ? ''
                : newAudio.classList.add('hide');
            newAudio.setAttribute('controls', 'controls');
            newAudio.setAttribute('audio-accesibility', 'audio-accesibility');
            let newSourceAudio = document.createElement('SOURCE');
            newSourceAudio.setAttribute('type', 'audio/mpeg');
            newAudio.appendChild(newSourceAudio);
            containerAud.appendChild(newAudio);
            containerAud.removeChild(containerAudio);
            newSourceAudio.setAttribute(
                'src',
                `${splitSourceAudio[0]}accesibility_${index}.mp3`
            );

            //? Se Crea el track para el audio.
            let track = document.createElement('TRACK');
            track.setAttribute('src', `${splitSourceAudio[0]}accesibility_${index}.vtt`);
            track.setAttribute('kind', 'captions');
            track.setAttribute('srclang', 'es');
            newAudio.appendChild(track);
        }

        //? Video.
        let video =
            document.querySelector('.video') == null
                ? false
                : document.querySelector('.video');
        if (video) {
            let sourceVideo =
                video.querySelector('#video_1') == null
                    ? false
                    : video.querySelector('#video_1');
            let newSourceVideo = sourceVideo.childNodes[0].src.split('accesibility_');
            let iconPlay = document.querySelector('#control_1');
            iconPlay.classList.replace('icon-u-pause', 'icon-u-play');
            sourceVideo.childNodes[0].src = `${newSourceVideo[0]}accesibility_${index}.mp4`;
            video.classList.add('on-pause');
            sourceVideo.load();
        }
    },
    open: (index) => {
        let i = index + 1;
        let currentSlide = $('.tabContent').eq(index);
        let containerAudio =
            document.querySelector('.audio') == null
                ? false
                : document.querySelector('.audio');
        let containerVideo =
            document.querySelector('.c-content-video') == null
                ? false
                : document.querySelector('.c-content-video');

        $('.tabContent').hide();
        $('.tabContent').removeClass('currentSlide');
        currentSlide.addClass('currentSlide');
        currentSlide.focus();
        currentSlide.fadeIn();

        if (index == sl.numSlides - 1) {
            btnNext.setAttribute('disabled', 'disabled');
            btnNext.classList.add('hidden');
        } else if (index + 1 < sl.numSlides) {
            btnNext.removeAttribute('disabled');
            btnNext.classList.remove('hidden');
        }

        if (index == 0) {
            btnBack.setAttribute('disabled', 'disabled');
            btnBack.classList.add('hidden');
        } else {
            btnBack.removeAttribute('disabled');
            btnBack.classList.remove('hidden');
        }

        if (
            containerAudio != false
                ? containerAudio.classList.contains('hide')
                : false && containerVide != false
                ? containerVideo.classList.contains('hide')
                : false
        ) {
            window.ova.focuser(document.querySelector('.num-slide'));
        } else {
            window.ova.focuser(document.querySelector('#saltarContenido'));
        }

        indexSlider.innerHTML = i + '/' + sl.numSlides;
        ariaLivePolite.innerHTML = 'actividad' + i + ' de ' + sl.numSlides;
        sl.changeAudioAndVideo(i);
        if (sl.callback != null) {
            sl.callback({ index: index, currentSlide: currentSlide[0] });
        }
    },
    initialize: (callback = null, scope = '#ova_slider') => {
        sl = slider;
        sl.callback = callback;
        sl.scope = document.querySelector(scope);
        sl.numSlides = sl.scope.querySelectorAll('.tabContent').length;

        btnNext.addEventListener('click', () => {
            sl.open($('.currentSlide').index());
        });

        btnBack.addEventListener('click', () => {
            sl.open($('.currentSlide').index() - 2);
        });

        sl.open(0);

        const typeRadio = document.querySelectorAll('.c-input_radio');
        const options = document.querySelectorAll('.answers .option');
        const typeBs = document.querySelectorAll('.answers .option b');
        const answers = document.querySelectorAll('.answers');

        if (typeRadio.length > 0) {
            typeRadio.forEach((label) => {
                const text = label.lastChild.textContent;
                label.setAttribute('aria-label', text);
            });
            options.forEach((option) => {
                option.removeAttribute('tabindex');
            });
            typeBs.forEach((typeb) => {
                typeb.removeAttribute('tabindex');
            });
            answers.forEach((answer) => {
                answer.removeAttribute('tabindex');
            });
        }
    },
};
