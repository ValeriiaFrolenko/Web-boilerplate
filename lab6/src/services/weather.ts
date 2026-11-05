import type { Coordinates } from './geolocation'

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const FORECAST_DAYS = 5

export interface DailyForecast {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number
}

export interface WeatherDescription {
  label: string
  icon: string
}

const WEATHER_DESCRIPTIONS: Record<number, WeatherDescription> = {
  0: { label: 'Ясно', icon: '☀️' },
  1: { label: 'Переважно ясно', icon: '🌤️' },
  2: { label: 'Мінлива хмарність', icon: '⛅' },
  3: { label: 'Похмуро', icon: '☁️' },
  45: { label: 'Туман', icon: '🌫️' },
  48: { label: 'Паморозь', icon: '🌫️' },
  51: { label: 'Легка мряка', icon: '🌦️' },
  53: { label: 'Мряка', icon: '🌦️' },
  55: { label: 'Сильна мряка', icon: '🌧️' },
  56: { label: 'Крижана мряка', icon: '🌧️' },
  57: { label: 'Сильна крижана мряка', icon: '🌧️' },
  61: { label: 'Легкий дощ', icon: '🌦️' },
  63: { label: 'Дощ', icon: '🌧️' },
  65: { label: 'Сильний дощ', icon: '🌧️' },
  66: { label: 'Крижаний дощ', icon: '🌧️' },
  67: { label: 'Сильний крижаний дощ', icon: '🌧️' },
  71: { label: 'Легкий сніг', icon: '🌨️' },
  73: { label: 'Сніг', icon: '🌨️' },
  75: { label: 'Сильний сніг', icon: '❄️' },
  77: { label: 'Снігові зерна', icon: '❄️' },
  80: { label: 'Легка злива', icon: '🌦️' },
  81: { label: 'Злива', icon: '🌧️' },
  82: { label: 'Сильна злива', icon: '⛈️' },
  85: { label: 'Снігова злива', icon: '🌨️' },
  86: { label: 'Сильна снігова злива', icon: '❄️' },
  95: { label: 'Гроза', icon: '⛈️' },
  96: { label: 'Гроза з градом', icon: '⛈️' },
  99: { label: 'Сильна гроза з градом', icon: '⛈️' },
}

interface ForecastResponse {
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
  }
}

export function describeWeather(weatherCode: number): WeatherDescription {
  return WEATHER_DESCRIPTIONS[weatherCode] ?? { label: 'Немає даних', icon: '❔' }
}

export async function loadForecast({ latitude, longitude }: Coordinates): Promise<DailyForecast[]> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: String(FORECAST_DAYS),
    timezone: 'auto',
  })

  const response = await fetch(`${FORECAST_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Не вдалося завантажити прогноз погоди (${response.status})`)
  }

  const data = (await response.json()) as ForecastResponse

  return data.daily.time.map((date, index) => ({
    date,
    weatherCode: data.daily.weather_code[index],
    temperatureMax: data.daily.temperature_2m_max[index],
    temperatureMin: data.daily.temperature_2m_min[index],
    precipitationProbability: data.daily.precipitation_probability_max[index] ?? 0,
  }))
}
