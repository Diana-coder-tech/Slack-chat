import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // Список сообщений
  const [message, setMessage] = useState(''); // Текущее вводимое сообщение
  const [socket, setSocket] = useState(null); // WebSocket-соединение

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem('token'); // Удаляем токен
    socket.disconnect(); // Закрываем WebSocket-соединение
    navigate('/login'); // Перенаправляем на страницу логина
  };

  // Устанавливаем соединение с сервером WebSocket при загрузке компонента
  useEffect(() => {
    const newSocket = io('/ws', {
      query: { token: localStorage.getItem('token') }, // Передаем токен в заголовке
    });
    setSocket(newSocket);

    // Слушаем событие "receive_message" от сервера
    newSocket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Закрываем соединение при размонтировании компонента
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Обработчик отправки сообщения
  const handleSendMessage = () => {
    if (message.trim() && socket) {
      // Отправляем сообщение на сервер
      socket.emit('send_message', { text: message, user: 'Admin' }); // Пример с администратором
      setMessage(''); // Очищаем поле ввода
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Чат</h1>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '1rem',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        style={{
          width: '80%',
          padding: '0.5rem',
          marginRight: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleSendMessage}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Отправить
      </button>
      <button
        onClick={handleLogout}
        style={{
          marginLeft: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#FF4C4C',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default Chat;
