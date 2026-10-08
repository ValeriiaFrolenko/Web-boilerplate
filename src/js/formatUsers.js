import User from './user.js';
import { normalizeFromRandomUserMock, normalizeFromAdditionalUsers, buildIdentityKeys } from './normalizeUser.js';

// Доповнює target полями з source там, де в target значення відсутнє/порожнє.
const mergeNormalized = (target, source) => {
  for (const [field, value] of Object.entries(source)) {
    const isSourceBlank = value === null || value === undefined || value === '';
    if (isSourceBlank) continue;

    const isTargetBlank = target[field] === null || target[field] === undefined || target[field] === '';
    if (isTargetBlank) {
      target[field] = value;
    }
  }
};


// Результатом виконання є функція, що повертає масив відформатованих об'єктів.
const formatUsers = (randomUserMockList, additionalUsersList) => {
  const allNormalized = [
    ...randomUserMockList.map(normalizeFromRandomUserMock),
    ...additionalUsersList.map(normalizeFromAdditionalUsers),
  ];

  const keyToNormalized = new Map();
  const uniqueNormalized = [];

  for (const normalized of allNormalized) {
    const keys = buildIdentityKeys(normalized);

    const existing = keys.length > 0
      ? keys.map((key) => keyToNormalized.get(key)).find(Boolean)
      : undefined;

    if (existing) {
      mergeNormalized(existing, normalized);
      keys.forEach((key) => keyToNormalized.set(key, existing));
      continue;
    }

    keys.forEach((key) => keyToNormalized.set(key, normalized));
    uniqueNormalized.push(normalized);
  }

  return uniqueNormalized.map((normalized) => new User(normalized));
};

export default formatUsers;
