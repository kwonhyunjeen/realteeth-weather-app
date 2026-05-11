import { fetchOpenWeatherMap } from '@/shared/api/fetchOpenWeatherMap';

import type {
  ForwardGeocodeRequest,
  ForwardGeocodeResponseItem,
  ReverseGeocodeRequest,
  ReverseGeocodeResponseItem,
} from '../model/dto';

export const forwardGeocode = async ({ query }: ForwardGeocodeRequest) => {
  return fetchOpenWeatherMap<ForwardGeocodeResponseItem[]>('/geo/1.0/direct', {
    q: `${query},KR`,
    limit: '5',
  });
};

export const reverseGeocode = async ({ lat, lon }: ReverseGeocodeRequest) => {
  return fetchOpenWeatherMap<ReverseGeocodeResponseItem[]>('/geo/1.0/reverse', {
    lat: String(lat),
    lon: String(lon),
    limit: '1',
  });
};
