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

const parseCapitalizedName = (value: unknown): string | null =>
    parseCapitalizedOrNull(parseFullName(value));

const normalizeFromRandomUserMock = (raw: RawRandomUserMockEntry): TypedUserFields => {
    const fullName = raw.name
        ? parseCapitalizedName(`${raw.name.first ?? ''} ${raw.name.last ?? ''}`)
        : null;

    return {
        fullName,
        gender: parseCapitalizedOrNull(raw.gender),
        title: parseCapitalizedOrNull(raw.name?.title),

        city: parseCapitalizedOrNull(raw.location?.city),
        state: parseCapitalizedOrNull(raw.location?.state),
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
    fullName: parseCapitalizedName(raw.full_name),
    gender: parseCapitalizedOrNull(raw.gender),
    title: parseCapitalizedOrNull(raw.title),

    city: parseCapitalizedOrNull(raw.city),
    state: parseCapitalizedOrNull(raw.state),
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