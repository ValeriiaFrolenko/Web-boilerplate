import { buildIdentityKeys, isBlank } from './normalizeUser.js';

const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art',
  'Medicine', 'Statistics',
];

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const randomCourse = () => COURSES[Math.floor(Math.random() * COURSES.length)];

const randomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

// Шукає курс у списку без урахування регістру, повертає канонічне написання зі списку.
const findCourse = (value) => {
  if (isBlank(value)) return null;
  const normalized = String(value).trim().toLowerCase();
  return COURSES.find((course) => course.toLowerCase() === normalized) ?? null;
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  return String(value).trim().toLowerCase() === 'true';
};

class User {
  // Приймає вже нормалізований об'єкт (результат normalizeUser.js).
  constructor(normalized) {
    this.gender = normalized.gender;
    this.title = normalized.title;
    this.full_name = normalized.full_name;
    this.city = normalized.city;
    this.state = normalized.state;
    this.country = normalized.country;
    this.postcode = normalized.postcode;

    this.coordinates = {
      latitude: normalized.latitude,
      longitude: normalized.longitude,
    };

    this.timezone = {
      offset: normalized.tz_offset,
      description: normalized.tz_description,
    };

    this.email = normalized.email;
    this.b_date = normalized.b_date;
    this.age = normalized.age;

    this.phone = normalized.phone;
    this.picture_large = normalized.picture_large;
    this.picture_thumbnail = normalized.picture_thumbnail;

    // службові поля -- null неприпустимо, завжди підставляється значення
    this.id = crypto.randomUUID();

    this.favorite = !isBlank(normalized.favorite)
      ? toBoolean(normalized.favorite)
      : false;

    this.course = findCourse(normalized.course) ?? randomCourse();

    this.bg_color = !isBlank(normalized.bg_color) && HEX_COLOR_PATTERN.test(normalized.bg_color)
      ? normalized.bg_color
      : randomHexColor();

    this.note = normalized.note;
  }

  // Усі надійні ідентифікатори юзера; якщо жодного немає -- fallback на id.
  getIdentityKeys() {
    const keys = buildIdentityKeys(this);
    return keys.length > 0 ? keys : [`id:${this.id}`];
  }
}

export default User;