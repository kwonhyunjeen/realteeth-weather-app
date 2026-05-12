import type { LocationCoordinates } from '@/entities/location';

export const getCurrentGeolocation = () => {
  return new Promise<LocationCoordinates>((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('현재 위치를 사용할 수 없습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          lat: coords.latitude,
          lon: coords.longitude,
        });
      },
      () => reject(new Error('현재 위치 권한을 확인해주세요.')),
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 10_000 },
    );
  });
};
