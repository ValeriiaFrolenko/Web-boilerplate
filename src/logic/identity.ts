import type { TypedUserFields } from './types';

const buildIdentityKeys = (user: TypedUserFields): string[] => {
  const keys: string[] = [];

  if (user.fullName !== null && user.birthDate !== null) {
    keys.push(`name:${user.fullName.toLowerCase()}|${user.birthDate}`);
  }
  if (user.email !== null) {
    keys.push(`email:${user.email}`);
  }
  if (user.phone !== null) {
    keys.push(`phone:${user.phone}`);
  }
  if (user.fullName !== null && user.pictureLarge !== null) {
    keys.push(`name:${user.fullName.toLowerCase()}|photo:${user.pictureLarge}`);
  }

  return keys;
};

export { buildIdentityKeys };
