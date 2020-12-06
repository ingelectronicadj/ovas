const SelectImg = (arr_elemts, container_id) => {
    let imgElement = document.querySelector('#' + container_id + ' img');
    let groups = [...document.querySelectorAll('#' + container_id + ' .c-item')];
    let selectElm = document.querySelector('#' + container_id + ' select');
    let caption = document.querySelector('#' + container_id + ' .caption');
    let feedback = document.querySelector('#' + container_id + ' .feedback');
    let btnNext = document.querySelector('#' + container_id + ' .btnNext');
    let btnCheck = document.querySelector('#' + container_id + ' .btnCheck');
    let counter = 1;
    ova.focuser(document.querySelector('#' + container_id + ' P'));

    const CheckAnswer = () => {
        let dataImg = imgElement.getAttribute('data');
        let altImg = imgElement.getAttribute('alt');
        let feedBackTxt = 'CORRECTO! ' + arr_elemts[counter - 1].name + ' corresponde a ' + groups[selectElm.value].firstElementChild.innerText.toLowerCase();
        ova.focuser(feedback);

        if (dataImg == parseInt(selectElm.value) + 1) {
            if (counter < arr_elemts.length) {
                btnNext.setAttribute('hidden', false);
            } else {
                ova.focuser(groups[0].parentElement);
            }
            btnCheck.setAttribute('hidden', 'hidden');
            feedback.firstElementChild.innerHTML = feedBackTxt;
            groups[selectElm.value].innerHTML += ' - ' + arr_elemts[counter - 1].name;
            selectElm.setAttribute('disabled', 'disabled');
        } else {
            feedback.firstElementChild.innerHTML = 'INCORRECTO! ' + arr_elemts[counter - 1].name + ' NO corresponde a ' + groups[selectElm.value].firstElementChild.innerText.toLowerCase();
        }
    };

    const onClickNext = () => {
        ova.focuser(imgElement);
        selectElm.removeAttribute('disabled');
        selectElm.selectedIndex = 0;
        feedback.firstElementChild.innerHTML = '';
        counter++;
        imgElement.setAttribute('src', 'assets/images/slide12_' + counter + '.png');

        imgElement.setAttribute(
            'alt',
            arr_elemts[counter - 1].name +
            ', término ' +
            counter +
            ' de ' +
            arr_elemts.length
        );
        caption.innerHTML = `<span>Imagen ${counter}: </span> ${
            arr_elemts[counter - 1].name
            }</i>`;
        feedback.setAttribute('tabindex', '-1');
        imgElement.setAttribute('data', arr_elemts[counter - 1].data);
        btnNext.setAttribute('hidden', 'hidden');
        btnCheck.removeAttribute('hidden');
    };
    btnCheck.addEventListener('click', CheckAnswer);
    btnNext.addEventListener('click', onClickNext);
};
