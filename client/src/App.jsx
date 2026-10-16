import { useEffect, useState } from 'react'
import IssueForm from './IssueForm'
import IssueList from './IssueList'
import StatsBar from './StatsBar'
import './App.css'

async function api(path, options) {
  const response = await fetch(`/api${path}`, options)
  const data = response.status === 204 ? null : await response.json()
  if (!response.ok) throw new Error(data.error || 'Request failed')
  return data
}
export default function App() {
  const [issues, setIssues] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function load() {
    setLoading(true)
    setError('')
    try {
      const [items, counts] = await Promise.all([api('/issues'), api('/stats')])
      setIssues(items); setStats(counts)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  useEffect(() => {
    let cancelled = false
    Promise.all([api('/issues'), api('/stats')])
      .then(([items, counts]) => { if (!cancelled) { setIssues(items); setStats(counts) } })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])
  async function mutate(path, method, body) {
    setBusy(true); setError('')
    try {
      await api(path, { method, headers: { 'Content-Type': 'application/json' }, ...(body && { body: JSON.stringify(body) }) })
      await load()
      return true
    } catch (err) { setError(err.message); return false }
    finally { setBusy(false) }
  }
  return <main>
    <header><div><p className="eyebrow">YOUR TEAM'S SMALL HELP DESK</p><h1>MiniDesk<span> / Issues</span></h1></div><span className="badge">WORKSPACE</span></header>
    <StatsBar stats={stats} />
    {error && <div role="alert" className="error">{error} <button onClick={load} disabled={busy || loading}>Retry</button></div>}
    <div className="workspace"><aside><h2>New issue</h2><p>Capture it. Move it forward.</p><IssueForm busy={busy} onCreate={body => mutate('/issues', 'POST', body)} /></aside>
    <section aria-label="Issues"><div className="section-heading"><h2>Issue board</h2><span>{issues.length} issues</span></div>
      {loading ? <p role="status">Loading issues…</p> : <IssueList issues={issues} busy={busy} onStatus={(id, status) => mutate(`/issues/${id}`, 'PATCH', { status })} onDelete={id => mutate(`/issues/${id}`, 'DELETE')} />}
    </section></div>
  </main>
}
