import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;
const secretJWTKey = "ewghihrgiuerh23432guir";


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


io.use((socket , next) =>{
    cookieParser()(socket.request, socket.request.res, (err) => {
        if (err) return next(err);
        
        const token = socket.request.cookies?.token;
        if (!token) return next(new Error("Authentication failed"));
        next();
    })
})

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

    socket.on("join-room" , (roomId) =>{
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    })

})

app.get('/', (req, res) => {
    res.send("Hi");
})



app.get('/login' , (req, res) =>{
    const token = jwt.sign({_id:"qwerty" }, secretJWTKey);
    res.cookie("token" , token).json({
        message: "Login Successful",
    });
})

server.listen(port, () => {
    console.log(`server is listening to port ${port}...`);
})