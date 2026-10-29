import type { RawRandomUserMockEntry, User } from '../logic/types';
import formatUsers from '../logic/formatUsers';

const RANDOM_USER_URL = 'https://randomuser.me/api/';
const TEACHERS_URL = '/api/teachers';
const FETCH_BUFFER = 5;
const MAX_ATTEMPTS = 5;

const fetchRaw = async (count: number): Promise<RawRandomUserMockEntry[]> => {
    const response = await fetch(`${RANDOM_USER_URL}?results=${count}`);

    if (!response.ok) {
        throw new Error(`RandomUser request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results as RawRandomUserMockEntry[];
};

export const fetchValidUsers = async (target: number): Promise<User[]> => {
    const valid: User[] = [];

    for (let attempt = 0; attempt < MAX_ATTEMPTS && valid.length < target; attempt++) {
        const needed = target - valid.length + FETCH_BUFFER;
        const raw = await fetchRaw(needed);

        const formatted = formatUsers(raw);
        valid.push(...formatted);
    }

    if (valid.length < target) {
        console.warn(
            `fetchValidUsers: wanted ${target}, got ${valid.length} after ${MAX_ATTEMPTS} attempts`,
        );
    }

    return valid.slice(0, target);
};

export const fetchSavedTeachers = async (): Promise<User[]> => {
    const response = await fetch(TEACHERS_URL);

    if (!response.ok) {
        throw new Error(`json-server GET failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<User[]>;
};

export const postTeacher = async (teacher: User): Promise<User> => {
    const response = await fetch(TEACHERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
    });

    if (!response.ok) {
        throw new Error(`json-server POST failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<User>;
};
