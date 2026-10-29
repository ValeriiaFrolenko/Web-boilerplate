export interface Coordinates {
  latitude: number
  longitude: number
}

export const KYIV_COORDINATES: Coordinates = {
  latitude: 50.4501,
  longitude: 30.5234,
}

const GEOLOCATION_TIMEOUT_MS = 8000

export function requestGeolocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Геолокація не підтримується цим браузером'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => reject(new Error('Не вдалося отримати геолокацію')),
      { timeout: GEOLOCATION_TIMEOUT_MS },
    )
  })
}
