import { KOREA_DISTRICT_RAW_DATA } from '../config/koreaDistricts';
import type { KoreaDistrict } from '../model/location';

const toKoreaDistrictName = (districtPart: string) => districtPart.replaceAll('_', ' ');

const toKoreaDistrict = (district: string): KoreaDistrict => {
  const parts = district.split('-').map((part) => toKoreaDistrictName(part));
  const name = parts.at(-1) ?? '';

  return {
    id: district,
    name,
    fullName: parts.join(' '),
  };
};

export const KOREA_DISTRICTS = KOREA_DISTRICT_RAW_DATA.map((district) => toKoreaDistrict(district));
