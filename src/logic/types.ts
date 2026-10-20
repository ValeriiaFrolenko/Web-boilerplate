export interface RawRandomUserMockEntry {
    gender?: string;
    name?: { title?: string; first?: string; last?: string };
    location?: {
        city?: string;
        state?: string;
        country?: string;
        postcode?: number | string;
        coordinates?: { latitude?: string; longitude?: string };
        timezone?: { offset?: string; description?: string };
    };
    email?: string;
    dob?: { date?: string; age?: number };
    phone?: string;
    picture?: { large?: string; thumbnail?: string };
}

export interface TypedUserFields {
    fullName: string | null;
    gender: string | null;
    title: string | null;

    city: string | null;
    state: string | null;
    country: string | null;
    postcode: number | null;

    coordinates: { latitude: string | null; longitude: string | null };
    timezone: { offset: string | null; description: string | null };

    email: string | null;
    birthDate: string | null;
    age: number | null;

    phone: string | null;
    pictureLarge: string | null;
    pictureThumbnail: string | null;

    favorite: boolean | null;
    course: string | null;
    bgColor: string | null;

    note: string | null;
}

export interface User {
    id: string;

    fullName: string;
    gender: string | null;
    title: string | null;

    city: string | null;
    state: string | null;
    country: string;
    postcode: number | null;

    coordinates: { latitude: string | null; longitude: string | null };
    timezone: { offset: string | null; description: string | null };

    email: string | null;
    birthDate: string | null;
    age: number | null;

    phone: string | null;
    pictureLarge: string | null;
    pictureThumbnail: string | null;

    favorite: boolean;
    course: string;
    bgColor: string;

    note: string;
}

export interface AgeRange {
    min?: number;
    max?: number;
}

export interface FilterCriteria {
    country?: string;
    age?: AgeRange;
    gender?: string;
    favorite?: boolean;
}

export type SortField = 'fullName' | 'age' | 'birthDate' | 'country' | 'course';
export type SortDirection = 'asc' | 'desc';

export type FindUserField = 'name' | 'note' | 'age';
export type AgeOperator = '=' | '>' | '<' | '>=' | '<=';

export interface ValidationError {
    field: keyof User;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}