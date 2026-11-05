import { DashboardHeader } from '../components/DashboardHeader'
import { DashboardToolbar } from '../components/DashboardToolbar'
import { Loader } from '../components/Loader'
import { WeatherCard } from '../components/WeatherCard'
import { useForecast } from '../hooks/useForecast'
import { readAuthLogin } from '../services/auth'

export function DashboardPage() {
  const login = readAuthLogin()
  const { state, coordinates, locationName, isSearching, search, useCurrentLocation, retry } = useForecast()

  return (
    <main className="dashboard">
      <DashboardHeader login={login} locationName={locationName} />
      
      <DashboardToolbar
        isSearching={isSearching}
        onSearch={search}
        onUseGeolocation={useCurrentLocation}
      />

      {state.status === 'loading' && <Loader label="Завантаження прогнозу…" />}

      {state.status === 'error' && (
        <div className="dashboard__error" role="alert">
          <p>{state.message}</p>
          {coordinates && (
            <button type="button" className="button-secondary" onClick={retry}>
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
