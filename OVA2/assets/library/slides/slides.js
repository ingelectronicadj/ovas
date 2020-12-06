const slider = (numSlides, scopeElm = null, cb) => {
    const callback = cb ? cb.bind(cb) : null;
    const sliderContainer = scopeElm
        ? scopeElm.querySelector('.ova_slider-content')
        : null;
    const currentSlider = sliderContainer.querySelectorAll('.tabContent');
    const triggerCallBack = (i) => {
        if (callback) {
            callback({ index: i, currentSlider });
        }
    };
    let indexSlider = document.getElementById('indexSlider');
    let btnNext = document.getElementById('btnNext');
    let btnBack = document.getElementById('btnBack');
    btnBack.classList.add('hidden');
    let btnStart = document.getElementById('btnStart');
    let reader = document.querySelector('#ariaLivePolite');
    const typeRadio = document.querySelectorAll('.c-input_radio');
    const options = document.querySelectorAll('.answers .option');
    const typeBs = document.querySelectorAll('.answers .option b');
    const answers = document.querySelectorAll('.answers');

    if (numSlides == '1') {
        btnNext.classList.add('hidden');
    }

    $('.tabContent')
        .eq(0)
        .fadeIn();
    $('.tabContent')
        .eq(0)
        .addClass('currentSlide');
    indexSlider.innerHTML = '1/' + numSlides;
    reader.innerHTML = 'actividad 1 de ' + numSlides;
    /**
     * First callback trigger
     */
    triggerCallBack(0);

    const openTab = (direction) => {
        let beforeTab = $('.currentSlide');
        let index = 0;
        let containerAudio = document.querySelector('.audio');
        let containerVideo = document.querySelector('.c-content-video');

        let changeAudioAndVideo = (indexSlide) => {
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
                `${splitSourceAudio[0]}accesibility_${indexSlide}.mp3`
            );

            //? Se Crea el track para el audio.
            let track = document.createElement('TRACK');
            track.setAttribute(
                'src',
                `${splitSourceAudio[0]}accesibility_${indexSlide}.vtt`
            );
            track.setAttribute('kind', 'captions');
            track.setAttribute('srclang', 'es');
            newAudio.appendChild(track);

            //? Video.
            let video = document.querySelector('.video');
            let sourceVideo = video.querySelector('#video_1');
            let newSourceVideo = sourceVideo.childNodes[0].src.split('accesibility_');
            let iconPlay = document.querySelector('#control_1');
            iconPlay.classList.replace('icon-u-pause', 'icon-u-play');
            sourceVideo.childNodes[0].src = `${newSourceVideo[0]}accesibility_${indexSlide}.mp4`;
            video.classList.add('on-pause');
            sourceVideo.load();
        };
        if (direction == 'next') {
            index = beforeTab.index();
        } else {
            index = beforeTab.index() - 2;
        }
        changeAudioAndVideo(index + 1);
        if (
            containerAudio.classList.contains('hide') &&
            containerVideo.classList.contains('hide')
        ) {
            window.ova.focuser(document.querySelector('.num-slide'));
        } else {
            window.ova.focuser(document.querySelector('#saltarContenido'));
        }
        reader.innerHTML = 'actividad ' + (index + 1) + ' de ' + numSlides;
        document.getElementById('indexSlider').innerHTML = index + 1 + '/' + numSlides;
        /**
         * Callback trigger
         */

        if (index == numSlides - 1) {
            btnNext.setAttribute('disabled', 'disabled');
            btnNext.classList.add('hidden');
        } else if (index + 1 < numSlides) {
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

        $('.tabContent').hide();
        $('.tabContent').removeClass('currentSlide');
        $('.tabContent')
            .eq(index)
            .addClass('currentSlide');
        $('.tabContent')
            .eq(index)
            .get(0)
            .focus();
        $('.tabContent')
            .eq(index)
            .fadeIn();

        if (btnStart) {
            btnNext.classList.add('hidden');
        }
        triggerCallBack(index);
    };

    btnNext.addEventListener('click', () => {
        openTab('next');
    });
    btnBack.addEventListener('click', () => {
        openTab('back');
    });

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            openTab('next');
        });
        btnNext.classList.add('hidden');
    }

    if (typeRadio.length > 0) {
        typeRadio.forEach((label) => {
            let text = label.lastChild.textContent;
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
};
