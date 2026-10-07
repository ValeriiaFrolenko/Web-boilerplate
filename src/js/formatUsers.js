import User from './user.js';
import { mapRandomUserMockUser, mapAdditionalUser } from './mappers.js';

// Результатом виконання є функція, що повертає масив відформатованих об'єктів.
const formatUsers = (randomUserMockList, additionalUsersList) => {
  const mappedRandomUsers = randomUserMockList.map(mapRandomUserMockUser);
  const mappedAdditionalUsers = additionalUsersList.map(mapAdditionalUser);

  const allUsers = [...mappedRandomUsers, ...mappedAdditionalUsers]
    .map((mapped) => new User(mapped));

  const seenKeys = new Set();
  const result = [];

  for (const user of allUsers) {
    const keys = user.getIdentityKeys();
    const isDuplicate = keys.some((key) => seenKeys.has(key));

    if (isDuplicate) continue;

    keys.forEach((key) => seenKeys.add(key));
    result.push(user);
  }

  return result;
};

export default formatUsers;
