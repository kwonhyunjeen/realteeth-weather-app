import { fetchOpenWeatherMap } from '@/shared/api/fetchOpenWeatherMap';

import type { GetWeatherSummaryRequest, GetWeatherSummaryResponse } from '../model/dto';

export const getWeatherSummary = async ({ lat, lon }: GetWeatherSummaryRequest) => {
  return fetchOpenWeatherMap<GetWeatherSummaryResponse>('/data/3.0/onecall', {
    lat: String(lat),
    lon: String(lon),
    units: 'metric',
    lang: 'kr',
    exclude: 'minutely,alerts',
  });
};
