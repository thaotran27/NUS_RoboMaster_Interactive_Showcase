// Keyboard input with customisable repeat (set to 0 for no key repeat)
function KeyboardController() {
    // Lookup of key codes to timer ID, or null for no repeat
    window.keyTimers = {};
    var keys = new Set(["w", "a", "s", "d", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "e"]);
    var keysPressed = {};

    var repeatTime = 20;

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

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    /*document.onkeydown= function(event) {
        var key= (event || window.event).key;
        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key]= null;
            keys[key]();
            if (repeat!==0)
                timers[key]= setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    document.onkeyup= function(event) {
        var key= (event || window.event).key;
        if (key in timers) {
            if (timers[key]!==null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };
    */
};

export default KeyboardController;
