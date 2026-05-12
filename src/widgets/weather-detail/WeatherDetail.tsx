import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';

import { type LocationCoordinates, reverseGeocodeQueryOptions } from '@/entities/location';
import { weatherSummaryQueryOptions } from '@/entities/weather';
import { formatTemperature } from '@/features/weather';
import { getUnknownErrorMessage } from '@/shared/lib/error';

export type WeatherDetailProps = {
  coordinates: LocationCoordinates | (() => Promise<LocationCoordinates>);
  fallbackLocationName: string;
  canBookmark?: boolean;
  onBookmarkAdd?: (coordinates: LocationCoordinates) => void;
};

export const WeatherDetail = ({
  coordinates,
  fallbackLocationName,
  canBookmark = false,
  onBookmarkAdd,
}: WeatherDetailProps) => {
  const componentId = useId();

  const coordinatesQuery = useQuery({
    queryKey: [componentId, 'coordinates', coordinates],
    queryFn: async () => (typeof coordinates === 'function' ? await coordinates() : coordinates),
  });

  const weatherQuery = useQuery({
    ...weatherSummaryQueryOptions(coordinatesQuery.data ?? { lat: 0, lon: 0 }),
    enabled: Boolean(coordinatesQuery.data),
  });

  const locationQuery = useQuery({
    ...reverseGeocodeQueryOptions(coordinatesQuery.data ?? { lat: 0, lon: 0 }),
    enabled: Boolean(coordinatesQuery.data),
  });

  const locationName =
    locationQuery.data?.at(0)?.local_names?.ko ?? locationQuery.data?.at(0)?.name ?? fallbackLocationName;
  const today = weatherQuery.data?.daily.at(0);
  const hourlyWeather = weatherQuery.data?.hourly.slice(0, 12) ?? [];
  const description = weatherQuery.data?.current.weather.at(0)?.description;
  const coordinatesErrorMessage = getUnknownErrorMessage(coordinatesQuery.error) ?? '위치 정보를 불러오지 못했습니다.';

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">날씨</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{locationName}</h1>
        </div>

        {coordinatesQuery.isPending && <p className="text-sm text-slate-500">현재 위치를 확인하는 중입니다.</p>}
        {coordinatesQuery.isError && <p className="text-sm text-slate-500">{coordinatesErrorMessage}</p>}
        {coordinatesQuery.data && weatherQuery.isPending && (
          <p className="text-sm text-slate-500">날씨 정보를 불러오는 중입니다.</p>
        )}
        {coordinatesQuery.data && weatherQuery.isError && (
          <p className="text-sm text-slate-500">날씨 정보를 불러오지 못했습니다.</p>
        )}
        {coordinatesQuery.data && weatherQuery.data && (
          <div className="text-left md:text-right">
            <p className="text-5xl font-semibold tracking-tight">{formatTemperature(weatherQuery.data.current.temp)}</p>
            {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
            {today && (
              <p className="mt-3 text-sm text-slate-600">
                최고 {formatTemperature(today.temp.max)} / 최저 {formatTemperature(today.temp.min)}
              </p>
            )}
          </div>
        )}
      </div>

      {hourlyWeather.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-sm font-medium text-slate-700">시간대별 기온</h2>
          <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {hourlyWeather.map((weather) => (
              <li key={weather.dt} className="min-w-16 rounded-xl bg-slate-50 px-3 py-2 text-center">
                <time className="text-xs text-slate-500">
                  {new Date(weather.dt * 1000).toLocaleTimeString('ko-KR', { hour: 'numeric' })}
                </time>
                <p className="mt-1 text-sm font-medium text-slate-900">{formatTemperature(weather.temp)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {onBookmarkAdd && coordinatesQuery.data && (
        <button
          type="button"
          aria-disabled={!canBookmark}
          onClick={() => onBookmarkAdd(coordinatesQuery.data)}
          className="mt-4 w-fit rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white aria-disabled:bg-slate-300 aria-disabled:text-slate-500"
        >
          즐겨찾기 추가
        </button>
      )}
    </section>
  );
};
