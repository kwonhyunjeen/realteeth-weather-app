import { KOREA_DISTRICTS } from '../model/koreaDistricts';

const normalizeQuery = (value: string) =>
  value
    .trim()
    .replaceAll(/[\s_]+/g, '')
    .toLowerCase();

export const searchKoreaDistricts = (query: string) => {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];
  return KOREA_DISTRICTS.filter((district) => normalizeQuery(district.fullName).includes(normalizedQuery));
};
