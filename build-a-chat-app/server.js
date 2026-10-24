import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
  // The browser UI needs its client script; every other path serves the chat page.
  if (req.url === '/script.js') {
    const script = fs.readFileSync('./public/script.js');
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    return res.end(script);
  }

  const page = fs.readFileSync('./public/index.html');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page);
});

const wss = new WebSocketServer({ server });

function broadcast(payload) {
  const data = JSON.stringify(payload);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, 'http://localhost').searchParams.get(
    'username'
  );

  broadcast({ type: 'system', text: `${username} joined` });

  socket.on('message', (raw) => {
    let message;

    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }

    broadcast({
      type: 'chat',
      username: message.username,
      text: message.text
    });
  });

  socket.on('close', () => {
    broadcast({ type: 'system', text: `${username} left` });
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});
