import { useCallback, useEffect, useState } from 'react'
import { KYIV_COORDINATES, requestGeolocation } from '../services/geolocation'
import type { Coordinates } from '../services/geolocation'
import { searchLocation } from '../services/geocoding'
import { loadForecast } from '../services/weather'
import type { DailyForecast } from '../services/weather'

export type ForecastState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; forecast: DailyForecast[] }

export function useForecast() {
  const [state, setState] = useState<ForecastState>({ status: 'loading' })
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [locationName, setLocationName] = useState('')
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

  async function search(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return

    setIsSearching(true)
    try {
      const results = await searchLocation(trimmed)
      if (results.length === 0) {
        setState({ status: 'error', message: 'Місто не знайдено' })
        return
      }
      const [first] = results
      await loadForecastFor({ latitude: first.latitude, longitude: first.longitude }, first.name)
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Помилка пошуку',
      })
    } finally {
      setIsSearching(false)
    }
  }

  async function useCurrentLocation() {
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

  function retry() {
    if (coordinates) {
      loadForecastFor(coordinates, locationName)
    }
  }

  return {
    state,
    coordinates,
    locationName,
    isSearching,
    search,
    useCurrentLocation,
    retry,
  }
}
