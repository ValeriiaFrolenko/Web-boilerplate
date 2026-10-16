import type { RawRandomUserMockEntry, RawAdditionalUserEntry, TypedUserFields } from './types';
import {
  parseFullName,
  parseStringOrNull,
  parseCapitalizedOrNull,
  parseNumberOrNull,
  parseDate,
  parseEmail,
  parsePhone,
  parseFavorite,
  parseCourse,
  parseBgColor,
  parseNote,
} from './normalizeUser';

const normalizeFromRandomUserMock = (raw: RawRandomUserMockEntry): TypedUserFields => {
  const fullName = raw.name
    ? parseFullName(`${raw.name.first ?? ''} ${raw.name.last ?? ''}`)
    : null;

  return {
    fullName,
    gender: parseStringOrNull(raw.gender),
    title: parseStringOrNull(raw.name?.title),

    city: parseStringOrNull(raw.location?.city),
    state: parseStringOrNull(raw.location?.state),
    country: parseStringOrNull(raw.location?.country),
    postcode: parseNumberOrNull(raw.location?.postcode),

    coordinates: {
      latitude: parseStringOrNull(raw.location?.coordinates?.latitude),
      longitude: parseStringOrNull(raw.location?.coordinates?.longitude),
    },
    timezone: {
      offset: parseStringOrNull(raw.location?.timezone?.offset),
      description: parseStringOrNull(raw.location?.timezone?.description),
    },

    email: parseEmail(raw.email),
    birthDate: parseDate(raw.dob?.date),
    age: parseNumberOrNull(raw.dob?.age),

    phone: parsePhone(raw.phone),
    pictureLarge: parseStringOrNull(raw.picture?.large),
    pictureThumbnail: parseStringOrNull(raw.picture?.thumbnail),

    favorite: null,
    course: null,
    bgColor: null,
    note: null,
  };
};

const normalizeFromAdditionalUsers = (raw: RawAdditionalUserEntry): TypedUserFields => ({
  fullName: parseFullName(raw.full_name),
  gender: parseStringOrNull(raw.gender),
  title: parseCapitalizedOrNull(raw.title),

  city: parseStringOrNull(raw.city),
  state: parseStringOrNull(raw.state),
  country: parseStringOrNull(raw.country),
  postcode: parseNumberOrNull(raw.postcode),

  coordinates: {
    latitude: parseStringOrNull(raw.coordinates?.latitude),
    longitude: parseStringOrNull(raw.coordinates?.longitude),
  },
  timezone: {
    offset: parseStringOrNull(raw.timezone?.offset),
    description: parseStringOrNull(raw.timezone?.description),
  },

  email: parseEmail(raw.email),
  birthDate: parseDate(raw.b_day),
  age: parseNumberOrNull(raw.age),

  phone: parsePhone(raw.phone),
  pictureLarge: parseStringOrNull(raw.picture_large),
  pictureThumbnail: parseStringOrNull(raw.picture_thumbnail),

  favorite: parseFavorite(raw.favorite),
  course: parseCourse(raw.course),
  bgColor: parseBgColor(raw.bg_color),
  note: parseNote(raw.note),
});

export { normalizeFromRandomUserMock, normalizeFromAdditionalUsers };
