import type { RawRandomUserMockEntry, RawAdditionalUserEntry, TypedUserFields, User } from './types';
import { normalizeFromRandomUserMock, normalizeFromAdditionalUsers } from './normalizeFromSource';
import { buildIdentityKeys } from './identity';
import { buildUser } from './buildUser';

const isBlank = (value: unknown): boolean =>
  value === null || value === undefined || value === '';

const mergeNormalized = (target: TypedUserFields, source: TypedUserFields): void => {
  for (const [field, value] of Object.entries(source) as [keyof TypedUserFields, unknown][]) {
    if (isBlank(value)) continue;

    const current = target[field];
    if (isBlank(current)) {
      (target[field] as unknown) = value;
    }
  }
};

const formatUsers = (
  randomUserMockList: RawRandomUserMockEntry[],
  additionalUsersList: RawAdditionalUserEntry[],
): User[] => {
  const allNormalized: TypedUserFields[] = [
    ...randomUserMockList.map(normalizeFromRandomUserMock),
    ...additionalUsersList.map(normalizeFromAdditionalUsers),
  ];

  const keyToNormalized = new Map<string, TypedUserFields>();
  const uniqueNormalized: TypedUserFields[] = [];

  for (const normalized of allNormalized) {
    const keys = buildIdentityKeys(normalized);

    const existing = keys.length > 0
      ? keys.map((key) => keyToNormalized.get(key)).find((found): found is TypedUserFields => found !== undefined)
      : undefined;

    if (existing) {
      mergeNormalized(existing, normalized);
      keys.forEach((key) => keyToNormalized.set(key, existing));
      continue;
    }

    keys.forEach((key) => keyToNormalized.set(key, normalized));
    uniqueNormalized.push(normalized);
  }

  return uniqueNormalized.map(buildUser);
};

export default formatUsers;
