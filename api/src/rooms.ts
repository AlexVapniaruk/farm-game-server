import { generateUuid } from "./helpers";
import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export interface Player {
    id:string;
    name:string;
    online:boolean,
    socket?: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}
export interface Room {
    hostId: string;
    players: Player[];
}
export interface Rooms {
    [key: string]: Room;
}

const rooms:Rooms = {};

// Function to create a new room
export function createRoom(hostId:string) {
    const roomId = generateUuid();
    rooms[roomId] = { hostId, players: [] };
    return roomId;
}

// Function to join a room
export function joinRoom(
    roomId: string,
    player: Player,
    socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
    if (!rooms[roomId]) {
        return null; // Room does not exist
    }

    if (!rooms[roomId].players.find((existingPlayer) => player.id === existingPlayer.id)) {
        rooms[roomId].players.push({
            ...player,
            socket,
        });
    } else {
        rooms[roomId].players.map((existingPlayer) => {
            if (player.id === existingPlayer.id) {
                existingPlayer.socket = socket;
                existingPlayer.online = true;
            }

            return existingPlayer;
        });
    }
    return rooms[roomId].players;
}

export function getRoom(roomId:string):Room | null {
    const room:Room = { ...rooms[roomId] };
    if (room && room.players) {
        room.players.map((player: Player) => {
            delete player.socket;
            return player;
        });
        return room;
    }

    return null;
}
