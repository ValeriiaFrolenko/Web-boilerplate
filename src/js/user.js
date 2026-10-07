const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art',
  'Medicine', 'Statistics',
];

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const randomCourse = () => COURSES[Math.floor(Math.random() * COURSES.length)];

const randomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

const isBlank = (value) => value === null || value === undefined || String(value).trim() === '';

// Шукає курс у списку без урахування регістру, повертає канонічне написання зі списку.
const findCourse = (value) => {
  if (isBlank(value)) return null;
  const normalized = String(value).trim().toLowerCase();
  return COURSES.find((course) => course.toLowerCase() === normalized) ?? null;
};

const toNumberOrNull = (value) => {
  if (isBlank(value)) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const toStringOrNull = (value) => {
  if (isBlank(value)) return null;
  return String(value);
};

const normalizeFullName = (value) => {
  if (isBlank(value)) return null;
  return String(value).trim().replace(/\s+/g, ' ');
};

const normalizeDate = (value) => {
  if (isBlank(value)) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10); // YYYY-MM-DD, без часу
};

const normalizePhone = (value) => {
  if (isBlank(value)) return null;
  const digits = String(value).replace(/\D/g, '');
  return digits === '' ? null : digits;
};

const normalizeEmail = (value) => {
  if (isBlank(value)) return null;
  return String(value).trim().toLowerCase();
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  return String(value).trim().toLowerCase() === 'true';
};

class User {
  constructor(mapped) {
    // поля, де null -- валідний фінальний стан (дані можуть бути відсутні в джерелі)
    this.gender = toStringOrNull(mapped.gender);
    this.title = toStringOrNull(mapped.title);
    this.full_name = normalizeFullName(mapped.full_name);
    this.city = toStringOrNull(mapped.city);
    this.state = toStringOrNull(mapped.state);
    this.country = toStringOrNull(mapped.country);
    this.postcode = toStringOrNull(mapped.postcode);

    this.coordinates = {
      latitude: toNumberOrNull(mapped.latitude),
      longitude: toNumberOrNull(mapped.longitude),
    };

    this.timezone = {
      offset: toStringOrNull(mapped.tz_offset),
      description: toStringOrNull(mapped.tz_description),
    };

    this.email = normalizeEmail(mapped.email);
    this.b_date = normalizeDate(mapped.b_date);
    this.age = toNumberOrNull(mapped.age);
    this.phone = normalizePhone(mapped.phone);
    this.picture_large = toStringOrNull(mapped.picture_large);
    this.picture_thumbnail = toStringOrNull(mapped.picture_thumbnail);

    // службові поля задачі -- null/порожнє неприпустимо, завжди підставляється значення

    // id -- завжди згенерований UUID, незалежно від вхідних даних
    // (консистентний формат важливіший за збереження оригінального ідентифікатора джерела)
    this.id = crypto.randomUUID();

    this.favorite = !isBlank(mapped.favorite)
      ? toBoolean(mapped.favorite)
      : false;

    this.course = findCourse(mapped.course) ?? randomCourse();

    this.bg_color = !isBlank(mapped.bg_color) && HEX_COLOR_PATTERN.test(mapped.bg_color)
      ? mapped.bg_color
      : randomHexColor();

    // note: порожній рядок -- валідне значення, не підміняється
    this.note = String(mapped.note ?? '');
  }

  // Повертає всі надійні ідентифікатори цього юзера (може бути декілька одночасно).
  // Якщо жодного немає -- fallback на id (завжди присутній).
  getIdentityKeys() {
    const keys = [];

    if (this.full_name !== null && this.b_date !== null) {
      keys.push(`name:${this.full_name.toLowerCase()}|${this.b_date}`);
    }
    if (this.email !== null) {
      keys.push(`email:${this.email}`);
    }
    if (this.phone !== null) {
      keys.push(`phone:${this.phone}`);
    }
    if (this.full_name !== null && this.picture_large !== null) {
      keys.push(`name:${this.full_name.toLowerCase()}|photo:${this.picture_large}`);
    }

    if (keys.length === 0) {
      keys.push(`id:${this.id}`);
    }

    return keys;
  }
}

export default User;