const OPEN_WEATHER_MAP_API_BASE_URL = 'https://api.openweathermap.org';

const getOpenWeatherMapApiKey = () => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENWEATHER_API_KEY is not configured.');
  }

  return apiKey;
};

export const proxyOpenWeatherMap = (request: Request, pathname: string) => {
  const requestUrl = new URL(request.url);
  const url = new URL(pathname, OPEN_WEATHER_MAP_API_BASE_URL);

  for (const [key, value] of requestUrl.searchParams) {
    url.searchParams.append(key, value);
  }

  url.searchParams.set('appid', getOpenWeatherMapApiKey());

  return fetch(url);
};
