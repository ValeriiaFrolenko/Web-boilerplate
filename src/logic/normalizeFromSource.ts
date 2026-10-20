import type { RawRandomUserMockEntry, TypedUserFields } from './types';
import {
    parseFullName,
    parseStringOrNull,
    parseCapitalizedOrNull,
    parseNumberOrNull,
    parseDate,
    parseEmail,
    parsePhone,
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

export { normalizeFromRandomUserMock };