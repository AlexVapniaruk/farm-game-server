const baseUrl = import.meta.env.BASE_URL;

type APIFunction<T extends any[]> = (...args: T) => string;

// Define the structure of API_URL using the generic function type
type API_URL = {
    CREATE_ROOM: APIFunction<[playerId: string]>;
    JOIN_ROOM: APIFunction<[roomId: string, playerId: string]>;
    GET_ROOM: APIFunction<[roomId: string]>;
};

const apiUrls: API_URL = {
    CREATE_ROOM: (playerId: string) => `${baseUrl}create-room/${playerId}`,
    JOIN_ROOM: (roomId: string, playerId: string) => `${baseUrl}join-room/${roomId}/${playerId}`,
    GET_ROOM: (roomId: string) => `${baseUrl}rooms/${roomId}`
};

export default apiUrls;