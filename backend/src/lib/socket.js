//socket io used for real-time chat based implementation
import { Server } from "socket.io"
import http from "http" //it is default already in the node 
import express from "express"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// a helper function for real time implementation
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// for storing the online users
const userSocketMap = {};

// for any incoming connection
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    //for storing the online users 
    const userId = socket.handshake.query.userId; 
    console.log("Connect userId:", userId);
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log("Mapped userSocketMap:", Object.keys(userSocketMap));
    }

    //for broadcasting every online user present
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id, "userId:", userId);
        if (userId) {
            delete userSocketMap[userId];
            console.log("Updated map:", Object.keys(userSocketMap));
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export { io, app, server };