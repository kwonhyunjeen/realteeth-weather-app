import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, Cloud, CloudRain, Droplets, Plus, Sun, Wind } from 'lucide-react';

import { type LocationCoordinates, reverseGeocodeQueryOptions } from '@/entities/location';
import { weatherSummaryQueryOptions } from '@/entities/weather';
import { formatTemperature } from '@/features/weather';
import { getUnknownErrorMessage } from '@/shared/lib/error';

export type WeatherDetailProps = {
  coordinates: LocationCoordinates | (() => Promise<LocationCoordinates>);
  fallbackLocationName: string;
  mobileLocationName?: string;
  canBookmark?: boolean;
  canShowBookmarkButton?: boolean;
  onBookmarkAdd?: (coordinates: LocationCoordinates) => void;
};

const getWeatherIcon = (main?: string, className = 'text-yellow-300') => {
  if (main === 'Rain') return <CloudRain className={className} size={24} />;
  if (main === 'Clouds') return <Cloud className={className} size={24} />;
  return <Sun className={className} size={24} />;
};

const getDayLabel = (date: Date, index: number) => {
  if (index === 0) return '오늘';
  return date.toLocaleDateString('ko-KR', { weekday: 'short' });
};

function GlassBox({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 text-white shadow-lg backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/50 uppercase">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

export const WeatherDetail = ({
  coordinates,
  fallbackLocationName,
  mobileLocationName,
  canBookmark = false,
  canShowBookmarkButton = false,
  onBookmarkAdd,
}: WeatherDetailProps) => {
  const coordinatesQuery = useQuery({
    queryKey: ['weather-detail', fallbackLocationName, 'coordinates', coordinates],
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
  const dailyWeather = weatherQuery.data?.daily.slice(0, 5) ?? [];
  const hourlyWeather = weatherQuery.data?.hourly.slice(0, 24) ?? [];
  const currentWeather = weatherQuery.data?.current;
  const condition = currentWeather?.weather.at(0);
  const coordinatesErrorMessage = getUnknownErrorMessage(coordinatesQuery.error) ?? '위치 정보를 불러오지 못했습니다.';
  const weatherUnavailable = coordinatesQuery.isError || weatherQuery.isError;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-32 text-white md:pb-24">
      <div className="pointer-events-none sticky top-0 z-20 -mx-1 flex h-20 items-center justify-between py-5">
        <div className="w-10" />
        <div className="text-center text-sm font-bold opacity-90 drop-shadow-md md:hidden">
          {mobileLocationName ?? locationName}
        </div>
        <div className="pointer-events-auto flex w-10 justify-end">
          {canShowBookmarkButton && coordinatesQuery.data && (
            <button
              type="button"
              aria-disabled={!canBookmark}
              onClick={() => {
                if (canBookmark) onBookmarkAdd?.(coordinatesQuery.data);
              }}
              className="rounded-full bg-black/20 p-2 shadow-sm backdrop-blur-md aria-disabled:text-white/40"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      <section className="py-4 text-center md:py-12">
        <h1 className="mb-1 hidden text-3xl font-medium md:block md:text-5xl">{locationName}</h1>
        <p className="my-4 text-8xl font-thin tracking-tighter md:text-9xl">
          {currentWeather ? formatTemperature(currentWeather.temp) : '--'}
        </p>
        {coordinatesQuery.isPending && (
          <p className="text-lg font-medium text-white/80">현재 위치를 확인하는 중입니다.</p>
        )}
        {coordinatesQuery.isError && <p className="text-lg font-medium text-white/80">{coordinatesErrorMessage}</p>}
        {coordinatesQuery.data && weatherQuery.isPending && (
          <p className="text-lg font-medium text-white/80">날씨 정보를 불러오는 중입니다.</p>
        )}
        {weatherUnavailable && !coordinatesQuery.isPending && (
          <p className="text-lg font-medium text-white/80">해당 장소의 정보가 제공되지 않습니다.</p>
        )}
        {currentWeather && (
          <>
            <p className="text-lg font-medium text-white/90 md:text-2xl">{condition?.description}</p>
            {today && (
              <div className="mt-2 flex justify-center gap-4 text-lg font-medium text-white/80">
                <span>최고: {formatTemperature(today.temp.max)}</span>
                <span>최저: {formatTemperature(today.temp.min)}</span>
              </div>
            )}
          </>
        )}
      </section>

      {currentWeather && weatherQuery.data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <GlassBox title="시간대별 기온" icon={<Clock size={14} />}>
              <div className="flex scrollbar-none gap-8 overflow-x-auto pb-2">
                {hourlyWeather.map((weather, index) => (
                  <div key={weather.dt} className="flex min-w-[50px] flex-col items-center gap-3">
                    <span className="text-[11px] font-bold text-white/60">
                      {index === 0
                        ? '지금'
                        : new Date(weather.dt * 1000).toLocaleTimeString('ko-KR', { hour: 'numeric' })}
                    </span>
                    <div className="scale-110">{getWeatherIcon(weather.weather.at(0)?.main)}</div>
                    <span className="text-xl font-bold">{formatTemperature(weather.temp)}</span>
                  </div>
                ))}
              </div>
            </GlassBox>
          </div>

          <div className="lg:col-span-2">
            <GlassBox title="5일간의 예보" icon={<Calendar size={14} />}>
              <div className="space-y-5">
                {dailyWeather.map((weather, index) => {
                  const date = new Date(weather.dt * 1000);
                  return (
                    <div key={weather.dt} className="flex items-center justify-between gap-4">
                      <span className="w-12 text-sm font-bold">{getDayLabel(date, index)}</span>
                      {getWeatherIcon(weather.weather.at(0)?.main, 'text-yellow-300')}
                      <div className="flex min-w-[120px] items-center justify-end gap-4">
                        <span className="text-sm font-bold text-white/40">{formatTemperature(weather.temp.min)}</span>
                        <div className="relative h-1 w-20 rounded-full bg-white/20">
                          <div className="absolute right-2 left-4 h-full rounded-full bg-linear-to-r from-yellow-400 to-orange-500" />
                        </div>
                        <span className="text-sm font-bold">{formatTemperature(weather.temp.max)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassBox>
          </div>

          <div className="space-y-6">
            <GlassBox title="습도" icon={<Droplets size={14} />}>
              <p className="text-4xl font-bold">{currentWeather.humidity}%</p>
            </GlassBox>
            <GlassBox title="바람" icon={<Wind size={14} />}>
              <p className="text-4xl font-bold">{currentWeather.wind_speed}m/s</p>
            </GlassBox>
          </div>
        </div>
      )}
    </div>
  );
};
