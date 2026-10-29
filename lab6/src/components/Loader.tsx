interface LoaderProps {
  label?: string
}

export function Loader({ label = 'Завантаження…' }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
