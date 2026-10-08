import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';
import formatUsers from './formatUsers.js';
import filterUsers from './filterUsers.js';
import sortUsers from './sortUsers.js';
import findUser from './findUser.js';
import getMatchPercentage from './getMatchPercentage.js';
import validateUser from './validateUser.js';

// gender/favorite навмисно undefined -- filterUsers ігнорує непередані критерії
const FILTER_USERS_CRITERIA = {
  country: 'Germany',
  age: { min: 20, max: 60 },
  gender: undefined,
  favorite: undefined,
};

const SORT_USERS_FIELD = 'age';
const SORT_USERS_DIRECTION = 'desc';

const FIND_USER_FIELD = 'name';
const FIND_USER_QUERY = 'ann';

const GET_MATCH_PERCENTAGE_FIELD = 'name';
const GET_MATCH_PERCENTAGE_QUERY = 'man';

// Бере плоскі поля User для виводу в console.table --
// coordinates/timezone вкладені об'єкти показувати не варто ([object Object]).
const toTableRow = (user) => ({
  full_name: user.full_name,
  gender: user.gender,
  age: user.age,
  b_date: user.b_date,
  country: user.country,
  city: user.city,
  email: user.email,
  phone: user.phone,
  course: user.course,
  favorite: user.favorite,
});

const users = formatUsers(randomUserMock, additionalUsers);
console.log(`\n=== formatUsers: усього юзерів після об'єднання -- ${users.length} ===`);

// повна структура на 3 прикладах
// users[0] -- змерджений дублікат (є в обох джерелах), два останніх --
// унікальні записи тільки з additionalUsers.
console.log('\n--- Повна структура 3 User (усі поля, видно типи) ---');
[users[0], users[users.length - 2], users[users.length - 1]].forEach((user, i) => {
  console.log(`\n-- приклад ${i + 1}: ${user.full_name} --`);
  console.log(JSON.stringify(user, null, 2));
});

console.log('\n--- Коротка таблиця по всіх 52 (огляд) ---');
console.table(users.map(toTableRow));

const filtered = filterUsers(users, FILTER_USERS_CRITERIA);
console.log(`\n=== filterUsers: country=Germany, age 20-60 -- знайдено ${filtered.length} ===`);
console.table(filtered.map(toTableRow));

const sorted = sortUsers(filtered, SORT_USERS_FIELD, SORT_USERS_DIRECTION);
console.log(`\n=== sortUsers: за полем "${SORT_USERS_FIELD}", напрямок "${SORT_USERS_DIRECTION}" ===`);
console.table(sorted.map(toTableRow));

const found = findUser(users, FIND_USER_FIELD, FIND_USER_QUERY);
console.log(`\n=== findUser: поле "${FIND_USER_FIELD}", запит "${FIND_USER_QUERY}" -- знайдено ${found.length} ===`);
console.table(found.map(toTableRow));

const matchPercentage = getMatchPercentage(users, GET_MATCH_PERCENTAGE_FIELD, GET_MATCH_PERCENTAGE_QUERY);
console.log(`\n=== getMatchPercentage: поле "${GET_MATCH_PERCENTAGE_FIELD}", запит "${GET_MATCH_PERCENTAGE_QUERY}" -- ${matchPercentage.toFixed(2)}% ===`);

const validationResults = users.map((user) => ({ user, result: validateUser(user) }));

const invalid = validationResults.filter(({ result }) => !result.valid);
console.log(`\n=== validateUser: усього ${users.length}, невалідних -- ${invalid.length} ===`);
console.table(invalid.map(({ user, result }) => ({
  full_name: user.full_name,
  errors: result.errors.join(', '),
  invalid_values: result.errors.map((field) => `${field}=${JSON.stringify(user[field])}`).join(', '),
})));