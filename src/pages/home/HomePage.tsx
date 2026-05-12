import { ChevronLeft, ChevronRight, List, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
  forwardGeocode,
  KOREA_DISTRICTS,
  type KoreaDistrict,
  type LocationCoordinates,
  searchKoreaDistricts,
} from '@/entities/location';
import { MAX_FAVORITE_COUNT } from '@/features/bookmark';
import { getCurrentGeolocation } from '@/features/location';
import { safeLocalStorage } from '@/shared/lib/storage';
import { DistrictSearch, DistrictSearchResults } from '@/widgets/district-search';
import { DistrictWeatherCardList } from '@/widgets/district-weather-card';
import { WeatherDetail } from '@/widgets/weather-detail';
import { WeatherAppLayout } from '@/widgets/weather-layout';

type BookmarkDistrict = {
  districtId: KoreaDistrict['id'];
  coordinates: LocationCoordinates;
  alias?: string;
};

type SelectedLocation = { type: 'current' } | { type: 'district'; districtId: KoreaDistrict['id'] };

const FAVORITE_DISTRICTS_STORAGE_KEY = 'bookmark-districts';
const MAX_RESULT_COUNT = 20;

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

const filterInvalidBookmarkDistricts = (value: unknown) => {
  if (!Array.isArray(value)) {
    safeLocalStorage.removeItem(FAVORITE_DISTRICTS_STORAGE_KEY);
    return [];
  }
  return value.filter((bookmark) => isBookmarkDistrict(bookmark));
};

const getDistrictCoordinates = async (district: KoreaDistrict) => {
  const geocode = await forwardGeocode({ query: district.fullName });
  const location = geocode.at(0);
  if (!location) throw new Error('지역 위치를 찾을 수 없습니다.');
  return { lat: location.lat, lon: location.lon };
};

