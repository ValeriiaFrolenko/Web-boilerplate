import type { User, FindUserField, AgeOperator } from './types';
import findUser from './findUser';

const getMatchPercentage = (
  users: User[],
  field: FindUserField,
  query: string | number,
  operator: AgeOperator = '=',
): number => {
  if (users.length === 0) return 0;

  const matches = findUser(users, field, query, operator);
  return (matches.length / users.length) * 100;
};

export default getMatchPercentage;
