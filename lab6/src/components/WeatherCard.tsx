import { describeWeather } from '../services/weather'
import type { DailyForecast } from '../services/weather'

interface WeatherCardProps {
  forecast: DailyForecast
}

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function WeatherCard({ forecast }: WeatherCardProps) {
  const { label, icon } = describeWeather(forecast.weatherCode)

  return (
    <article className="weather-card">
      <h2>{dateFormatter.format(new Date(`${forecast.date}T00:00:00`))}</h2>
      <p className="weather-card__icon" aria-hidden="true">{icon}</p>
      <p className="weather-card__label">{label}</p>
      <dl className="weather-card__details">
        <div>
          <dt>Макс.</dt>
          <dd>{Math.round(forecast.temperatureMax)}°C</dd>
        </div>
        <div>
          <dt>Мін.</dt>
          <dd>{Math.round(forecast.temperatureMin)}°C</dd>
        </div>
        <div>
          <dt>Опади</dt>
          <dd>{forecast.precipitationProbability}%</dd>
        </div>
      </dl>
    </article>
  )
}
