import { useState } from 'react'
import type { FormEvent } from 'react'

interface DashboardToolbarProps {
  isSearching: boolean
  onSearch: (query: string) => void
  onUseGeolocation: () => void
}

export function DashboardToolbar({ isSearching, onSearch, onUseGeolocation }: DashboardToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="dashboard__toolbar">
      <form className="dashboard__search" onSubmit={handleSubmit}>
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
      <button type="button" className="button-secondary" onClick={onUseGeolocation}>
        Моя геолокація
      </button>
    </div>
  )
}
