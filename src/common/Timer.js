class Timer {
    constructor(countdownCallback, duration) {
        this.countdownCallback = countdownCallback; // This is a useState setter to set the current timer value
        this.timeLeft = duration;
        this.innerTimer = undefined;
    }

    start() {
        this.innerTimer = setInterval(() => {
            if (timeLeft === 0) {
                clearInterval(this.innerTimer);
                return;
            }
            this.timeLeft -= 1;
            this.countdownCallback(this.timeLeft);
        }, 1000);
    }

    stop() {
        clearInterval(this.innerTimer);
    }
}

export default Timer;