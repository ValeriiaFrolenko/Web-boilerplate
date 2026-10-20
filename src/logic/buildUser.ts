import type { TypedUserFields, User } from './types';

const UNKNOWN_VALUE = 'Unknown';

const COURSES = [
    'Mathematics', 'Physics', 'English', 'Computer Science',
    'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art',
    'Medicine', 'Statistics',
] as const;

const randomCourse = (): string => COURSES[Math.floor(Math.random() * COURSES.length)];

const randomHexColor = (): string =>
    `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

const requireField = <T>(value: T | null, name: string): T => {
    if (value === null) {
        throw new Error(`constructUserFromForm: "${name}" is null -- validation must pass first`);
    }
    return value;
};

// Парсер: єдина точка, де дозволено вигадувати значення.
const buildUser = (fields: TypedUserFields): User => ({
    id: crypto.randomUUID(),

    fullName: fields.fullName ?? UNKNOWN_VALUE,
    gender: fields.gender,
    title: fields.title,

    city: fields.city,
    state: fields.state,
    country: fields.country ?? UNKNOWN_VALUE,
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

// Форма: нічого не вигадуємо. Якщо якесь із обов'язкових полів null --
// кидаємо виняток (це означає, що validateUser пропустили).
const constructUserFromForm = (fields: TypedUserFields): User => ({
    id: crypto.randomUUID(),

    fullName: requireField(fields.fullName, 'fullName'),
    gender: fields.gender,
    title: fields.title,

    city: fields.city,
    state: fields.state,
    country: requireField(fields.country, 'country'),
    postcode: fields.postcode,

    coordinates: fields.coordinates,
    timezone: fields.timezone,

    email: fields.email,
    birthDate: fields.birthDate,
    age: fields.age,

    phone: fields.phone,
    pictureLarge: fields.pictureLarge,
    pictureThumbnail: fields.pictureThumbnail,

    favorite: requireField(fields.favorite, 'favorite'),
    course: requireField(fields.course, 'course'),
    bgColor: requireField(fields.bgColor, 'bgColor'),
    note: requireField(fields.note, 'note'),
});

export { buildUser, constructUserFromForm };