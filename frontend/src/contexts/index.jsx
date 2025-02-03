import { createContext } from 'react';
import filter from 'leo-profanity';

const AuthContext = createContext({});
const ApiContext = createContext({});
const FilterContext = createContext({
  clean: (text) => filter.clean(text), // Дефолтная функция для очистки
});

export { AuthContext, ApiContext, FilterContext };
