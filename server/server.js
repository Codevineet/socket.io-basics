import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const server = new createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {

    socket.emit("welcome", `Welcome to the server`);
    socket.broadcast.emit("welcome", `A new user has joined the server with server id ${socket.id}`);

    socket.on("message", (data) => {
        if(data.roomm != ""){
            io.to(data.roomm).emit("receive-message" , data.msg);
        }
        else{
            io.emit("receive-message" , data.msg);
        }
    })

})

app.get('/', (req, res) => {
    res.send("Hi");
})

server.listen(port, () => {
    console.log(`server is listening to port ${port}...`);
})