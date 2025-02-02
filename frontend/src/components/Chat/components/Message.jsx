import React, { useContext } from 'react';
import { FilterContext } from '../../../contexts/index.jsx';

const Message = ({ message }) => {
  const { clean } = useContext(FilterContext); // Получаем функцию clean

  if (!clean) {
    console.error("Функция clean не найдена в контексте!");
    return null;
  }

  const { username, body } = message;

  return (
    <div className="text-break mb-2">
      <b>{username}</b>
      {`: ${clean(body)}`}
    </div>
  );
};

export default Message;
