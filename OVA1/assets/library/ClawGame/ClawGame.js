class ClawGame {
    constructor(i) {
        this.initialize = this.initialize.bind(this);
        // alert(i);
    }
    initialize() {
        const $ball = document.querySelectorAll('.ball');

        console.log($ball);

        $ball.forEach((element) => {
            console.log(element);

            element.addEventListener('click', (e) => {
                const $el = e.target;
                const $claw = document.querySelector('.claw');
                const $ballData = e.target.dataset.ball;
                console.log(e.target);
                console.log(e.target.dataset.ball);

                $claw.classList.add(`object_${$ballData}`);

                setTimeout(() => {
                    $claw.classList.remove(`object_${$ballData}`);
                }, 5000);
            });
        });
    }

    getElement() {}
}
