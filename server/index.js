//importing modules
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);;
const Room = require('./models/room')
var io = require("socket.io")(server);


//middle ware
app.use(express.json());

const DB = "mongodb+srv://mdtaha:test1234@cluster0.5eano9v.mongodb.net/?retryWrites=true&w=majority";

io.on('connection', (socket) => {
    console.log("connected");
    socket.on('createRoom', async ({ nickname }) => {
        console.log(nickname);
        try {
            // room is created
            let room = new Room();
            let player = {
                socketID: socket.id,
                nickname,
                playerType: "X",
            };
            room.players.push(player);
            room.turn = player;
            room = await room.save();
            console.log(room);
            const roomId = room._id.toString();

            socket.join(roomId);
            // io -> send data to everyone
            // socket -> sending data to yourself
            io.to(roomId).emit("createRoomSuccess", room);
        } catch (e) {
            console.log(e);
        }
    });

    socket.on("joinRoom", async ({ nickname, roomId }) => {
        try {
            if (!roomId.match(/^[0-9a-fA-F]{24}$/)) {
                socket.emit("errorOccurred", "Please enter a valid room ID.");
                return;
            }
            let room = await Room.findById(roomId);

            if (room.isJoin) {
                let player = {
                    nickname,
                    socketID: socket.id,
                    playerType: "O",
                };
                socket.join(roomId);
                room.players.push(player);
                room.isJoin = false;
                room = await room.save();
                io.to(roomId).emit("joinRoomSuccess", room);
                io.to(roomId).emit("updatePlayers", room.players);
                io.to(roomId).emit("updateRoom", room);
            } else {
                socket.emit(
                    "errorOccurred",
                    "The game is in progress, try again later."
                );
            }
        } catch (e) {
            console.log(e);
        }
    });

});
mongoose.connect(DB).then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log(e);
});

server.listen(port, '0.0.0.0', () => {
    console.log(`server started ${port}`);
})