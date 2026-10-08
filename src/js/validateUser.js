// Очікувана довжина телефону (тільки цифри, без коду країни і роздільників) для кожної
// країни, що зустрічається в датасеті. Побудовано на основі фактичних даних з
// FE4U-Lab2-mock.js (randomUserMock + additionalUsers), не з офіційних міжнародних
// стандартів, тому список обмежений саме цими 15 країнами.
const PHONE_LENGTH_BY_COUNTRY = {
  Germany: 11,
  Ireland: 10,
  Australia: 10,
  'United States': 10,
  Finland: 8,
  Turkey: 10,
  Switzerland: 10,
  'New Zealand': 10,
  Spain: 9,
  Norway: 8,
  Denmark: 8,
  Iran: 11,
  Canada: 10,
  France: 10,
  Netherlands: 10,
};

// Чи має символ взагалі поняття регістру (великої/малої літери). Якщо верхній і нижній
// регістр символу збігаються (typeof case не застосовний -- наприклад арабська, перська,
// китайська писемність), регістр для нього не визначений -- не можна сказати, що символ
// "не з великої літери", бо самого поняття "великої літери" там немає.
const hasCase = (char) => char.toUpperCase() !== char.toLowerCase();

// Рядок валідний, якщо він null (за контрактом User null -- дозволений стан поля, тому
// відсутність значення сама по собі не порушує вимогу), або непорожній і починається
// з великої літери (чи з символу без поняття регістру -- див. hasCase вище).
const isCapitalizedString = (value) => {
  if (value === null) return true;
  const str = String(value).trim();
  if (str === '') return false;
  const firstChar = str.charAt(0);
  if (!hasCase(firstChar)) return true;
  return firstChar === firstChar.toUpperCase();
};

// note -- за контрактом User null неприпустимий (завжди підставляється '', якщо даних
// немає), тому null тут -- порушення контракту, не валідний стан. Порожній рядок валідний
// завжди (Завдання 1), непорожній має починатися з великої літери.
const isValidNote = (value) => {
  if (value === null) return false;
  if (value.trim() === '') return true;
  return isCapitalizedString(value);
};

// null -- валідний стан (поле відсутнє в джерелі). Присутнє значення має бути коректним
// числом (не NaN).
const isValidAge = (value) => value === null || (typeof value === 'number' && !Number.isNaN(value));

// Email валідний, якщо null (поле відсутнє), або містить '@' з непорожніми частинами
// по обидва боки (саме так сформульовано вимогу в ТЗ: "відповідати формату запису email,
// тобто мати @").
const isValidEmail = (value) => {
  if (value === null) return true;
  const parts = value.split('@');
  return parts.length === 2 && parts[0] !== '' && parts[1] !== '';
};

// Телефон відсутній (null) -- валідний стан, нема що перевіряти.
// Телефон присутній, країна відома -- довжина (тільки цифри, без роздільників) має
// збігатися з очікуваною саме для цієї країни.
// Телефон присутній, країна невідома (null, чи відсутня в довіднику) -- перевірити формат
// конкретної країни нема як, але повний пропуск пропустив би явний мотлох (напр. "123" чи
// рядок з 25 цифр) як валідний. Тому перевіряємо слабше: довжина має збігатися з очікуваною
// довжиною ХОЧА Б ОДНІЄЇ країни з довідника -- це не підтверджує відповідність конкретному
// національному формату, але відсікає те, що не схоже на телефонний номер жодної країни.
const isValidPhone = (user) => {
  if (user.phone === null) return true;

  const expectedLength = user.country !== null ? PHONE_LENGTH_BY_COUNTRY[user.country] : undefined;
  if (expectedLength !== undefined) {
    return user.phone.length === expectedLength;
  }

  const knownLengths = Object.values(PHONE_LENGTH_BY_COUNTRY);
  return knownLengths.includes(user.phone.length);
};

// Перевіряє один об'єкт User на відповідність усім вимогам Завдання 2.
// Повертає { valid: boolean, errors: string[] } -- errors перелічує назви полів,
// що не пройшли перевірку (порожній масив, якщо valid === true).
const validateUser = (user) => {
  const errors = [];

  if (!isCapitalizedString(user.full_name)) errors.push('full_name');
  if (!isCapitalizedString(user.gender)) errors.push('gender');
  if (!isValidNote(user.note)) errors.push('note');
  if (!isCapitalizedString(user.state)) errors.push('state');
  if (!isCapitalizedString(user.city)) errors.push('city');
  if (!isCapitalizedString(user.country)) errors.push('country');
  if (!isValidAge(user.age)) errors.push('age');
  if (!isValidPhone(user)) errors.push('phone');
  if (!isValidEmail(user.email)) errors.push('email');

  return { valid: errors.length === 0, errors };
};

export default validateUser;