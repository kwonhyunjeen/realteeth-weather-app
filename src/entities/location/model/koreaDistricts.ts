import { KOREA_DISTRICT_RAW_DATA } from '../config/koreaDistricts';
import { normalizeDistrictName } from '../lib/normalizeDistrictName';
import type { KoreaDistrict } from '../model/location';

const toKoreaDistrictName = (districtPart: string) => districtPart.replaceAll('_', ' ');

const toKoreaDistrict = (district: string): KoreaDistrict => {
  const parts = district.split('-').map((part) => toKoreaDistrictName(part));
  const name = parts.at(-1) ?? '';
  const fullName = parts.join(' ');
  const normalizedName = normalizeDistrictName(name);
  const normalizedFullName = normalizeDistrictName(fullName);

  return { id: district, name, fullName, normalizedName, normalizedFullName };
};

export const KOREA_DISTRICTS = KOREA_DISTRICT_RAW_DATA.map((district) => toKoreaDistrict(district));
