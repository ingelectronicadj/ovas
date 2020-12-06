let tf = null;
const trueOrFalse = {
    context: null,
    answers: null,
    tf_cb: false,
    onChecking: (e, tf_value) => {
        let index = parseInt(e.target.getAttribute('index'));
        let isGood = window.ova.checkActivity(
            e.target,
            tf.answers[index] == tf_value,
            'bien',
            'mal'
        );
        if (isGood) {
            e.target.parentElement.parentElement.classList.add('icon-u-good');
            e.target.parentElement.parentElement.classList.remove('icon-u-wrong');
        } else {
            e.target.parentElement.parentElement.classList.add('icon-u-wrong');
            e.target.parentElement.parentElement.classList.remove('icon-u-good');
        }
        if (tf.tf_cb) {
            tf.tf_cb(isGood);
        }
    },
    initialize: (context, answers, tf_cb = false) => {
        tf = trueOrFalse;
        tf.context = document.querySelector(context);
        tf.answers = answers;
        tf.tf_cb = tf_cb;
    },
};
