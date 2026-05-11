import { proxyOpenWeatherMap } from '../../_openWeatherMap';

export const GET = (request: Request) => {
  return proxyOpenWeatherMap(request, '/data/3.0/onecall');
};
