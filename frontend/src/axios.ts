import axios from 'axios';

let BASE_URL;
//BASE_URL = import.meta.env.API_BASE_URL;
BASE_URL = 'https://farm-game-server-ff82e5096013.herokuapp.com';
//BASE_URL = 'http://localhost:3000';
// Create Axios instance after fetching environment variables
const instance = axios.create({
    //@ts-ignore
    baseURL: BASE_URL, // Use the retrieved base URL
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }
});

export default instance;