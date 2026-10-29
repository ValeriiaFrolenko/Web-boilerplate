import { uniqBy } from 'lodash-es';
import type { User } from './types';
import { buildIdentityKeys } from './identity';

const mergeUsers = (primary: User[], secondary: User[]): User[] => {
    const combined = [...primary, ...secondary];
    return uniqBy(combined, (user) => buildIdentityKeys(user)[0] ?? user.id);
};

export default mergeUsers;
