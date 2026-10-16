const isBlank = (value: unknown): boolean =>
  value === null || value === undefined || String(value).trim() === '';

export const parseStringOrNull = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  return String(value);
};

export const parseNumberOrNull = (value: unknown): number | null => {
  if (isBlank(value)) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

export const parseCapitalizedOrNull = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  const str = String(value).trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseFullName = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  return String(value).trim().replace(/\s+/g, ' ');
};

export const parseNote = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  const str = String(value).trim();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const parseDate = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  const date = new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

export const parsePhone = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  const digits = String(value).replace(/\D/g, '');
  return digits === '' ? null : digits;
};

export const parseEmail = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  return String(value).trim().toLowerCase();
};

export const parseFavorite = (value: unknown): boolean | null => {
  if (isBlank(value)) return null;
  if (typeof value === 'boolean') return value;
  return String(value).trim().toLowerCase() === 'true';
};

const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art',
  'Medicine', 'Statistics',
] as const;

export const parseCourse = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  const normalized = String(value).trim().toLowerCase();
  return COURSES.find((course) => course.toLowerCase() === normalized) ?? null;
};

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

export const parseBgColor = (value: unknown): string | null => {
  if (isBlank(value)) return null;
  const str = String(value).trim();
  return HEX_COLOR_PATTERN.test(str) ? str : null;
};

export { isBlank, COURSES };
