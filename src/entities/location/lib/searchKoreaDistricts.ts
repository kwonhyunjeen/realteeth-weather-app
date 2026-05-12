import { KOREA_DISTRICTS } from '../model/koreaDistricts';
import { normalizeDistrictName } from './normalizeDistrictName';

export const searchKoreaDistricts = (query: string) => {
  const normalizedQuery = normalizeDistrictName(query);
  if (!normalizedQuery) return [];
  return KOREA_DISTRICTS.filter((district) => district.normalizedFullName.includes(normalizedQuery));
};
