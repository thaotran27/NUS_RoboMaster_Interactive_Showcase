// Keyboard input with customisable repeat (set to 0 for no key repeat)
function KeyboardController() {
    // Lookup of key codes to timer ID, or null for no repeat
    window.keyTimers = {};
    var keys = new Set(["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", " "]);
    var keysPressed = {};

    var repeatTime = 200;

    document.onkeydown = function(event) {
        // Filter out all other keys
        if (!keys.has(event.key)) {
            return true;
        }

        // Execute if our key is being pressed for the first time.
        if (!(event.key in window.keyTimers)) {
            window.keyTimers[event.key] = null;
            keysPressed[event.key] = true;
            sendKeys();
            
            window.keyTimers[event.key] = setInterval(function() {
                keysPressed[event.key] = true;
                sendKeys();
            }, repeatTime);
        }
    }

    document.onkeyup = function(event) {
        // Execute if our key was previously being repeated
        if (event.key in window.keyTimers) {
            if (window.keyTimers[event.key] !== null) {
                clearInterval(window.keyTimers[event.key]);
            }
            delete window.keyTimers[event.key];
            delete keysPressed[event.key];
            sendKeys();
        }
    }

    var sendKeys = function() {
        try {
            window.rtcDataChannel.send(JSON.stringify(keysPressed));
        } catch (e) {
            //console.log(e);
            // Silent exception handling lmao
        }
    }

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    window.onblur = function() {
        for (var key in window.keyTimers)
            if (window.keyTimers[key] !== null)
                clearInterval(window.keyTimers[key]);
        window.keyTimers= {};
    };
};

export default KeyboardController;
