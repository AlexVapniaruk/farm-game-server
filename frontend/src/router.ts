// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Room from "./components/room/Room.vue";
import Welcome from "./components/Welcome.vue";

const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: Welcome
    },
    {
        path: '/room/:id',
        name: 'Room :id',
        component: Room
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Use import.meta.env instead of process.env
    routes
});

export default router;
