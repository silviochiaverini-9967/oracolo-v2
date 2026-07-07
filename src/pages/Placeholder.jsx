export default function Placeholder({ nome }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-lg font-medium">{nome}</div>
      <div className="mt-2 text-sm text-muted">Pagina non ancora migrata dal V1.<br/>La discutiamo e la costruiamo insieme.</div>
    </div>
  )
}
