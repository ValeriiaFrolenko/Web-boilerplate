import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { areCredentialsValid, saveAuth } from '../services/auth'
import type { Credentials } from '../services/auth'

const EMPTY_CREDENTIALS: Credentials = { login: '', password: '' }

interface LocationState {
  from?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [credentials, setCredentials] = useState<Credentials>(EMPTY_CREDENTIALS)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = (location.state as LocationState | null)?.from ?? '/dashboard'

  function handleChange(field: keyof Credentials) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target

      setCredentials((current) => ({ ...current, [field]: value }))
      setError(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!credentials.login.trim() || !credentials.password) {
      setError('Заповніть усі поля')
      return
    }

    if (!areCredentialsValid(credentials)) {
      setError('Невірний логін або пароль')
      return
    }

    saveAuth(credentials.login)
    navigate(redirectTo, { replace: true })
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Вхід у застосунок</h1>

        <div className="field">
          <label htmlFor="login">Логін</label>
          <input
            id="login"
            name="login"
            type="text"
            autoComplete="username"
            value={credentials.login}
            onChange={handleChange('login')}
            aria-invalid={Boolean(error)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange('password')}
            aria-invalid={Boolean(error)}
          />
        </div>

        {error && (
          <p className="field__error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="button-primary">
          Увійти
        </button>
      </form>
    </main>
  )
}
