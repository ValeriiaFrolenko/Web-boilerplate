import type { RawRandomUserMockEntry, User } from '../logic/types';

const RANDOM_USER_URL = 'https://randomuser.me/api/';
const TEACHERS_URL = '/api/teachers';

export const fetchRandomUsers = async (count: number): Promise<RawRandomUserMockEntry[]> => {
    const response = await fetch(`${RANDOM_USER_URL}?results=${count}`);

    if (!response.ok) {
        throw new Error(`RandomUser request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results as RawRandomUserMockEntry[];
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