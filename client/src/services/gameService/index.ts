import { Socket } from "socket.io-client";

class GameService {

    // This function is called from our homePage to tell the server to host a new room and send us the code
    public async startRound(socket: Socket, roundId: number): Promise<string[]> {
        return new Promise((rs, rj) => {
            socket.emit("start_round", roundId);
            socket.on("send_question", (question) => rs(question));
            socket.on("start_game_error", ({ error }) => rj(error));
        })
    }

    // This function is called from the player to send their answer
    public async sendAnswer(socket: Socket, answerId: string): Promise<string> {
        return new Promise((rs, rj) => {
            socket.emit("send_answer", answerId);

            // Trying to test slow loading time
            socket.on("answer_received", (message) => rs(message));
            socket.on("answer_error", ({ error }) => rj(error));
        })
    }

    // This function allows the players to listen for new questions
    public async onSendQuestion(socket: Socket, listener: (q: string[]) => void) {
        socket.on("send_question", (question) => listener(question));
    }

    // This function allows the host to listen to new answers sent in by players
    public async onUpdateAnswers(socket: Socket, listener: (username: string, answerId: string) => void) {
        socket.on("update_answer", (username, answerId) => listener(username, answerId));
    }

    // This function listens for the players individual result from the server at the end of a round
    public async onResult(socket: Socket, listener: (result: boolean) => void) {
        socket.on("send_result", (isCorrect) => listener(isCorrect));
    }

    // This function sends out the ids of correct answers at the end of the round
    public async endRound(socket: Socket, playerAnswers: any): Promise<string> {
        return new Promise((rs, _) => {
            socket.emit("round_over", playerAnswers);

            rs("Round Completed");
            // TODO: Receive confirmation or something, error checking
        })
    }
}

export default new GameService();