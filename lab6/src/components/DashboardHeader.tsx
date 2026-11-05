import { useNavigate } from 'react-router-dom'
import { clearAuth } from '../services/auth'

interface DashboardHeaderProps {
  login: string | null
  locationName: string
}

export function DashboardHeader({ login, locationName }: DashboardHeaderProps) {
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
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
  )
}
