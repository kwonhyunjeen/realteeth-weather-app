import { proxyOpenWeatherMap } from '../../_openWeatherMap.js';

export const GET = (request: Request) => {
  return proxyOpenWeatherMap(request, '/data/3.0/onecall');
};
