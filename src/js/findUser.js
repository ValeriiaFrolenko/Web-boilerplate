// Знаходить усі об'єкти User, що відповідають параметру пошуку.
// field -- 'name' (шукає в full_name), 'note' або 'age'.
// query -- для 'name'/'note': підрядок, шукається без урахування регістру (часткове входження).
//          для 'age': точне число.
// Повертає масив знайдених User (порожній, якщо нічого не знайдено).
const findUser = (users, field, query) => {
  if (field === 'age') {
    const targetAge = Number(query);
    return users.filter((user) => user.age === targetAge);
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
