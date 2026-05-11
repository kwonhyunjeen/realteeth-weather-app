import { useQuery } from '@tanstack/react-query';

import { forwardGeocodeQueryOptions, type LocationCoordinates, reverseGeocodeQueryOptions } from '@/entities/location';
import { type WeatherCoordinates, weatherSummaryQueryOptions } from '@/entities/weather';

const DEFAULT_LOCATION_NAME = { query: '서울특별시' };

const DEFAULT_COORDINATES = {
  lat: 37.5665,
  lon: 126.978,
} satisfies LocationCoordinates & WeatherCoordinates;

export const App = () => {
  const forwardGeocodeQuery = useQuery(forwardGeocodeQueryOptions(DEFAULT_LOCATION_NAME));
  const reverseGeocodeQuery = useQuery(reverseGeocodeQueryOptions(DEFAULT_COORDINATES));
  const weatherQuery = useQuery(weatherSummaryQueryOptions(DEFAULT_COORDINATES));

  return (
    <main className="flex flex-col gap-8 p-8">
      <h1 className="text-3xl">Weather App</h1>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">날씨 조회</h2>
        {weatherQuery.isPending && <p>Loading</p>}
        {weatherQuery.isError && (
          <pre>
            <code>{weatherQuery.error.message}</code>
          </pre>
        )}
        {weatherQuery.data && (
          <pre>
            <code>{JSON.stringify(weatherQuery.data, null, 2)}</code>
          </pre>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">지역명 → 위도/경도 ({DEFAULT_LOCATION_NAME.query})</h2>
        {forwardGeocodeQuery.isPending && <p>Loading</p>}
        {forwardGeocodeQuery.isError && (
          <pre>
            <code>{forwardGeocodeQuery.error.message}</code>
          </pre>
        )}
        {forwardGeocodeQuery.data && (
          <pre>
            <code>{JSON.stringify(forwardGeocodeQuery.data, null, 2)}</code>
          </pre>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">
          위도/경도 → 지역명 ({DEFAULT_COORDINATES.lat}, {DEFAULT_COORDINATES.lon})
        </h2>
        {reverseGeocodeQuery.isPending && <p>Loading</p>}
        {reverseGeocodeQuery.isError && (
          <pre>
            <code>{reverseGeocodeQuery.error.message}</code>
          </pre>
        )}
        {reverseGeocodeQuery.data && (
          <pre>
            <code>{JSON.stringify(reverseGeocodeQuery.data, null, 2)}</code>
          </pre>
        )}
      </section>
    </main>
  );
};
