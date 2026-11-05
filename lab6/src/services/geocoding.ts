export interface Location {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

interface GeocodingResponse {
  results?: Array<{
    name: string
    latitude: number
    longitude: number
    country?: string
    admin1?: string
  }>
}

export async function searchLocation(query: string): Promise<Location[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'uk',
    format: 'json',
  })

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Не вдалося виконати пошук міста')
  }

  const data = (await response.json()) as GeocodingResponse

  return (data.results ?? []).map((item) => ({
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country,
    admin1: item.admin1,
  }))
}
