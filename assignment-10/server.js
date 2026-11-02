var express = require('express');
var app = express();
let http = require('http');
var hostname = 'localhost';
var port = 3001;
var fs = require('fs/promises');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('your id', socket.id);

  socket.on('send_to_all', async (data) => {
    console.log(`[All] จาก ${socket.id}:`, data);
    const message = {
      time: data.time,
      user: data.user,
      text: data.text
    };

    try {
      await readandWriteFile(message);
      io.emit('message_received', message);
    } catch (error) {
      console.error('Unable to save chat message:', error);
    }
  });
});

app.get('/readlog', async (req, res) => {
  try {
    const logs = await readFile();
    res.json(logs);
  } catch (error) {
    console.error('Unable to read chat log:', error);
    res.status(500).json({ error: 'Unable to read chat log.' });
  }
});

const readFile = async () => {
  try {
    const contents = await fs.readFile('log.json', 'utf8');
    const logs = JSON.parse(contents);
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const writeFile = async (data) => {
  await fs.writeFile('log.json', JSON.stringify(data, null, 2), 'utf8');
};

const readandWriteFile = async (new_msg) => {
  const logs = await readFile();
  logs.push(new_msg);
  await writeFile(logs);
};

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
