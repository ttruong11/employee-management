require('dotenv').config();
const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);

// Check if running in production environment
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    // Load SSL/TLS certificate and private key for production
    const privateKey = fs.readFileSync('./certs/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('./certs/cert.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    // Create HTTPS server for production
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(3001, () => {
        console.log('HTTPS server is running on port 3001');
    });
} else {
    // Create HTTP server for non-production (like local development)
    const httpServer = http.createServer(app);
    httpServer.listen(3001, () => {
        console.log('HTTP server is running on port 3001');
    });
}
