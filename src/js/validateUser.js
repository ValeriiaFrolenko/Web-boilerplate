// Очікувана довжина телефону (тільки цифри) по країнах -- побудовано з фактичних
// даних FE4U-Lab2-mock.js, тому список обмежений саме цими 15 країнами.
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

// Чи має символ поняття регістру (арабська/китайська тощо -- не мають).
const hasCase = (char) => char.toUpperCase() !== char.toLowerCase();

// null валідний (поле може бути відсутнім), інакше -- з великої літери
// або з символу без поняття регістру.
const isCapitalizedString = (value) => {
  if (value === null) return true;
  const str = String(value).trim();
  if (str === '') return false;
  const firstChar = str.charAt(0);
  if (!hasCase(firstChar)) return true;
  return firstChar === firstChar.toUpperCase();
};

// note, на відміну від інших полів, за контрактом User не може бути null
// (завжди ставиться '' при відсутності даних) -- тому тут null невалідний.
const isValidNote = (value) => {
  if (value === null) return false;
  if (value.trim() === '') return true;
  return isCapitalizedString(value);
};

const isValidAge = (value) => value === null || (typeof value === 'number' && !Number.isNaN(value));

// '@' з непорожніми частинами по обидва боки -- так сформульовано вимогу в ТЗ.
const isValidEmail = (value) => {
  if (value === null) return true;
  const parts = value.split('@');
  return parts.length === 2 && parts[0] !== '' && parts[1] !== '';
};

// Країна відома -- довжина має збігатись точно з нею.
// Країна невідома -- перевірити конкретний формат нема як, тому слабша
// перевірка: довжина має збігатись хоча б з однією країною з довідника
// (відсікає явний мотлох типу "123", не підтверджує конкретний формат).
const isValidPhone = (user) => {
  if (user.phone === null) return true;

  const expectedLength = user.country !== null ? PHONE_LENGTH_BY_COUNTRY[user.country] : undefined;
  if (expectedLength !== undefined) {
    return user.phone.length === expectedLength;
  }

  const knownLengths = Object.values(PHONE_LENGTH_BY_COUNTRY);
  return knownLengths.includes(user.phone.length);
};

// Перевіряє один User, повертає { valid, errors } -- errors це назви полів,
// що не пройшли перевірку.
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