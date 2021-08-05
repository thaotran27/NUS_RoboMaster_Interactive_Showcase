import webRTC from "./WebRTC";

class SignallingServer {
    constructor() {
        this.loginMessage = undefined;
        this.offerMessage = undefined;
        this.answerMessage = undefined;
    }


    _send(jsonObject) {
        this.serverConnection.send(JSON.stringify(jsonObject));
    }
    async _sleep(time) {
        return new Promise(async (resolve) => {
            setTimeout(resolve, time);
        });
    }


    initialize(IP, port) {
        this.serverConnection = new WebSocket(`ws://${IP}:${port}`);

        this.serverConnection.onmessage = (receivedMessage) => {
            console.log("Got message from server: ", receivedMessage);
            const parsedMessage = JSON.parse(receivedMessage.data);

            switch (parsedMessage.type) {
                case "login":
                    this.loginMessage = parsedMessage;
                    break;
                case "request-offer":
                    this.offerMessage = parsedMessage;
                    break;
                case "answer":
                    this.answerMessage = parsedMessage;
                    break;
                case "update-queue":
                    break;
                case "leave":
                    break;
                default:
                    break;
            }
        }
    }




    async userLogin(username) {
        if (username === "") {
            throw new Error("Please enter a username");
        }
        if (username.length > 20) {
            throw new Error("Username is too long");
        }

        this._send({
            type: "user-login",
            name: username
        });

        let waitAttempts = 0;
        while (!this.loginMessage) {
            if (waitAttempts >= 5) {
                throw new Error("Server response timed out");
            }
            await this._sleep(500);
            waitAttempts += 1;
        }

        if (!this.loginMessage.success) {
            this.loginMessage = undefined;
            throw new Error("Username already in use, please pick a different one")
        } else {
            this.loginMessage = undefined;
        }
    }


    async findRobot(requestedGame) {
        console.log("Attempting to find robot");
        this._send({
            type: "find-robot",
            joinedGame: requestedGame
        });

        let waitAttempts = 0;
        while (!this.offerMessage) {
            if (waitAttempts >= 5) {
                throw new Error("Server response timed out");
            }
            await this._sleep(500);
            waitAttempts += 1;
        }

        const robotName = this.offerMessage.robotName;
        this.offerMessage = undefined;
        return robotName;
    }


    async sendOffer(robotName, sessionDescription) {
        this._send({
            type: "offer",
            name: robotName,
            offer: sessionDescription
        });

        let waitAttempts = 0;
        while (!this.answerMessage) {
            // if (waitAttempts >= 5) {
            //     throw new Error("Server response timed out");
            // }
            await this._sleep(500);
            waitAttempts += 1;
        }


        const answer = this.answerMessage.answer;
        this.answerMessage = undefined;
        return answer;
    }

    startGame() {
        this._send({
            type: "user-start-game"
        });
    }
}

const signallingServer = new SignallingServer();
export default signallingServer;