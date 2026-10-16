export default function IssueForm({ busy, onCreate }) {
  async function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    values.title = values.title.trim()
    if (values.title.length < 3) { form.elements.title.focus(); return }
    if (await onCreate(values)) form.reset()
  }
  return <form onSubmit={submit}>
    <label>Title<input name="title" required minLength={3} maxLength={100} placeholder="What needs attention?" /></label>
    <label>Description<textarea name="description" maxLength={500} rows={5} placeholder="Add a little context…" /></label>
    <label>Priority<select name="priority" defaultValue="medium"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
    <button className="primary" disabled={busy}>{busy ? 'Saving…' : '+ Create issue'}</button>
  </form>
}
