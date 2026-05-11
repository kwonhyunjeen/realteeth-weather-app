import { getUnknownErrorMessage, ResponseError } from '../lib/error';

const OPEN_WEATHER_MAP_API_BASE_URL = 'https://api.openweathermap.org';
const OPEN_WEATHER_MAP_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const getOpenWeatherMapApiKey = () => {
  if (!OPEN_WEATHER_MAP_API_KEY) {
    throw new Error('VITE_OPENWEATHER_API_KEY is not configured.');
  }

  return OPEN_WEATHER_MAP_API_KEY;
};

export const fetchOpenWeatherMap = async <ResponseJSON>(
  pathname: string,
  parameters: Partial<Record<string, string>>,
) => {
  const url = new URL(pathname, OPEN_WEATHER_MAP_API_BASE_URL);

  for (const [key, value] of Object.entries({ ...parameters, appid: getOpenWeatherMapApiKey() })) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (!response.ok) {
    const body: unknown = await response
      .clone()
      .json()
      .catch(() => null);
    const message = getUnknownErrorMessage(body) ?? response.statusText;
    throw new ResponseError(message, response);
  }

  return (await response.json()) as ResponseJSON;
};
