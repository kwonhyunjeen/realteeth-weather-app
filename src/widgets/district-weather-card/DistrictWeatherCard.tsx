import { useQuery } from '@tanstack/react-query';
import { useId, useState } from 'react';

import { type KoreaDistrict, type LocationCoordinates, reverseGeocodeQueryOptions } from '@/entities/location';
import { weatherSummaryQueryOptions } from '@/entities/weather';
import { formatTemperature } from '@/features/weather';

export type DistrictWeatherCardProps = {
  districtId: KoreaDistrict['id'];
  coordinates: LocationCoordinates | (() => Promise<LocationCoordinates>);
  alias?: string;
  onSelect?: (districtId: KoreaDistrict['id']) => void;
  onAliasChange?: (districtId: KoreaDistrict['id'], alias: string) => void;
  onRemove?: (districtId: KoreaDistrict['id']) => void;
};

export const DistrictWeatherCard = ({
  districtId,
  coordinates,
  alias,
  onSelect,
  onAliasChange,
  onRemove,
}: DistrictWeatherCardProps) => {
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

  const locationName = locationQuery.data?.at(0)?.local_names?.ko ?? locationQuery.data?.at(0)?.name;
  const today = weatherQuery.data?.daily.at(0);

  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [aliasInput, setAliasInput] = useState(alias ?? '');

  const saveAlias = () => {
    if (!isEditingAlias) return;
    onAliasChange?.(districtId, aliasInput);
    setIsEditingAlias(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-start gap-2">
        <input
          key={districtId}
          readOnly={!isEditingAlias}
          role={isEditingAlias ? 'input' : 'generic'}
          value={isEditingAlias ? aliasInput : alias}
          onChange={(event) => setAliasInput(event.target.value)}
          onBlur={saveAlias}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none read-only:cursor-pointer"
          onClick={() => {
            if (!isEditingAlias) onSelect?.(districtId);
          }}
        />
        {onAliasChange && (
          <button type="button" onClick={() => setIsEditingAlias(true)} className="text-xs text-slate-500">
            편집
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelect?.(districtId)}
        className="mt-0.5 block w-full text-left focus:outline-none"
      >
        <span className="block text-xs text-slate-500">{locationName}</span>
        {coordinatesQuery.isPending && <span className="mt-2 block text-xs text-slate-500">날씨 확인 중</span>}
        {weatherQuery.data && (
          <>
            <span className="mt-2 block text-lg font-semibold text-slate-900">
              {formatTemperature(weatherQuery.data.current.temp)}
            </span>
            {today && (
              <span className="mt-1 block text-xs text-slate-500">
                최고 {formatTemperature(today.temp.max)} / 최저 {formatTemperature(today.temp.min)}
              </span>
            )}
          </>
        )}
      </button>

      {onRemove && (
        <button type="button" onClick={() => onRemove(districtId)} className="mt-3 text-xs text-slate-500">
          삭제
        </button>
      )}
    </div>
  );
};
