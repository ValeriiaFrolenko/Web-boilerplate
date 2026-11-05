const AUTH_COOKIE = 'lab6_auth'
const AUTH_MAX_AGE_SECONDS = 60 * 60 * 24

export interface Credentials {
  login: string
  password: string
}

function getExpectedCredentials(): Credentials {
  const login = import.meta.env.VITE_AUTH_LOGIN
  const password = import.meta.env.VITE_AUTH_PASSWORD

  if (!login || !password) {
    throw new Error('VITE_AUTH_LOGIN та VITE_AUTH_PASSWORD мають бути задані у .env')
  }

  return { login, password }
}

export function areCredentialsValid({ login, password }: Credentials): boolean {
  const expected = getExpectedCredentials()

  return login === expected.login && password === expected.password
}

export function saveAuth(login: string): void {
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(login)}; path=/; max-age=${AUTH_MAX_AGE_SECONDS}; samesite=lax`
}

export function clearAuth(): void {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`
}

export function readAuthLogin(): string | null {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_COOKIE}=`))

  if (!cookie) {
    return null
  }

  const value = cookie.slice(AUTH_COOKIE.length + 1)

  return value ? decodeURIComponent(value) : null
}

export function isAuthenticated(): boolean {
  return readAuthLogin() !== null
}
