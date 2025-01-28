import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const Login = () => {
  return (
    <div>
      <h2>Авторизация</h2>
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
        onSubmit={(values) => {
          console.log(values); // Логируем данные при отправке формы
        }}
      >
        <Form>
          <div>
            <label htmlFor="username">Имя пользователя:</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Пароль:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit">Войти</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
