import { ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO } from "socket-controllers";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "models";
import { Server, Socket } from "socket.io";
import { getSocketGameRoom } from "../utils/roomUtils";

@SocketController()
export class GameController {

    // Basic logic to start round and select a new question
    @OnMessage("start_round")
    public async startRound(@SocketIO() io: Server, @ConnectedSocket() socket: Socket<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>, roundId: string) {

        console.log("Starting round ", roundId, "!");

        // TODO: Error checking 
        // 1. Ensure enough players
        // 2. Ensure not too many players
        // 3. .. etc
        if (false) {
            socket.to(socket.id).emit("start_game_error", {error: "Describe the error..."});
        }

        // Test question for now, this will be replaced by a database access call
        // TODO: Implement database question gathering
        // Current format is [question, ans1, ans2, ans3, correct_answer_index]
        const question = ['What nationality is Cristiano Ronaldo?', 'Portugese', 'French', 'Spanish', '1'];

        // Get game room to broadcast question to
        const gameRoom = getSocketGameRoom(socket);

        socket.to(gameRoom).emit("send_question", question);
    }

    // Basic logic to start round and select a new question
    @OnMessage("send_answer")
    public async receiveAnswer(@SocketIO() io: Server, @ConnectedSocket() socket: Socket<ClientToServerEvents,ServerToClientEvents,InterServerEvents,SocketData>, @MessageBody() answer_id: string) {

        console.log('Received an answer from ', socket.data.username);
        console.log('They selected ', answer_id);

        // Get game room to broadcast question to
        const gameRoom = getSocketGameRoom(socket);

        socket.to(gameRoom).emit("update_answer", socket.id.toString(), parseInt(answer_id));
    }

    // This function sends out the result of the round to each player (correct/incorrect)
    @OnMessage("correct_ids")
    public async correctIds(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() playerNames: string[]) {
        const roomId = getSocketGameRoom(socket);

        // Get socket ids connected to the room
        const playersInRoom = Array.from(io.sockets.adapter.rooms.get(roomId));

        // This is probably terrible logic but check if users are correct and send them the appropriate response
        // Loops through players in the room and if their username was correct, send them a correct response
        playersInRoom.forEach((player) => {
            if(playerNames.includes(io.sockets.sockets.get(player).data.username)) {
                socket.to(player).emit("send_result", true);
            } else {
                socket.to(player).emit("send_result", false);
            }
        });
    }
}