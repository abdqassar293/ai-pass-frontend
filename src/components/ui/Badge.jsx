export function StatusBadge({ status }) {
  const s = (status || '').toString().toUpperCase()
  const map = {
    COMPLETED: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    PENDING: 'bg-amber-100 text-amber-700 ring-amber-200',
    FAILED: 'bg-red-100 text-red-700 ring-red-200',
    PASS: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    FAIL: 'bg-red-100 text-red-700 ring-red-200',
    SUMMARIZED: 'bg-brand-100 text-brand-700 ring-brand-200',
    ERROR: 'bg-red-100 text-red-700 ring-red-200'
  }
  const cls = map[s] || 'bg-gray-100 text-gray-700 ring-gray-200'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${cls}`}>
      {s || 'UNKNOWN'}
    </span>
  )
}

export function ConfidenceBar({ value }) {
  const pct = Math.round((Number(value) || 0) * 100)
  let color = 'bg-red-500'
  if (pct >= 75) color = 'bg-emerald-500'
  else if (pct >= 50) color = 'bg-amber-500'
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 tabular-nums">{pct}%</span>
    </div>
  )
}
