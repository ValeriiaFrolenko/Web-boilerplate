// Сортує масив User за одним полем (full_name, age, b_date, country).
// field -- назва поля, за яким сортувати.
// direction -- 'asc' (за зростанням, за замовчуванням) або 'desc' (за спаданням).
// Не мутує вихідний масив.
const sortUsers = (users, field, direction = 'asc') => {
  const multiplier = direction === 'desc' ? -1 : 1;

  return [...users].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA === null || valueA === undefined) return 1;
    if (valueB === null || valueB === undefined) return -1;

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * multiplier;
    }

    return String(valueA).localeCompare(String(valueB), undefined, { sensitivity: 'base' }) * multiplier;
  });
};

export default sortUsers;
