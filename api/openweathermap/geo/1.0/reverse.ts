import { proxyOpenWeatherMap } from '../../_openWeatherMap';

export const GET = (request: Request) => {
  return proxyOpenWeatherMap(request, '/geo/1.0/reverse');
};
