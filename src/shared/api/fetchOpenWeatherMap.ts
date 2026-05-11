import { getUnknownErrorMessage, ResponseError } from '../lib/error';

// Proxy of https://api.openweathermap.org
const OPEN_WEATHER_MAP_API_BASE_URL = new URL('/openweathermap', globalThis.location.origin).toString();

export const fetchOpenWeatherMap = async <ResponseJSON>(
  pathname: string,
  parameters: Partial<Record<string, string>>,
) => {
  const url = new URL(OPEN_WEATHER_MAP_API_BASE_URL + pathname);

  for (const [key, value] of Object.entries(parameters)) {
    if (value) url.searchParams.set(key, value);
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
