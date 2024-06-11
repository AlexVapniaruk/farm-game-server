import axios from "../axios.ts";
import apiUrls from "./API_URL.ts";

export const createRoom = (playerId:string) => axios.post(apiUrls.CREATE_ROOM(playerId));

export const getRoom = (roomId:string) => axios.get(apiUrls.GET_ROOM(roomId));