import { map, filter } from 'lodash-es';
import type { RawRandomUserMockEntry, User } from './types';
import { normalizeFromRandomUserMock } from './normalizeFromSource';
import { buildUser } from './buildUser';
import validateUser from './validateUser';

const formatUsers = (rawList: RawRandomUserMockEntry[]): User[] => {
    const typedList = map(rawList, normalizeFromRandomUserMock);

    const validList = filter(typedList, (typed) => {
        const result = validateUser(typed);
        if (!result.valid) {
            console.warn('Dropped invalid API record', result.errors, typed);
        }
        return result.valid;
    });

    return map(validList, buildUser);
};

export default formatUsers;