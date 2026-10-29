import type { User } from './types';
import { buildIdentityKeys } from './identity';

const mergeUsers = (primary: User[], secondary: User[]): User[] => {
    const seen = new Set<string>();
    const result: User[] = [];

    const add = (user: User): void => {
        const keys = buildIdentityKeys(user);
        if (keys.some((key) => seen.has(key))) return;
        keys.forEach((key) => seen.add(key));
        result.push(user);
    };

    primary.forEach(add);
    secondary.forEach(add);

    return result;
};

export default mergeUsers;
