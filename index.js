const WebSocket = require('ws');
const http = require('http');
const express = require('express');



const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;
const clients = new Set();

app.get('/', (req, res) => {
  res.send('WebSocket Chat Server is running.');
});

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected. Total clients:', clients.size);

  ws.send(JSON.stringify({ message: 'Welcome to the chat!' }));

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    console.log('Received message:', parsedMessage.text);

    broadcastMessage(parsedMessage.text, ws);
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

function broadcastMessage(text, sender) {
  const data = JSON.stringify({ message: text });

  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

server.listen(port, () => {
  console.log(`WebSocket Chat Server running at http://localhost:${port}`);
});
