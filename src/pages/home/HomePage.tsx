import { useMemo, useState } from 'react';

import { forwardGeocode, KOREA_DISTRICTS, type KoreaDistrict } from '@/entities/location';
import { getCurrentGeolocation } from '@/features/location';
import { DistrictSearch } from '@/widgets/district-search';
import { WeatherDetail } from '@/widgets/weather-detail';
import { WeatherAppLayout } from '@/widgets/weather-layout';

export const HomePage = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<KoreaDistrict['id']>();
  const selectedDistrict = useMemo(
    () => KOREA_DISTRICTS.find((district) => district.id === selectedDistrictId),
    [selectedDistrictId],
  );

  const coordinates = (() => {
    if (!selectedDistrict) return getCurrentGeolocation;
    return async () => {
      const geocode = await forwardGeocode({ query: selectedDistrict.fullName });
      // TODO: 인접 지역으로 추출
      const location = geocode.at(0);
      if (!location) throw new Error('지역 위치를 찾을 수 없습니다.');
      return { lat: location.lat, lon: location.lon };
    };
  })();

  return (
    <WeatherAppLayout>
      <WeatherAppLayout.Sidebar>
        <DistrictSearch onSelect={setSelectedDistrictId} />
      </WeatherAppLayout.Sidebar>
      <WeatherAppLayout.Content>
        <WeatherDetail
          key={selectedDistrict?.id ?? 'current-location'}
          coordinates={coordinates}
          fallbackLocationName={selectedDistrict?.fullName ?? '현재 위치'}
        />
      </WeatherAppLayout.Content>
    </WeatherAppLayout>
  );
};
