import { io } from 'socket.io-client';

let BASE_URL;
//BASE_URL = import.meta.env.API_BASE_URL;
BASE_URL = 'https://farm-game-server-ff82e5096013.herokuapp.com';
//BASE_URL = 'http://localhost:3000';
const socket = io(BASE_URL);

// Example of setting up event listeners
socket.on('connection', () => {
    console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
});

export default socket;