import type { CurrentWeather, DailyWeather, HourlyWeather, WeatherCoordinates } from './weather';

export type GetWeatherSummaryRequest = WeatherCoordinates;

export type GetWeatherSummaryResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
};
