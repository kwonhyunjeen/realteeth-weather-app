import { useEffect, useMemo, useState } from 'react';

import { forwardGeocode, KOREA_DISTRICTS, type KoreaDistrict, type LocationCoordinates } from '@/entities/location';
import { MAX_FAVORITE_COUNT } from '@/features/bookmark';
import { getCurrentGeolocation } from '@/features/location';
import { safeLocalStorage } from '@/shared/lib/storage';
import { DistrictSearch } from '@/widgets/district-search';
import { DistrictWeatherCard } from '@/widgets/district-weather-card/DistrictWeatherCard';
import { WeatherDetail } from '@/widgets/weather-detail';
import { WeatherAppLayout } from '@/widgets/weather-layout';

type BookmarkDistrict = {
  districtId: KoreaDistrict['id'];
  coordinates: LocationCoordinates;
  alias?: string;
};

type SelectedLocation = { type: 'current' } | { type: 'district'; districtId: KoreaDistrict['id'] };

const FAVORITE_DISTRICTS_STORAGE_KEY = 'bookmark-districts';

const isBookmarkDistrict = (value: unknown): value is BookmarkDistrict => {
  if (!value || typeof value !== 'object') return false;

  const bookmark = value as Partial<BookmarkDistrict>;
  return (
    typeof bookmark.districtId === 'string' &&
    typeof bookmark.coordinates?.lat === 'number' &&
    typeof bookmark.coordinates.lon === 'number' &&
    (bookmark.alias === undefined || typeof bookmark.alias === 'string')
  );
};

// 스토리지 값이 올바르지 않으면 삭제
const filterInvalidBookmarkDistricts = (value: unknown) => {
  if (!Array.isArray(value)) {
    safeLocalStorage.removeItem(FAVORITE_DISTRICTS_STORAGE_KEY);
    return [];
  }
  return value.filter((bookmark) => isBookmarkDistrict(bookmark));
};

const getDistrictCoordinates = async (district: KoreaDistrict) => {
  const geocode = await forwardGeocode({ query: district.fullName });
  // 카카오 지오코딩 API에 의해 index 0이 근접한 지역이라고 판단
  const location = geocode.at(0);
  if (!location) throw new Error('지역 위치를 찾을 수 없습니다.');
  return { lat: location.lat, lon: location.lon };
};

export const HomePage = () => {
  const [bookmarkDistrictIds, setBookmarkDistrictIds] = useState<BookmarkDistrict[]>(() =>
    filterInvalidBookmarkDistricts(safeLocalStorage.getItem(FAVORITE_DISTRICTS_STORAGE_KEY)),
  );
  const bookmarkDistricts = bookmarkDistrictIds.flatMap((bookmark) => {
    const district = KOREA_DISTRICTS.find(({ id }) => id === bookmark.districtId);
    return district && bookmark.coordinates ? [{ bookmark, district }] : [];
  });
  useEffect(() => {
    // 이 컴포넌트의 상태가 SSoT이므로 단방향 저장
    safeLocalStorage.setItem(FAVORITE_DISTRICTS_STORAGE_KEY, bookmarkDistrictIds);
  }, [bookmarkDistrictIds]);

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({ type: 'current' });
  const selectedDistrict = useMemo(
    () =>
      selectedLocation.type === 'district'
        ? KOREA_DISTRICTS.find((district) => district.id === selectedLocation.districtId)
        : undefined,
    [selectedLocation],
  );
  const selectedDistrictBookmarked = bookmarkDistrictIds.find(
    (bookmark) => bookmark.districtId === selectedDistrict?.id,
  );

  const canShowBookmarkButton = selectedDistrict && !selectedDistrictBookmarked;
  const canBookmark = bookmarkDistrictIds.length < MAX_FAVORITE_COUNT;

  const coordinatesFetcher = (() => {
    if (!selectedDistrict) return getCurrentGeolocation;
    return () => getDistrictCoordinates(selectedDistrict);
  })();

  // TODO: 명령형 토스트 API 구현
  const [toastMessage, setToastMessage] = useState('');

  const addBookmarkSelected = (coordinates: LocationCoordinates) => {
    if (!selectedDistrict) return;

    const alreadyAdded = bookmarkDistrictIds.some((bookmark) => bookmark.districtId === selectedDistrict.id);
    if (alreadyAdded) return;

    if (bookmarkDistrictIds.length >= MAX_FAVORITE_COUNT) {
      setToastMessage('즐겨찾기는 최대 6개까지 추가할 수 있습니다.');
      return;
    }

    setBookmarkDistrictIds([
      ...bookmarkDistrictIds,
      { districtId: selectedDistrict.id, alias: selectedDistrict.name, coordinates },
    ]);
  };

  const removeBookmark = (districtId: KoreaDistrict['id']) => {
    setBookmarkDistrictIds(bookmarkDistrictIds.filter((bookmark) => bookmark.districtId !== districtId));
  };

  const changeBookmarkAlias = (districtId: KoreaDistrict['id'], alias: string) => {
    const trimmedAlias = alias.trim();

    setBookmarkDistrictIds(
      bookmarkDistrictIds.map((bookmark) => {
        if (bookmark.districtId !== districtId) return bookmark;
        if (!trimmedAlias) return { districtId: bookmark.districtId, coordinates: bookmark.coordinates };
        return { ...bookmark, alias: trimmedAlias };
      }),
    );
  };

  const selectCurrentLocation = () => setSelectedLocation({ type: 'current' });
  const selectDistrict = (districtId: KoreaDistrict['id']) => setSelectedLocation({ type: 'district', districtId });

  return (
    <WeatherAppLayout>
      <WeatherAppLayout.Sidebar>
        <DistrictSearch onSelect={selectDistrict}>
          <ul className="space-y-2 p-4">
            <li>
              <DistrictWeatherCard
                districtId="CURRENT"
                coordinates={getCurrentGeolocation}
                alias="현재 위치"
                onSelect={selectCurrentLocation}
              />
            </li>
            {bookmarkDistricts.map(({ bookmark, district }) => (
              <li key={district.id}>
                <DistrictWeatherCard
                  districtId={district.id}
                  coordinates={bookmark.coordinates}
                  alias={bookmark.alias}
                  onSelect={selectDistrict}
                  onAliasChange={changeBookmarkAlias}
                  onRemove={removeBookmark}
                />
              </li>
            ))}
          </ul>
        </DistrictSearch>
      </WeatherAppLayout.Sidebar>
      <WeatherAppLayout.Content>
        <WeatherDetail
          key={selectedDistrict?.id ?? 'current-location'}
          coordinates={coordinatesFetcher}
          fallbackLocationName={selectedDistrict?.fullName ?? '현재 위치'}
          canBookmark={canBookmark}
          onBookmarkAdd={canShowBookmarkButton ? addBookmarkSelected : undefined}
        />
        {toastMessage && <p className="mt-4 text-sm text-slate-500">{toastMessage}</p>}
      </WeatherAppLayout.Content>
    </WeatherAppLayout>
  );
};
