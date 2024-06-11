import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors as ES6 module
import {
    createRoom, getRoom, joinRoom, Rooms,
} from './rooms';
import {
    getGame, startGame, dropCubes, buyAnimal, endMove,
    createGame,
} from './games';

dotenv.config();

const app = express();

const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // Use CORS middleware
app.use(express.json()); // To parse JSON request body
app.options('*', cors(corsOptions)); // Handle preflight requests

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions, // Use the same corsOptions for Socket.io
});

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Game server is running');
});

app.options('*', cors(corsOptions)); // Handle preflight requests

app.post('/create-room/:hostId', (req: Request, res: Response) => {
    const roomId = createRoom(req.params.hostId);
    createGame(roomId);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.json({ roomId });
});

app.options('*', cors(corsOptions)); // Handle preflight requests

app.get('/rooms/:roomId', (req: Request, res: Response) => {
    const room = getRoom(req.params.roomId);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.json(room);
});

const rooms: Rooms = {};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

io.on('connection', (socket: Socket) => {
    let socketRoomId: string;

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

    socket.on('playCubes', async () => {
        io.to(socketRoomId).emit('playCubesAnimation', {});
        const game = dropCubes(socketRoomId);
        await delay(1999);
        io.to(socketRoomId).emit('gameUpdate', { game });
    });

    socket.on('buyAnimal', ({ animalKey }) => {
        const game = buyAnimal(socketRoomId, animalKey);
        io.to(socketRoomId).emit('gameUpdate', { game });
    });

    socket.on('endMove', () => {
        const game = endMove(socketRoomId);
        io.to(socketRoomId).emit('gameUpdate', { game });
    });

    socket.on('playerOffline', ({ roomId, playerId }) => {
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
