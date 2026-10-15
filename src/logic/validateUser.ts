import type { User, ValidationResult, ValidationError } from './types';

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

const isCapitalizedString = (value: string | null): boolean => {
  if (value === null) return true;
  const str = value.trim();
  if (str === '') return false;
  const firstChar = str.charAt(0);
  if (!hasCase(firstChar)) return true;
  return firstChar === firstChar.toUpperCase();
};

const isValidNote = (value: string): boolean => {
  if (value.trim() === '') return true;
  return isCapitalizedString(value);
};

const isValidAge = (value: number | null): boolean =>
  value === null || (typeof value === 'number' && !Number.isNaN(value));

const isValidEmail = (value: string | null): boolean => {
  if (value === null) return true;
  const parts = value.split('@');
  return parts.length === 2 && parts[0] !== '' && parts[1] !== '';
};

const isValidPhone = (user: User): boolean => {
  if (user.phone === null) return true;

  const expectedLength = user.country !== null ? PHONE_LENGTH_BY_COUNTRY[user.country] : undefined;
  if (expectedLength !== undefined) {
    return user.phone.length === expectedLength;
  }

  const knownLengths = Object.values(PHONE_LENGTH_BY_COUNTRY);
  return knownLengths.includes(user.phone.length);
};

const validateUser = (user: User): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!isCapitalizedString(user.fullName)) errors.push({ field: 'fullName', message: 'must start with a capital letter' });
  if (!isCapitalizedString(user.gender)) errors.push({ field: 'gender', message: 'must start with a capital letter' });
  if (!isValidNote(user.note)) errors.push({ field: 'note', message: 'must start with a capital letter' });
  if (!isCapitalizedString(user.state)) errors.push({ field: 'state', message: 'must start with a capital letter' });
  if (!isCapitalizedString(user.city)) errors.push({ field: 'city', message: 'must start with a capital letter' });
  if (!isCapitalizedString(user.country)) errors.push({ field: 'country', message: 'must start with a capital letter' });
  if (!isValidAge(user.age)) errors.push({ field: 'age', message: 'must be a valid number' });
  if (!isValidPhone(user)) errors.push({ field: 'phone', message: 'unexpected length for country' });
  if (!isValidEmail(user.email)) errors.push({ field: 'email', message: 'must contain exactly one "@" with non-empty parts' });

  return { valid: errors.length === 0, errors };
};

export default validateUser;
