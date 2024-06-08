import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { createRoom, getRoom, joinRoom, Rooms } from "./rooms";
import {getGame, startGame, dropCubes, buyAnimal} from "./games";
import {createGame} from "./games";
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Allow requests from this origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Game server is running');
});

app.post('/create-room/:hostId', (req, res) => {
    const roomId = createRoom(req.params.hostId);
    createGame(roomId);
    res.json({ roomId });
});

app.get('/rooms/:roomId', (req, res) => {
    const room = getRoom(req.params.roomId);
    res.json(room);
});

const rooms: Rooms = {};

io.on('connection', (socket) => {
    let socketRoomId:string;

    socket.on('joinRoom', ({ roomId, player }) => {
        socketRoomId = roomId;
        socket.join(roomId);
        if (!rooms[roomId]) {
            rooms[roomId] = { hostId: player.id, players: [] };
        }
        joinRoom(roomId, player, socket);
        io.to(roomId).emit('roomJoined', roomId);
    });

    socket.on('startGame', ({ roomId }) => {
        console.log('startGame server');
        console.log('roomId');
        const game = getGame(roomId);
        const room = getRoom(roomId);
        if (room?.players.length) {
            startGame(roomId, room.players);
        }
        io.to(roomId).emit('gameUpdate', { game });
    });

    socket.on('gameUpdate', () => {
        const roomId = Object.keys(socket.rooms)[1];
        io.to(roomId).emit('gameUpdate', {});
    });

    socket.on('playCubes', () => {
        const game = dropCubes(socketRoomId);
        io.to(socketRoomId).emit('gameUpdate', { game });
    });

    socket.on('buyAnimal', ({ animalKey }) => {
        const game = buyAnimal(socketRoomId, animalKey);
        io.to(socketRoomId).emit('gameUpdate', { game });
    });

    socket.on('playerOffline', ({ roomId, playerId}) => {
        const room = getRoom(roomId);
        room?.players.map((player) => {
            if (playerId === player.id) {
                player.online = false;
            }
            return player;
        });
        io.to(socketRoomId).emit('roomLeave', roomId);
    });

    socket.on('disconnect', () => {
        console.log(socket, 'socket disconnect');
        if (socketRoomId) {
            socket.leave(socketRoomId);
            const room = getRoom(socketRoomId);
            if (rooms[socketRoomId]) {
                rooms[socketRoomId].players = rooms[socketRoomId].players.filter(
                    (player) => player.socket !== socket,
                );
                if (rooms[socketRoomId].players.length === 0) {
                    delete rooms[socketRoomId];
                }
            }
            console.log(room, 'room disconnect');
            if (!room || room.players.filter((player) => player.online).length === 0) {
                console.log(`Room ${socketRoomId} is now empty`);
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
