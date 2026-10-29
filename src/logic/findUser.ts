import { filter } from 'lodash-es';
import type { User, FindUserField, AgeOperator } from './types';

const AGE_COMPARATORS: Record<AgeOperator, (age: number, target: number) => boolean> = {
    '=': (age, target) => age === target,
    '>': (age, target) => age > target,
    '<': (age, target) => age < target,
    '>=': (age, target) => age >= target,
    '<=': (age, target) => age <= target,
};

const findUser = (
    users: User[],
    field: FindUserField,
    query: string | number,
    operator: AgeOperator = '=',
): User[] => {
    if (field === 'age') {
        const targetAge = Number(query);
        const compare = AGE_COMPARATORS[operator];
        return filter(users, (user) => user.age !== null && compare(user.age, targetAge));
    }

    const userField: 'fullName' | 'note' = field === 'name' ? 'fullName' : 'note';
    const normalizedQuery = String(query).trim().toLowerCase();

    return filter(users, (user) => {
        const value = user[userField];
        if (value === null) return false;
        return value.toLowerCase().includes(normalizedQuery);
    });
};

export default findUser;
