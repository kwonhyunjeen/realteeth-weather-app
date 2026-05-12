import { fetchKakao } from '@/shared/api/fetchKakao';

import type {
  ForwardGeocodeRequest,
  ForwardGeocodeResponseItem,
  ReverseGeocodeRequest,
  ReverseGeocodeResponseItem,
} from '../model/dto';

type KakaoSearchAddressResponse = {
  documents: Array<{
    address_name: string;
    x: string;
    y: string;
  }>;
};

const toForwardGeocodeResponseItem = (
  doc: KakaoSearchAddressResponse['documents'][number],
): ForwardGeocodeResponseItem => {
  return {
    name: doc.address_name,
    local_names: { ko: doc.address_name },
    lat: Number(doc.y),
    lon: Number(doc.x),
    country: 'KR',
  };
};

type KakaoCoordToRegionCodeResponse = {
  documents: Array<{
    region_type: 'B' | 'H';
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
  }>;
};

const toReverseGeocodeResponseItem = (
  doc: KakaoCoordToRegionCodeResponse['documents'][number],
): ReverseGeocodeResponseItem => {
  const name = doc.address_name;
  const state = doc.region_1depth_name;
  return {
    name,
    local_names: { ko: name },
    lat: 0,
    lon: 0,
    country: 'KR',
    state,
  };
};

export const forwardGeocode = async ({ query }: ForwardGeocodeRequest): Promise<ForwardGeocodeResponseItem[]> => {
  const response = await fetchKakao<KakaoSearchAddressResponse>('/v2/local/search/address', {
    query,
    size: '5',
  });
  return response.documents.map((doc) => toForwardGeocodeResponseItem(doc));
};

export const reverseGeocode = async ({ lat, lon }: ReverseGeocodeRequest): Promise<ReverseGeocodeResponseItem[]> => {
  const response = await fetchKakao<KakaoCoordToRegionCodeResponse>('/v2/local/geo/coord2regioncode', {
    x: String(lon),
    y: String(lat),
  });
  return response.documents.filter((doc) => doc.region_type === 'B').map((doc) => toReverseGeocodeResponseItem(doc));
};
