import { Socket } from "socket.io";

export const handleSocketConnections = (socket : Socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('chat message', (msg : string) => {
        console.log('Recieved message', msg);
        socket.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected : ${socket.id}`)
    })
}