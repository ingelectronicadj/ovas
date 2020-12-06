let etw;
const exportDocument = {
    html: null,
    fileName: null,
    context: null,
    arr_questions: null,
    image: null,
    draw_html: () => {
        etw.html =
            "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Exportando</title></head><body>";

        etw.html += '<h3 style="text-align: center">' + etw.fileName + '</h3><br>';

        etw.arr_questions.forEach(function (question) {
            let ask = question.querySelector('.js-ask');
            let arr_subAsks = question.querySelectorAll('.js-subAsk');
            etw.html += '<strong>' + ask.innerText + '</strong><br><br>';

            if (arr_subAsks.length > 0) {
                etw.html += '<ol type="a">';

                arr_subAsks.forEach(function (subAsk) {
                    let arr_answers = subAsk.querySelectorAll('.js-answer');

                    etw.html +=
                        '<li><strong>' +
                        subAsk.querySelector('.js-title-subAws').innerHTML +
                        ':</strong></li>';

                    etw.html += '<ul>';

                    arr_answers.forEach(function (answer) {
                        if (answer.value != '') {
                            etw.html += '<li>' + answer.value + '</li>';
                        }
                    });

                    etw.html += '</ul>';
                });
                etw.html += '</ol>';
            } else {
                let arr_answers = ask.querySelectorAll('.js-answer');
                arr_answers.forEach(function (answer) {
                    if (answer.value != '') {
                        etw.html +=
                            '<strong>Respuesta: </strong> ' + answer.value + '<br><br>';
                    }
                });
            }
        });
        if (etw.image != false)
            etw.html += etw.context.querySelector('.js-image-print').outerHTML;

        etw.html += '</body></html>';

        let blob = new Blob(['\ufeff', etw.html], {
            type: 'application/msword',
        });
        // Especificar URL del enlace.
        let url =
            'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(etw.html);
        // Especificar Nombre del archivo.
        filename = etw.fileName ? etw.fileName + '.doc' : 'document.doc';
        // Crear elemento de enlace de descarga.
        let downloadLink = document.createElement('a');

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Crea un enlace al archivo
            downloadLink.href = url;
            // Establecer el nombre del archivo
            downloadLink.download = filename;
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);
    },
    create_image: () => {},
    initialize: (fileName, context, image = false) => {
        etw = exportDocument;
        etw.fileName = fileName;
        etw.context = document.querySelector(context);
        etw.arr_questions = etw.context.querySelectorAll('.js-print');
        etw.image = image;

        if (image != false) {
            let imgChange = document.querySelectorAll(`.${image}`);
            // console.log('Valor para: imgChange', imgChange);

            let getBase64Image = (image) => {
                let canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                let dataURL = canvas.toDataURL();
                // console.log('Valor para: getBase64Image -> dataURL', dataURL);
                return dataURL;
            };
            setTimeout(function () {
                imgChange.forEach((img) => {
                    let base64 = getBase64Image(img);
                    img.src = base64 == 'data:,' ? getBase64Image(img) : base64;
                });
            }, 3000);
        }
    },
};
