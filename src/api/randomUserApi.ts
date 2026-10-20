import type { RawRandomUserMockEntry, User } from '../logic/types';
import { normalizeFromRandomUserMock } from '../logic/normalizeFromSource';
import { buildUser } from '../logic/buildUser';
import validateUser from '../logic/validateUser';

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

        for (const entry of raw) {
            const typed = normalizeFromRandomUserMock(entry);
            const validation = validateUser(typed);
            if (!validation.valid) {
                console.warn('Dropped invalid API record', validation.errors, typed);
                continue;
            }
            valid.push(buildUser(typed));
            if (valid.length === target) break;
        }
    }

    if (valid.length < target) {
        console.warn(
            `fetchValidUsers: wanted ${target}, got ${valid.length} after ${MAX_ATTEMPTS} attempts`,
        );
    }

    return valid;
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