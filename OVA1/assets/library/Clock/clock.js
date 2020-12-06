const clock = {
    seconds: 0,
    minutes: 0,
    clockText: '',
    interval: null,
    initialize: (element) => {
        clock.interval = setInterval(() => {
            clock.seconds++;
            if (clock.seconds >= 60) {
                clock.minutes++;
                clock.seconds = 0;
            }
            if (clock.minutes < 10) {
                clock.clockText = '0';
            }
            clock.clockText += clock.minutes + ':';
            if (clock.seconds < 10) {
                clock.clockText += '0';

            }
            clock.clockText += clock.seconds;

            element.innerHTML = clock.clockText;
        }, 1000)
    },
    stop: () => {
        clock.seconds = 0
        clock.minutes = 0;
        clearInterval(clock.interval);
    }
}