import { getCurrentGeolocation } from '@/features/location';
import { WeatherDetail } from '@/widgets/weather-detail';
import { WeatherAppLayout } from '@/widgets/weather-layout';

export const HomePage = () => {
  return (
    <WeatherAppLayout>
      <WeatherAppLayout.Sidebar />
      <WeatherAppLayout.Content>
        <WeatherDetail coordinates={getCurrentGeolocation} fallbackLocationName="현재 위치" />
      </WeatherAppLayout.Content>
    </WeatherAppLayout>
  );
};
