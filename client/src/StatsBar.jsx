export default function StatsBar({ stats }) {
  return <div className="stats" aria-label="Issue statistics">{[['total', 'All issues'], ['open', 'Open'], ['in_progress', 'In progress'], ['done', 'Done']].map(([key, label]) => <div key={key}><span>{label}</span><strong>{stats ? stats[key] : '—'}</strong></div>)}</div>
}
