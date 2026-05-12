import { useState } from 'react';

import type { KoreaDistrict } from '@/entities/location';
import { getCurrentGeolocation } from '@/features/location';
import { DistrictSearch } from '@/widgets/district-search';
import { WeatherDetail } from '@/widgets/weather-detail';
import { WeatherAppLayout } from '@/widgets/weather-layout';

export const HomePage = () => {
  const [selectedDistrictId, setSelectedDistrictId] = useState<KoreaDistrict['id']>();

  return (
    <WeatherAppLayout>
      <WeatherAppLayout.Sidebar>
        <DistrictSearch value={selectedDistrictId} onSelect={setSelectedDistrictId} />
      </WeatherAppLayout.Sidebar>
      <WeatherAppLayout.Content>
        <WeatherDetail coordinates={getCurrentGeolocation} fallbackLocationName="현재 위치" />
      </WeatherAppLayout.Content>
    </WeatherAppLayout>
  );
};
