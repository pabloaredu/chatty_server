// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');
const WebSocket = require('ws');
// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log(wss.clients.size);
  const numberOfUsers = {
        users: wss.clients.size,
        type: "serverMessage"
      };
// Sending number of users
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(numberOfUsers));
    }
  });

// Receiving client msg
  ws.on('message', function incoming(message) {
    console.log(message);
    const msg = JSON.parse(message)
    msg.id = uuidv1();
    console.log(`User ${msg.username} said ${msg.content}`);

// Sending msg back to all clients
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    console.log(wss.clients.size);
    const numberOfUsers = {
      users: wss.clients.size,
      type: "serverMessage"
    };
    // Sending number of users
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(numberOfUsers));
      }
    });
  });
});




