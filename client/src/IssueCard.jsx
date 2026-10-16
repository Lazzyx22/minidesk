export default function IssueCard({ issue, busy, onStatus, onDelete }) {
  return <article className="issue-card">
    <div className="card-top"><span>#{String(issue.id).padStart(3, '0')}</span><span className={`priority ${issue.priority}`}>{issue.priority}</span></div>
    <h3>{issue.title}</h3>{issue.description && <p className="description">{issue.description}</p>}
    <div className="card-bottom"><label className="status-label">Status<select aria-label={`Status for ${issue.title}`} value={issue.status} disabled={busy} onChange={event => onStatus(issue.id, event.target.value)}><option value="open">Open</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
    <button className="delete" disabled={busy} aria-label={`Delete ${issue.title}`} onClick={() => onDelete(issue.id)}>Delete</button></div>
    <small>Created {new Date(issue.created_at).toLocaleString()}</small>
  </article>
}
