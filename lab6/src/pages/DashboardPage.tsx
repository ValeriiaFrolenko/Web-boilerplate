import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../components/Loader'
import { WeatherCard } from '../components/WeatherCard'
import { clearAuth, readAuthLogin } from '../services/auth'
import { KYIV_COORDINATES, requestGeolocation } from '../services/geolocation'
import type { Coordinates } from '../services/geolocation'
import { searchLocation } from '../services/geocoding'
import { loadForecast } from '../services/weather'
import type { DailyForecast } from '../services/weather'

type ForecastState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; forecast: DailyForecast[] }

export function DashboardPage() {
  const navigate = useNavigate()
  const login = readAuthLogin()
  const [state, setState] = useState<ForecastState>({ status: 'loading' })
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [locationName, setLocationName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const loadForecastFor = useCallback(async (coords: Coordinates, name: string) => {
    setState({ status: 'loading' })
    setCoordinates(coords)
    setLocationName(name)

    try {
      const forecast = await loadForecast(coords)
      setState({ status: 'success', forecast })
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Невідома помилка',
      })
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const coords = await requestGeolocation()
        if (!cancelled) {
          await loadForecastFor(coords, 'Ваше місцезнаходження')
        }
      } catch {
        if (!cancelled) {
          await loadForecastFor(KYIV_COORDINATES, 'Київ')
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [loadForecastFor])

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = searchQuery.trim()

    if (!query) {
      return
    }

    setIsSearching(true)

    try {
      const results = await searchLocation(query)

      if (results.length === 0) {
        setState({ status: 'error', message: 'Місто не знайдено' })
        return
      }

      const [first] = results
      await loadForecastFor(
        { latitude: first.latitude, longitude: first.longitude },
        first.name,
      )
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Помилка пошуку',
      })
    } finally {
      setIsSearching(false)
    }
  }

  async function handleUseGeolocation() {
    try {
      const coords = await requestGeolocation()
      await loadForecastFor(coords, 'Ваше місцезнаходження')
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Не вдалося отримати геолокацію',
      })
    }
  }

  function handleRetry() {
    if (coordinates) {
      loadForecastFor(coordinates, locationName)
    }
  }

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>Погода</h1>
          <p className="dashboard__subtitle">
            Прогноз на 5 днів{locationName ? ` — ${locationName}` : ''}
          </p>
        </div>
        <div className="dashboard__user">
          {login && <span>{login}</span>}
          <button type="button" className="button-ghost" onClick={handleLogout}>
            Вийти
          </button>
        </div>
      </header>

      <div className="dashboard__toolbar">
        <form className="dashboard__search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Введіть місто…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Пошук міста"
          />
          <button
            type="submit"
            className="button-primary"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? 'Пошук…' : 'Знайти'}
          </button>
        </form>
        <button type="button" className="button-secondary" onClick={handleUseGeolocation}>
          Моя геолокація
        </button>
      </div>

      {state.status === 'loading' && <Loader label="Завантаження прогнозу…" />}

      {state.status === 'error' && (
        <div className="dashboard__error" role="alert">
          <p>{state.message}</p>
          {coordinates && (
            <button type="button" className="button-secondary" onClick={handleRetry}>
              Спробувати ще раз
            </button>
          )}
        </div>
      )}

      {state.status === 'success' && (
        <section className="weather-grid" aria-label="Прогноз погоди на 5 днів">
          {state.forecast.map((day) => (
            <WeatherCard key={day.date} forecast={day} />
          ))}
        </section>
      )}
    </main>
  )
}
