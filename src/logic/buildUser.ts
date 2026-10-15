import type { TypedUserFields, User } from './types';

const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art',
  'Medicine', 'Statistics',
] as const;

const randomCourse = (): string => COURSES[Math.floor(Math.random() * COURSES.length)];

const randomHexColor = (): string =>
  `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

const buildUser = (fields: TypedUserFields): User => ({
  id: crypto.randomUUID(),

  fullName: fields.fullName,
  gender: fields.gender,
  title: fields.title,

  city: fields.city,
  state: fields.state,
  country: fields.country,
  postcode: fields.postcode,

  coordinates: fields.coordinates,
  timezone: fields.timezone,

  email: fields.email,
  birthDate: fields.birthDate,
  age: fields.age,

  phone: fields.phone,
  pictureLarge: fields.pictureLarge,
  pictureThumbnail: fields.pictureThumbnail,

  favorite: fields.favorite ?? false,
  course: fields.course ?? randomCourse(),
  bgColor: fields.bgColor ?? randomHexColor(),
  note: fields.note ?? '',
});

export { buildUser };
