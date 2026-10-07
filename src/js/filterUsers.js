// Фільтрує масив User за критеріями country, age, gender, favorite.
// Усі критерії опціональні, непередані -- ігноруються (не звужують вибірку).
// Критерії комбінуються через логічне "і".

const filterUsers = (users, criteria = {}) => {
  const { country, age, gender, favorite } = criteria;

  return users.filter((user) => {
    if (country !== undefined && user.country !== country) return false;
    if (gender !== undefined && user.gender !== gender) return false;
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
