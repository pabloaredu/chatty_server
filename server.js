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


// Generating user color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}




// Create the WebSockets server
const wss = new SocketServer({ server });


wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log(wss.clients.size);
  console.log(getRandomColor());
  const userColor = {
    type: "serverChangeColor",
    color: getRandomColor(),
  }
  const numberOfUsersJoin = {
        users: wss.clients.size,
        type: "userJoined",
      };
// Sending number of users
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(numberOfUsersJoin));
    }
  });

  // Sending user color
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(userColor));
    }
  });


// Receiving client msg
  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message)
    msg.id = uuidv1();
    if(msg.type === "Message") {
      console.log(`User ${msg.username} said ${msg.content}`);
    } else if (msg.type === "Notification"){
      console.log(`${msg.username} changed their name to ${msg.content}`)
    }

// Sending msg back to all clients
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    console.log(wss.clients.size);
    const numberOfUsersLeave = {
      users: wss.clients.size,
      type: "userLeft",
    };
    // console.log(numberOfUsers);
    // Sending number of users
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(numberOfUsersLeave));
      }
    });
  });
});




