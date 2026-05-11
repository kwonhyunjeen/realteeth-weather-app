export type WeatherCoordinates = {
  lat: number;
  lon: number;
};

export type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type CurrentWeather = {
  dt: number;
  temp: number;
  humidity: number;
  wind_speed: number;
  weather: WeatherCondition[];
};

export type HourlyWeather = {
  dt: number;
  temp: number;
  weather: WeatherCondition[];
};

export type DailyWeather = {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: WeatherCondition[];
};
