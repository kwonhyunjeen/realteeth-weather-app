import type { LocationCoordinates } from './location';

type GeocodingResponseItem = {
  name: string;
  local_names?: Partial<Record<string, string>>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};
export type ForwardGeocodeRequest = { query: string };
export type ForwardGeocodeResponseItem = GeocodingResponseItem;

export type ReverseGeocodeRequest = LocationCoordinates;
export type ReverseGeocodeResponseItem = GeocodingResponseItem;
