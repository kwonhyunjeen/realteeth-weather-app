import { queryOptions } from '@tanstack/react-query';

import type { GetWeatherSummaryRequest } from '../model/dto';
import { getWeatherSummary } from './weather';

export const weatherQueryKeys = {
  all: ['weather'] as const,
  summary: (request: GetWeatherSummaryRequest) => [...weatherQueryKeys.all, 'summary', request] as const,
};

export const weatherSummaryQueryOptions = (request: GetWeatherSummaryRequest) =>
  queryOptions({
    queryKey: weatherQueryKeys.summary(request),
    queryFn: () => getWeatherSummary(request),
  });
