import type { User, TypedUserFields, ValidationResult, ValidationError } from './types';
import { getCountryCode } from 'countries-list';

const MAX_AGE = 150;
const MIN_BIRTH_YEAR = 1900;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_LENGTH_BY_COUNTRY: Record<string, { min: number; max: number }> = {
    Australia: { min: 10, max: 10 },
    Brazil: { min: 10, max: 11 },
    Canada: { min: 10, max: 10 },
    Switzerland: { min: 9, max: 10 },
    Germany: { min: 10, max: 11 },
    Denmark: { min: 8, max: 8 },
    Spain: { min: 9, max: 9 },
    Finland: { min: 8, max: 10 },
    France: { min: 10, max: 10 },
    'United Kingdom': { min: 10, max: 11 },
    Ireland: { min: 9, max: 10 },
    India: { min: 10, max: 11 },
    Iran: { min: 10, max: 11 },
    Mexico: { min: 10, max: 10 },
    Netherlands: { min: 9, max: 10 },
    Norway: { min: 8, max: 8 },
    'New Zealand': { min: 9, max: 10 },
    Serbia: { min: 9, max: 10 },
    Turkey: { min: 10, max: 10 },
    Ukraine: { min: 9, max: 12 },
    'United States': { min: 10, max: 10 },
};

const hasCase = (char: string): boolean => char.toUpperCase() !== char.toLowerCase();

const isCapitalizedString = (value: string): boolean => {
    const str = value.trim();
    if (str === '') return false;
    const firstChar = str.charAt(0);
    if (!hasCase(firstChar)) return true;
    return firstChar === firstChar.toUpperCase();
};

const validateFullName = (value: string | null): ValidationError | null => {
    if (value === null) return { field: 'fullName', message: 'must not be empty' };
    if (!isCapitalizedString(value)) {
        return { field: 'fullName', message: 'must start with a capital letter' };
    }
    const parts = value.trim().split(/\s+/);
    if (parts.length < 2) {
        return { field: 'fullName', message: 'must contain at least two words' };
    }
    return null;
};

const validateRequiredCapitalized = (
    field: keyof User,
    value: string | null,
): ValidationError | null => {
    if (value === null) return { field, message: 'must not be empty' };
    return isCapitalizedString(value) ? null : { field, message: 'must start with a capital letter' };
};

const validateNote = (value: string | null): ValidationError | null => {
    if (value === null || value.trim() === '') return null;
    return isCapitalizedString(value) ? null : { field: 'note', message: 'must start with a capital letter' };
};

const validateCountry = (value: string | null): ValidationError | null => {
    if (value === null) return { field: 'country', message: 'must be selected' };
    return getCountryCode(value) === undefined
        ? { field: 'country', message: 'must be a known country' }
        : null;
};

const validateAge = (value: number | null): ValidationError | null => {
    if (value === null) return { field: 'age', message: 'must not be empty' };
    if (Number.isNaN(value)) return { field: 'age', message: 'must be a valid number' };
    if (value < 0 || value > MAX_AGE) return { field: 'age', message: `must be between 0 and ${MAX_AGE}` };
    return null;
};

const validateBirthDate = (value: string | null): ValidationError | null => {
    if (value === null) return { field: 'birthDate', message: 'must not be empty' };
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { field: 'birthDate', message: 'must be a valid date' };
    if (date > new Date()) return { field: 'birthDate', message: 'must not be in the future' };
    if (date.getFullYear() < MIN_BIRTH_YEAR) {
        return { field: 'birthDate', message: `must be after ${MIN_BIRTH_YEAR}` };
    }
    return null;
};

const validateEmail = (value: string | null): ValidationError | null => {
    if (value === null) return { field: 'email', message: 'must not be empty' };
    return EMAIL_PATTERN.test(value) ? null : { field: 'email', message: 'must be a valid email' };
};

const validatePhone = (phone: string | null, country: string | null): ValidationError | null => {
    if (phone === null) return { field: 'phone', message: 'must not be empty' };
    const digits = phone.replace(/\D/g, '');
    if (digits === '') return { field: 'phone', message: 'must contain digits' };
    if (country === null) return { field: 'phone', message: 'country must be set to validate phone' };

    const range = PHONE_LENGTH_BY_COUNTRY[country];
    if (range === undefined) {
        return digits.length >= 7 && digits.length <= 15
            ? null
            : { field: 'phone', message: 'must be 7-15 digits' };
    }

    return digits.length >= range.min && digits.length <= range.max
        ? null
        : { field: 'phone', message: `must be ${range.min}-${range.max} digits for ${country}` };
};

const validateUser = (user: TypedUserFields): ValidationResult => {
    const errors = [
        validateFullName(user.fullName),
        validateRequiredCapitalized('gender', user.gender),
        validateRequiredCapitalized('state', user.state),
        validateRequiredCapitalized('city', user.city),
        validateNote(user.note),
        validateCountry(user.country),
        validateAge(user.age),
        validateBirthDate(user.birthDate),
        validatePhone(user.phone, user.country),
        validateEmail(user.email),
    ].filter((error): error is ValidationError => error !== null);

    return { valid: errors.length === 0, errors };
};

export default validateUser;
