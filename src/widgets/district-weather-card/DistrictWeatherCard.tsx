import { useQuery } from '@tanstack/react-query';
import { Navigation, X } from 'lucide-react';

import { type KoreaDistrict, type LocationCoordinates, reverseGeocodeQueryOptions } from '@/entities/location';
import { weatherSummaryQueryOptions } from '@/entities/weather';
import { formatTemperature } from '@/features/weather';
import { cn } from '@/shared/lib/className';

export type DistrictWeatherCardProps = {
  districtId: KoreaDistrict['id'];
  coordinates: LocationCoordinates | (() => Promise<LocationCoordinates>);
  alias?: string;
  active?: boolean;
  editing?: boolean;
  current?: boolean;
  onSelect?: (districtId: KoreaDistrict['id']) => void;
  onAliasChange?: (districtId: KoreaDistrict['id'], alias: string) => void;
  onRemove?: (districtId: KoreaDistrict['id']) => void;
};

export const DistrictWeatherCard = ({
  districtId,
  coordinates,
  alias,
  active = false,
  editing = false,
  current = false,
  onSelect,
  onAliasChange,
  onRemove,
}: DistrictWeatherCardProps) => {
  const coordinatesQuery = useQuery({
    queryKey: ['district-weather-card', districtId, 'coordinates', coordinates],
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

  const locationName = locationQuery.data?.at(0)?.local_names?.ko ?? locationQuery.data?.at(0)?.name;
  const displayName = alias || locationName || '위치 확인 중';
  const today = weatherQuery.data?.daily.at(0);
  const description = weatherQuery.data?.current.weather.at(0)?.description;
  const rainy = weatherQuery.data?.current.weather.some((weather) => weather.main === 'Rain') ?? false;

  return (
    <article className="relative">
      <button
        type="button"
        onClick={() => onSelect?.(districtId)}
        className={cn(
          'relative w-full cursor-pointer rounded-2xl p-4 text-left text-white shadow-xl transition-all duration-200 hover:scale-[1.005] active:scale-[0.995]',
          'bg-linear-to-br from-sky-500 to-blue-500',
          rainy && 'bg-linear-to-br from-gray-500 to-slate-700',
          active && 'ring-2 ring-blue-300',
          rainy && active && 'ring-slate-300',
        )}
      >
        <div className="relative z-10 flex justify-between gap-4">
          <div className="flex min-w-0 flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                {editing && !current ? (
                  <input
                    type="text"
                    value={alias ?? ''}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => onAliasChange?.(districtId, event.target.value)}
                    placeholder={displayName}
                    className="-m-1 h-9 min-w-0 rounded-lg border border-white/10 bg-black/20 px-2 text-base font-bold text-white outline-none placeholder:text-white/50 focus:ring-1 focus:ring-blue-300"
                  />
                ) : (
                  <h4 className="h-lh truncate text-lg font-bold">{displayName}</h4>
                )}
                {current && <Navigation size={12} className="fill-white" />}
              </div>
              <p className="mt-1 h-lh max-w-[180px] truncate text-[10px] text-white/70">{locationName}</p>
            </div>
            <p className="mt-4 h-lh text-xs font-medium text-white/90">
              {coordinatesQuery.isPending || weatherQuery.isPending
                ? '날씨 확인 중'
                : weatherQuery.isError
                  ? '해당 장소의 정보가 제공되지 않습니다.'
                  : description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end justify-between">
            <span className="text-3xl font-light">
              {weatherQuery.data ? formatTemperature(weatherQuery.data.current.temp) : '--'}
            </span>
            {today && (
              <div className="flex gap-2 text-[10px] font-bold text-white/70">
                <span>최고:{formatTemperature(today.temp.max)}</span>
                <span>최저:{formatTemperature(today.temp.min)}</span>
              </div>
            )}
          </div>
        </div>
      </button>

      {editing && !current && onRemove && (
        <button
          type="button"
          onClick={() => onRemove(districtId)}
          className="absolute -top-1 -right-1 z-10 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110"
          aria-label="즐겨찾기 삭제"
        >
          <X size={12} />
        </button>
      )}
    </article>
  );
};
