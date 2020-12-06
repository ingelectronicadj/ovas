// class MindMaps {
//     constructor (i) {

//     }
//     initialize (i) {

//     }
// }
function mindMaps() {
    // return alert('aaaaa');
    var grad = 0;
    let newDiv, newContent;

    $('.contenedor').mouseenter((e) => {
        $('.contenedor div').mouseenter((e) => {
            e.originalEvent.target.classList.add('hovered');
        });
        $('.contenedor div').mouseleave((e) => {
            $('.contenedor div').removeClass('hovered');
        });
    });
    document.addEventListener('click', (e) => {
        const $context = document.querySelector('.currentSlide');
        const $galeria = $context.querySelector('.galeria');
        const $arrows = $context.querySelector('.arrows');
        const $contenedor = $context.querySelector('.contenedor');
        if (e.target.parentNode === $galeria || e.target.parentNode === $arrows) {
            newDiv = document.createElement(e.target.tagName);

            let $input = document.createElement('textarea');
            newDiv.classList = `${e.target.classList} drag`;
            $contenedor.appendChild(newDiv).appendChild($input).value =
                e.target.innerHTML;
            drag();
        } else if (e.target.parentNode === $contenedor) {
            grad = grad < 315 ? grad + 45 : 0;
            if (e.target.classList.contains('rotable')) {
                rotateFn(e.target, grad);
            } else {
                e.target.setAttribute('contenteditable', 'true');
            }
        }
    });

    const $mapsContainer = document.querySelector('.mapsContainer');
    $mapsContainer.addEventListener('click', (e) => {
        const $context = document.querySelector('.currentSlide');
        const $contenedor = $context.querySelector('.contenedor');
        $contenedor.style.backgroundImage = `linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5)), url(${e.target.attributes.src.value})`;
    });

    const $cleanBtn = document.getElementById('clean');
    $cleanBtn.addEventListener('click', (e) => {
        const $context = document.querySelector('.currentSlide');
        const $contenedor = $context.querySelector('.contenedor');
        $contenedor.style.backgroundImage = '';
    });

    function rotateFn(el, grads) {
        el.style.transform = 'rotate(' + grads + 'deg)';
    }

    function drag() {
        $('.drag').draggable();
    }
}
