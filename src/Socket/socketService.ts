import { Socket } from "socket.io";

const sendMessageToClient = (socket : Socket, msg : String) => {
    socket.emit('chat message', msg);
}