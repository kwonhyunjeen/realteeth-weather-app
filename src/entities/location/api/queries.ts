import { queryOptions } from '@tanstack/react-query';

import type { ForwardGeocodeRequest, ReverseGeocodeRequest } from '../model/dto';
import { forwardGeocode, reverseGeocode } from './geocoding';

export const locationQueryKeys = {
  all: ['location'] as const,
  forwardGeocode: (request: ForwardGeocodeRequest) => [...locationQueryKeys.all, 'forward-geocode', request] as const,
  reverseGeocode: (request: ReverseGeocodeRequest) => [...locationQueryKeys.all, 'reverse-geocode', request] as const,
};

export const forwardGeocodeQueryOptions = (request: ForwardGeocodeRequest) =>
  queryOptions({
    queryKey: locationQueryKeys.forwardGeocode(request),
    queryFn: () => forwardGeocode(request),
  });

export const reverseGeocodeQueryOptions = (request: ReverseGeocodeRequest) =>
  queryOptions({
    queryKey: locationQueryKeys.reverseGeocode(request),
    queryFn: () => reverseGeocode(request),
  });
