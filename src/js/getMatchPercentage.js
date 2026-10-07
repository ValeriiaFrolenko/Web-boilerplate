import findUser from './findUser.js';

// Повертає відсоток об'єктів у масиві, що відповідають параметру пошуку.
// Приймає ті самі параметри, що й findUser (field, query, operator) --
const getMatchPercentage = (users, field, query, operator = '=') => {
  if (users.length === 0) return 0;

  const matches = findUser(users, field, query, operator);
  return (matches.length / users.length) * 100;
};

export default getMatchPercentage;
