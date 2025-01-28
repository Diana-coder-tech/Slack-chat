const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = 5001; // Порт, на котором работает ваш сервер

// Настройка CORS и JSON body parser
app.use(cors());
app.use(express.json());

app.post('/api/v1/login', (req, res) => {
    const { username, password } = req.body;
  
    // Простая проверка (замените на реальную логику авторизации)
    if (!username || !password) {
      return res.status(400).json({ error: 'Введите имя пользователя и пароль' });
    }
  
    if (username === 'admin' && password === 'admin') {
      // Генерация простого токена (замените на реальную логику с использованием JWT)
      const token = 'some-jwt-token';
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
    }
  });

// Создаем HTTP сервер на основе express
const server = http.createServer(app);

// Настройка WebSocket с использованием socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',  // Устанавливаем разрешения для всех доменов (можно ограничить, если нужно)
    methods: ['GET', 'POST'],
  },
});

// Обработка подключений WebSocket
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Слушаем события от клиента
  socket.on('send_message', (message) => {
    console.log('Received message:', message);
    // Отправляем сообщение всем подключенным клиентам
    io.emit('receive_message', message);
  });

  // Когда пользователь отключается
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Запуск сервера (HTTP + WebSocket)
server.listen(5001, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
