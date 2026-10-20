import type { RawRandomUserMockEntry, User } from './types';
import { normalizeFromRandomUserMock } from './normalizeFromSource';
import { buildUser } from './buildUser';
import validateUser from './validateUser';

const formatUsers = (rawList: RawRandomUserMockEntry[]): User[] => {
    return rawList
        .map(normalizeFromRandomUserMock)
        .filter((typed) => {
            const result = validateUser(typed);
            if (!result.valid) {
                console.warn('Dropped invalid API record', result.errors, typed);
            }
            return result.valid;
        })
        .map(buildUser);
};

export default formatUsers;