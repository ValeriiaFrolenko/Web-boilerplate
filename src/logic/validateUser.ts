import type { User, TypedUserFields, ValidationResult, ValidationError } from './types';
import { getCountryCode } from 'countries-list';

const UNKNOWN_VALUE = 'Unknown';
const MAX_AGE = 150;
const MIN_BIRTH_YEAR = 1900;

const PHONE_LENGTH_BY_COUNTRY: Record<string, number> = {
    Germany: 11,
    Ireland: 10,
    Australia: 10,
    'United States': 10,
    Finland: 8,
    Turkey: 10,
    Switzerland: 10,
    'New Zealand': 10,
    Spain: 9,
    Norway: 8,
    Denmark: 8,
    Iran: 11,
    Canada: 10,
    France: 10,
    Netherlands: 10,
};

const hasCase = (char: string): boolean => char.toUpperCase() !== char.toLowerCase();

const isCapitalizedString = (value: string): boolean => {
    const str = value.trim();
    if (str === '') return false;
    const firstChar = str.charAt(0);
    if (!hasCase(firstChar)) return true;
    return firstChar === firstChar.toUpperCase();
};

const validateCapitalized = (field: keyof User, value: string | null): ValidationError | null => {
    if (value === null) return null;
    return isCapitalizedString(value) ? null : { field, message: 'must start with a capital letter' };
};

const validateFullName = (value: string | null): ValidationError | null => {
    if (value === null) return { field: 'fullName', message: 'must not be empty' };
    return isCapitalizedString(value) ? null : { field: 'fullName', message: 'must start with a capital letter' };
};

const validateNote = (value: string | null): ValidationError | null => {
    if (value === null || value.trim() === '') return null;
    return isCapitalizedString(value) ? null : { field: 'note', message: 'must start with a capital letter' };
};

const validateCountry = (value: string | null): ValidationError | null => {
    if (value === null) return { field: 'country', message: 'must be selected' };
    if (value === UNKNOWN_VALUE) return null;
    return getCountryCode(value) === undefined
        ? { field: 'country', message: 'must be a known country' }
        : null;
};

const validateAge = (value: number | null): ValidationError | null => {
    if (value === null) return null;
    if (Number.isNaN(value)) return { field: 'age', message: 'must be a valid number' };
    if (value < 0 || value > MAX_AGE) return { field: 'age', message: `must be between 0 and ${MAX_AGE}` };
    return null;
};

const validateBirthDate = (value: string | null): ValidationError | null => {
    if (value === null) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { field: 'birthDate', message: 'must be a valid date' };
    if (date > new Date()) return { field: 'birthDate', message: 'must not be in the future' };
    if (date.getFullYear() < MIN_BIRTH_YEAR) {
        return { field: 'birthDate', message: `must be after ${MIN_BIRTH_YEAR}` };
    }
    return null;
};

const validateEmail = (value: string | null): ValidationError | null => {
    if (value === null) return null;
    const parts = value.split('@');
    if (parts.length !== 2 || parts[0] === '') {
        return { field: 'email', message: 'must contain exactly one "@" with non-empty local part' };
    }
    const domain = parts[1];
    const dotIndex = domain.lastIndexOf('.');
    if (dotIndex <= 0 || dotIndex === domain.length - 1) {
        return { field: 'email', message: 'domain must contain a dot with non-empty parts' };
    }
    return null;
};

const validatePhone = (phone: string | null, country: string | null): ValidationError | null => {
    if (phone === null) return null;
    if (!/^\d+$/.test(phone)) return { field: 'phone', message: 'must contain only digits' };

    const expectedLength = country !== null ? PHONE_LENGTH_BY_COUNTRY[country] : undefined;
    const valid =
        expectedLength !== undefined
            ? phone.length === expectedLength
            : Object.values(PHONE_LENGTH_BY_COUNTRY).includes(phone.length);
    return valid ? null : { field: 'phone', message: 'unexpected length for country' };
};

const validateUser = (user: TypedUserFields): ValidationResult => {
    const errors = [
        validateFullName(user.fullName),
        validateCapitalized('gender', user.gender),
        validateNote(user.note),
        validateCapitalized('state', user.state),
        validateCapitalized('city', user.city),
        validateCountry(user.country),
        validateAge(user.age),
        validateBirthDate(user.birthDate),
        validatePhone(user.phone, user.country),
        validateEmail(user.email),
    ].filter((error): error is ValidationError => error !== null);

    return { valid: errors.length === 0, errors };
};

export default validateUser;