export const HomePage = () => {
  const [bookmarkDistrictIds, setBookmarkDistrictIds] = useState<BookmarkDistrict[]>(() =>
    filterInvalidBookmarkDistricts(safeLocalStorage.getItem(FAVORITE_DISTRICTS_STORAGE_KEY)),
  );
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({ type: 'current' });
  const [isEditingBookmarks, setIsEditingBookmarks] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const bookmarkDistricts = bookmarkDistrictIds.flatMap((bookmark) => {
    const district = KOREA_DISTRICTS.find(({ id }) => id === bookmark.districtId);
    return district && bookmark.coordinates ? [{ bookmark, district }] : [];
  });

  useEffect(() => {
    safeLocalStorage.setItem(FAVORITE_DISTRICTS_STORAGE_KEY, bookmarkDistrictIds);
  }, [bookmarkDistrictIds]);

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
  const activeIndex =
    selectedLocation.type === 'current'
      ? 0
      : Math.max(0, bookmarkDistricts.findIndex(({ district }) => district.id === selectedLocation.districtId) + 1);
  const mobileSearchResults = useMemo(
    () => searchKoreaDistricts(mobileSearchQuery).slice(0, MAX_RESULT_COUNT),
    [mobileSearchQuery],
  );

  const canShowBookmarkButton = selectedDistrict && !selectedDistrictBookmarked;
  const canBookmark = bookmarkDistrictIds.length < MAX_FAVORITE_COUNT;

  const coordinatesFetcher = (() => {
    if (!selectedDistrict) return getCurrentGeolocation;
    return () => getDistrictCoordinates(selectedDistrict);
  })();

  const addBookmarkSelected = (coordinates: LocationCoordinates) => {
    if (!selectedDistrict) return;

    const alreadyAdded = bookmarkDistrictIds.some((bookmark) => bookmark.districtId === selectedDistrict.id);

    if (alreadyAdded) return;
    if (bookmarkDistrictIds.length >= MAX_FAVORITE_COUNT) return;

    setBookmarkDistrictIds([
      ...bookmarkDistrictIds,
      { districtId: selectedDistrict.id, alias: selectedDistrict.name, coordinates },
    ]);
  };

  const removeBookmark = (districtId: KoreaDistrict['id']) => {
    setBookmarkDistrictIds(bookmarkDistrictIds.filter((bookmark) => bookmark.districtId !== districtId));
  };

  const changeBookmarkAlias = (districtId: KoreaDistrict['id'], alias: string) => {
    setBookmarkDistrictIds(
      bookmarkDistrictIds.map((bookmark) => {
        if (bookmark.districtId !== districtId) return bookmark;
        if (!alias.trim()) return { districtId: bookmark.districtId, coordinates: bookmark.coordinates };
        return { ...bookmark, alias };
      }),
    );
  };

  const selectCurrentLocation = () => setSelectedLocation({ type: 'current' });
  const selectDistrict = (districtId: KoreaDistrict['id']) => setSelectedLocation({ type: 'district', districtId });
  const selectMobileDistrict = (districtId: KoreaDistrict['id']) => {
    selectDistrict(districtId);
    setMobileSearchQuery('');
    setIsMobileSearchOpen(false);
  };
  const selectLocationByIndex = (index: number) => {
    if (index === 0) {
      selectCurrentLocation();
      return;
    }
    const bookmark = bookmarkDistricts.at(index - 1);
    if (bookmark) selectDistrict(bookmark.district.id);
  };

  const currentDisplayName = selectedDistrictBookmarked?.alias ?? selectedDistrict?.name ?? '현재 위치';
  const showsMobileSearchResults = !!mobileSearchQuery.trim();

  return (
    <WeatherAppLayout>
      <WeatherAppLayout.Sidebar>
        <DistrictSearch editing={isEditingBookmarks} onEditingChange={setIsEditingBookmarks} onSelect={selectDistrict}>
          <DistrictWeatherCardList
            bookmarks={bookmarkDistricts}
            editing={isEditingBookmarks}
            activeDistrictId={selectedLocation.type === 'district' ? selectedLocation.districtId : undefined}
            onCurrentSelect={selectCurrentLocation}
            onDistrictSelect={selectDistrict}
            onAliasChange={changeBookmarkAlias}
            onRemove={removeBookmark}
          />
          {isEditingBookmarks && (
            <p className="p-4 text-center text-sm text-white/70">즐겨찾기는 최대 6개까지 추가할 수 있습니다.</p>
          )}
        </DistrictSearch>
      </WeatherAppLayout.Sidebar>

      <WeatherAppLayout.Content>
        <div>
          <WeatherDetail
            key={selectedDistrict?.id ?? 'current-location'}
            coordinates={coordinatesFetcher}
            fallbackLocationName={selectedDistrict?.fullName ?? '현재 위치'}
            mobileLocationName={currentDisplayName}
            canBookmark={canBookmark}
            canShowBookmarkButton={Boolean(canShowBookmarkButton)}
            onBookmarkAdd={canShowBookmarkButton ? addBookmarkSelected : undefined}
          />
        </div>

        <div className="pointer-events-none fixed inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-2 md:hidden">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => selectLocationByIndex(activeIndex - 1)}
            className={`pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-opacity ${activeIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            disabled={activeIndex === bookmarkDistricts.length}
            onClick={() => selectLocationByIndex(activeIndex + 1)}
            className={`pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md transition-opacity ${activeIndex === bookmarkDistricts.length ? 'opacity-0' : 'opacity-100'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex h-28 items-end justify-between bg-linear-to-t from-black/90 via-black/50 to-transparent px-6 pb-8 md:hidden">
          <div className="w-12" />
          <div className="pointer-events-auto flex gap-2 pb-3">
            {Array.from({ length: bookmarkDistricts.length + 1 }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-3 bg-white' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="pointer-events-auto flex size-12 items-center justify-center rounded-full border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl transition-colors hover:bg-white/20"
          >
            <List size={22} />
          </button>
        </div>
      </WeatherAppLayout.Content>

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-100 flex flex-col bg-black/80 backdrop-blur-3xl md:hidden">
          <div className="flex h-full flex-col p-6 pb-8">
            <div className="-m-4 mt-4 flex-1 scrollbar-none overflow-y-auto p-4">
              {showsMobileSearchResults ? (
                <DistrictSearchResults
                  districts={mobileSearchResults}
                  variant="mobile"
                  onSelect={selectMobileDistrict}
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase">나의 장소</h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingBookmarks(!isEditingBookmarks)}
                      className="text-sm font-medium text-blue-400"
                    >
                      {isEditingBookmarks ? '완료' : '편집'}
                    </button>
                  </div>
                  <DistrictWeatherCardList
                    bookmarks={bookmarkDistricts}
                    editing={isEditingBookmarks}
                    activeDistrictId={selectedLocation.type === 'district' ? selectedLocation.districtId : undefined}
                    onCurrentSelect={selectCurrentLocation}
                    onDistrictSelect={selectDistrict}
                    onAliasChange={changeBookmarkAlias}
                    onRemove={removeBookmark}
                    onAfterSelect={() => setIsMobileSearchOpen(false)}
                  />
                  {isEditingBookmarks && (
                    <p className="p-4 text-center text-sm text-white/70">즐겨찾기는 최대 6개까지 추가할 수 있습니다.</p>
                  )}
                </div>
              )}
            </div>

            <header className="mt-4 flex items-center gap-4 rounded-3xl border border-white/5 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-2xl">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="search"
                  value={mobileSearchQuery}
                  onChange={(event) => setMobileSearchQuery(event.target.value)}
                  placeholder="도시 또는 구 검색"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 py-3 pr-4 pl-12 text-base shadow-inner transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setMobileSearchQuery('');
                }}
                className="px-2 font-medium whitespace-nowrap text-blue-400"
              >
                취소
              </button>
            </header>
          </div>
        </div>
      )}
    </WeatherAppLayout>
  );
};
