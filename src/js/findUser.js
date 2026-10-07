const AGE_COMPARATORS = {
  '=': (age, target) => age === target,
  '>': (age, target) => age > target,
  '<': (age, target) => age < target,
  '>=': (age, target) => age >= target,
  '<=': (age, target) => age <= target,
};

// Знаходить усі об'єкти User, що відповідають параметру пошуку.
// field -- 'name' (шукає в full_name), 'note' або 'age'.
// query -- для 'name'/'note': підрядок, шукається без урахування регістру (часткове входження).
//          для 'age': число для порівняння.
// operator -- тільки для 'age': '=' (за замовчуванням), '>', '<', '>=', '<='.
// Повертає масив знайдених User (порожній, якщо нічого не знайдено).
const findUser = (users, field, query, operator = '=') => {
  if (field === 'age') {
    const targetAge = Number(query);
    const compare = AGE_COMPARATORS[operator];
    if (!compare) throw new Error(`Unknown age comparison operator: ${operator}`);

    return users.filter((user) => user.age !== null && compare(user.age, targetAge));
  }

  // name -- шукає по full_name, note -- по note
  const userField = field === 'name' ? 'full_name' : 'note';
  const normalizedQuery = String(query).trim().toLowerCase();

  return users.filter((user) => {
    const value = user[userField];
    if (value === null) return false;
    return value.toLowerCase().includes(normalizedQuery);
  });
};

export default findUser;