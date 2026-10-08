import findUser from './findUser.js';

// Відсоток юзерів, що відповідають параметру пошуку (ті самі field/query/operator, що й findUser).
const getMatchPercentage = (users, field, query, operator = '=') => {
  if (users.length === 0) return 0;

  const matches = findUser(users, field, query, operator);
  return (matches.length / users.length) * 100;
};

export default getMatchPercentage;