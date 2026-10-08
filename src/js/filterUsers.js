// Фільтрує масив User за критеріями country, age, gender, favorite.
// Усі критерії опціональні, непередані -- ігноруються (не звужують вибірку).
// Критерії комбінуються через логічне "і".

// Порівнює два рядкові критерії без урахування регістру. null не збігається
// ні з чим, окрім null (бо user.country/user.gender може бути null, якщо
// даних немає в джерелі -- це не те саме, що порожній рядок чи збіг).
const equalsCaseInsensitive = (userValue, criterionValue) => {
  if (userValue === null) return criterionValue === null;
  return String(userValue).toLowerCase() === String(criterionValue).toLowerCase();
};

const filterUsers = (users, criteria = {}) => {
  const { country, age, gender, favorite } = criteria;

  return users.filter((user) => {
    if (country !== undefined && !equalsCaseInsensitive(user.country, country)) return false;
    if (gender !== undefined && !equalsCaseInsensitive(user.gender, gender)) return false;
    if (favorite !== undefined && user.favorite !== favorite) return false;

    if (age !== undefined) {
      if (user.age === null) return false;
      if (age.min !== undefined && user.age < age.min) return false;
      if (age.max !== undefined && user.age > age.max) return false;
    }

    return true;
  });
};

export default filterUsers;