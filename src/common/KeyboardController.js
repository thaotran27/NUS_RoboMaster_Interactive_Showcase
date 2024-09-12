// Keyboard input with customisable repeat (set to 0 for no key repeat)
class KeyboardController {

    constructor() {
        this.keyTimers = {}; // Lookup of key codes to timer ID, or null for no repeat
        this.keys = new Set(["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", " "]);
        this.keysPressed = {};
        this.repeatTime = 200; // Determined how fast key repeat events are sent

        // When window is unfocused we may not get key events. To prevent
        // causing a key to 'get stuck down', cancel all held keys
        window.onblur = function () {
            for (var key in this.keyTimers)
                if (this.keyTimers[key] !== null)
                    clearInterval(this.keyTimers[key]);
            this.keyTimers = {};
        };
    }

    start() {
        const keyDownFunc = (event) => {
            // Filter out all other keys
            if (!this.keys.has(event.key)) {
                return true;
            }

            // Execute if our key is being pressed for the first time.
            if (!(event.key in this.keyTimers)) {
                this.keysPressed[event.key] = true;
                this.keyPressCallback(this.keysPressed);

                this.keyTimers[event.key] = setInterval(() => {
                    this.keysPressed[event.key] = true;
                    this.keyPressCallback(this.keysPressed);
                }, this.repeatTime);
            }
        }

        const keyUpFunc = (event) => {
            // Execute if our key was previously being repeated

            if (event.key in this.keyTimers) {
                clearInterval(this.keyTimers[event.key]);
                delete this.keyTimers[event.key];
                delete this.keysPressed[event.key];
                this.keyPressCallback(this.keysPressed);
            }
        }

        document.onkeydown = keyDownFunc;
        document.onkeyup = keyUpFunc;
    }


    stop() {
        document.onkeydown = null;
        document.onkeyup = null;
        for (var key in this.keyTimers)
            if (this.keyTimers[key] !== null)
                clearInterval(this.keyTimers[key]);
        this.keyTimers = {};
    }


    setKeyPressCallback(callback) {
        this.keyPressCallback = callback;
    }
}



const keyboardController = new KeyboardController();
export default keyboardController;
