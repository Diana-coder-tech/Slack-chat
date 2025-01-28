import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Проверка на наличие токена при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Если токен существует, редирект на главную страницу (чат)
    } else {
      localStorage.removeItem('token'); // Очистка устаревшего токена (если он есть)
    }
  }, [navigate]);

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    try {
      setServerError(''); // Сбрасываем предыдущие ошибки

      // Прокси настроен, поэтому используем относительный путь
      const response = await axios.post('/api/v1/login', values); // Отправляем запрос на сервер

      // В случае успеха получаем токен
      const { token } = response.data;

      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);

      // Перенаправляем пользователя на страницу чата
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Ошибка авторизации
        setServerError('Неверное имя пользователя или пароль.');
      } else {
        // Общая ошибка сервера
        setServerError('Ошибка сервера. Попробуйте позже.');
      }
      resetForm(); // Сбрасываем поля формы
    } finally {
      setSubmitting(false); // Завершаем процесс отправки
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
      <h2>Авторизация</h2>
      {serverError && (
        <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{serverError}</div>
      )}
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={(values) => {
          const errors = {};
          if (!values.username) {
            errors.username = 'Введите имя пользователя';
          }
          if (!values.password) {
            errors.password = 'Введите пароль';
          }
          return errors;
        }}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Имя пользователя:
              </label>
              <Field
                type="text"
                id="username"
                name="username"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <ErrorMessage
                name="username"
                component="div"
                style={{ color: 'red', fontSize: '12px', marginTop: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Пароль:
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <ErrorMessage
                name="password"
                component="div"
                style={{ color: 'red', fontSize: '12px', marginTop: '0.5rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isSubmitting ? '#ccc' : '#007BFF',
                color: '#fff',
                fontSize: '16px',
                borderRadius: '4px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Входим...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
