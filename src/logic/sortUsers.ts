import type { User, SortField, SortDirection } from './types';

const sortUsers = (users: User[], field: SortField, direction: SortDirection = 'asc'): User[] => {
    const multiplier = direction === 'desc' ? -1 : 1;

    return [...users].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];

        if (valueA === null) return 1;
        if (valueB === null) return -1;

        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return (valueA - valueB) * multiplier;
        }

        return String(valueA).localeCompare(String(valueB), undefined, { sensitivity: 'base' }) * multiplier;
    });
};

export default sortUsers;
