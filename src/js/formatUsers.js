import User from './user.js';
import { mapRandomUserMockUser, mapAdditionalUser } from './mappers.js';
import { normalizeUserFields, buildIdentityKeys } from './normalizeUser.js';

const MERGEABLE_FIELDS = ['favorite', 'course', 'bg_color', 'note'];

// Доповнює target полями з source там, де в target значення відсутнє/порожнє.

const mergeNormalized = (target, source) => {
  MERGEABLE_FIELDS.forEach((field) => {
    const isTargetBlank = target[field] === null || target[field] === undefined || target[field] === '';
    const isSourceBlank = source[field] === null || source[field] === undefined || source[field] === '';
    if (isTargetBlank && !isSourceBlank) {
      target[field] = source[field];
    }
  });
};

// Результатом виконання є функція, що повертає масив відформатованих об'єктів.
const formatUsers = (randomUserMockList, additionalUsersList) => {
  const mappedRandomUsers = randomUserMockList.map(mapRandomUserMockUser);
  const mappedAdditionalUsers = additionalUsersList.map(mapAdditionalUser);
  const allMapped = [...mappedRandomUsers, ...mappedAdditionalUsers];

  const keyToNormalized = new Map();
  const uniqueNormalized = [];

  for (const mapped of allMapped) {
    const normalized = normalizeUserFields(mapped);
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