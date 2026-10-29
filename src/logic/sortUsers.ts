import { sortBy } from 'lodash-es';
import type { User, SortField, SortDirection } from './types';

const sortUsers = (users: User[], field: SortField, direction: SortDirection = 'asc'): User[] => {
    const sorted = sortBy(users, (user) => {
        const value = user[field];
        if (value === null) return '￿';
        if (typeof value === 'number') return value;
        return String(value).toLowerCase();
    });

    return direction === 'desc' ? sorted.reverse() : sorted;
};

export default sortUsers;
