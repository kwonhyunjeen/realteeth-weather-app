import { WeatherAppLayout } from '@/widgets/weather-layout';

export const HomePage = () => {
  return (
    <WeatherAppLayout>
      <WeatherAppLayout.Sidebar />
      <WeatherAppLayout.Content />
    </WeatherAppLayout>
  );
};
