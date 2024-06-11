import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // Import cors middleware

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const ENV_VARIABLES = {
    API_URL: process.env.VITE_API_BASE_URL || 'https://example.com/api',
    // Add more environment variables as needed
};

// CORS configuration
const corsOptions = {
    origin: process.env.VITE_API_BASE_URL, // Replace with your backend server URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions)); // Use CORS middleware

// Serve static files
app.use('/', serveStatic(path.join(__dirname, '/dist')));

// Endpoint to expose environment variables
app.get('/env', (req, res) => {
    res.json(ENV_VARIABLES);
});

// Route to serve the frontend application on different page routes
app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`app is listening on port: ${port}`);
