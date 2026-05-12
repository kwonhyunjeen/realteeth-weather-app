import { type KoreaDistrict, type LocationCoordinates } from '@/entities/location';
import { getCurrentGeolocation } from '@/features/location';

import { DistrictWeatherCard } from './DistrictWeatherCard';

export type DistrictWeatherCardListItem = {
  bookmark: {
    districtId: KoreaDistrict['id'];
    coordinates: LocationCoordinates;
    alias?: string;
  };
  district: KoreaDistrict;
};

export type DistrictWeatherCardListProps = {
  bookmarks: DistrictWeatherCardListItem[];
  editing: boolean;
  activeDistrictId?: KoreaDistrict['id'];
  onCurrentSelect: () => void;
  onDistrictSelect: (districtId: KoreaDistrict['id']) => void;
  onAliasChange: (districtId: KoreaDistrict['id'], alias: string) => void;
  onRemove: (districtId: KoreaDistrict['id']) => void;
  onAfterSelect?: () => void;
};

export const DistrictWeatherCardList = ({
  bookmarks,
  editing,
  activeDistrictId,
  onCurrentSelect,
  onDistrictSelect,
  onAliasChange,
  onRemove,
  onAfterSelect,
}: DistrictWeatherCardListProps) => {
  const selectCurrent = () => {
    onCurrentSelect();
    onAfterSelect?.();
  };
  const selectDistrict = (districtId: KoreaDistrict['id']) => {
    onDistrictSelect(districtId);
    onAfterSelect?.();
  };

  return (
    <ul className="space-y-3">
      <li>
        <DistrictWeatherCard
          districtId="CURRENT"
          coordinates={getCurrentGeolocation}
          alias="현재 위치"
          active={!activeDistrictId}
          current
          onSelect={selectCurrent}
        />
      </li>
      {bookmarks.map(({ bookmark, district }) => (
        <li key={district.id}>
          <DistrictWeatherCard
            districtId={district.id}
            coordinates={bookmark.coordinates}
            alias={bookmark.alias}
            active={activeDistrictId === district.id}
            editing={editing}
            onSelect={selectDistrict}
            onAliasChange={onAliasChange}
            onRemove={onRemove}
          />
        </li>
      ))}
    </ul>
  );
};
