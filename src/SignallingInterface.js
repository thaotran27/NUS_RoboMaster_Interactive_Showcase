
var SignallingServer = (() => {
    var instance;

    function createInstance() {
        instance = new SignallingInterface();
        return instance;
    }

    return {
        getInstance: () => {
            if (instance == null) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

class SignallingInterface {
    constuctor() {
        this.serverConnection = new WebSocket("ws://54.179.2.91:49621");

        this.serverConnection.onmessage = (receivedMessage) => {
            console.log("Got message from server: ", receivedMessage);
            var parsedMessage = JSON.parse(receivedMessage.data);
    
            switch (parsedMessage.type) {
                case "login":
                    if (parsedMessage.success) {
                        this.loginHandler();
                    } else {
                        window.alert("Username already in use, please pick a different one!");
                    }
                    break;
                default:
                    console.log("unknown message for now");
            }
        };
    }

    testFunc() {
        window.alert("HAHAHA");
    }
}

export default SignallingServer;