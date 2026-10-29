import type { User, FilterCriteria } from './types';

const equalsCaseInsensitive = (userValue: string | null, criterionValue: string): boolean => {
    if (userValue === null) return false;
    return userValue.localeCompare(criterionValue, undefined, { sensitivity: 'base' }) === 0;
};

const filterUsers = (users: User[], criteria: FilterCriteria = {}): User[] => {
    const { country, age, gender, favorite, hasPhoto } = criteria;

    return users.filter((user) => {
        if (country !== undefined && !equalsCaseInsensitive(user.country, country)) return false;
        if (gender !== undefined && !equalsCaseInsensitive(user.gender, gender)) return false;
        if (favorite !== undefined && user.favorite !== favorite) return false;
        if (hasPhoto === true && user.pictureLarge === null) return false;

        if (age !== undefined) {
            if (user.age === null) return false;
            if (age.min !== undefined && user.age < age.min) return false;
            if (age.max !== undefined && user.age > age.max) return false;
        }

        return true;
    });
};

export default filterUsers;
