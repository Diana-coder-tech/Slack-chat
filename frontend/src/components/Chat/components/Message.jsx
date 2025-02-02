import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { FilterContext } from '../../contexts/index.jsx';

const Message = ({ message }) => {
  const { clean } = useContext(FilterContext); // Получаем фильтр из контекста

  const { username, body } = message;

  return (
    <div className="text-break mb-2">
      <b>{username}</b>
      {`: ${clean(body)}`}
    </div>
  );
};

export default Message;
