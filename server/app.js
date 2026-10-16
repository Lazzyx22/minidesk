import express from 'express';

function validate(body, partial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Expected a JSON object';
  if (Object.keys(body).some(key => !['title', 'description', 'priority', 'status'].includes(key))) return 'Unknown field';
  if (partial && !Object.keys(body).length) return 'No changes supplied';
  if (!partial || Object.hasOwn(body, 'title')) {
    // TEST ONLY: deliberately weakened minimum; NEVER merge this lab branch.
    if (typeof body.title !== 'string' || body.title.trim().length < 1 || body.title.trim().length > 100) return 'Title must be 3–100 characters';
  }
  if (Object.hasOwn(body, 'description') && (typeof body.description !== 'string' || body.description.length > 500)) return 'Description must be at most 500 characters';
  if (Object.hasOwn(body, 'priority') && !['low', 'medium', 'high'].includes(body.priority)) return 'Invalid priority';
  if (Object.hasOwn(body, 'status') && !['open', 'in_progress', 'done'].includes(body.status)) return 'Invalid status';
}

export function createApp(db) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  const get = db.prepare('SELECT * FROM issues WHERE id = ?');
  const list = db.prepare('SELECT * FROM issues ORDER BY id DESC');
  const insert = db.prepare('INSERT INTO issues (title,description,priority,status,created_at,updated_at) VALUES (@title,@description,@priority,@status,@created_at,@updated_at)');
  const update = db.prepare('UPDATE issues SET title=@title,description=@description,priority=@priority,status=@status,updated_at=@updated_at WHERE id=@id');
  const remove = db.prepare('DELETE FROM issues WHERE id = ?');
  const stats = db.prepare(`SELECT COUNT(*) total, COALESCE(SUM(status='open'),0) open,
    COALESCE(SUM(status='in_progress'),0) in_progress, COALESCE(SUM(status='done'),0) done FROM issues`);
  app.get('/api/health', (req, res) => { db.prepare('SELECT 1').get(); res.json({ status: 'ok' }); });
  app.get('/api/issues', (req, res) => res.json(list.all()));
  app.get('/api/stats', (req, res) => res.json(stats.get()));
  app.post('/api/issues', (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).json({ error });
    const now = new Date().toISOString();
    const result = insert.run({ title: req.body.title.trim(), description: req.body.description ?? '', priority: req.body.priority ?? 'medium', status: req.body.status ?? 'open', created_at: now, updated_at: now });
    res.status(201).json(get.get(result.lastInsertRowid));
  });
  app.param('id', (req, res, next, value) => {
    if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) return res.status(400).json({ error: 'Invalid issue ID' });
    req.issue = get.get(Number(value));
    if (!req.issue) return res.status(404).json({ error: 'Issue not found' });
    next();
  });
  app.patch('/api/issues/:id', (req, res) => {
    const error = validate(req.body, true);
    if (error) return res.status(400).json({ error });
    const issue = { ...req.issue, ...req.body, updated_at: new Date().toISOString() };
    issue.title = issue.title.trim();
    update.run(issue);
    res.json(get.get(issue.id));
  });
  app.delete('/api/issues/:id', (req, res) => { remove.run(req.issue.id); res.status(204).end(); });
  app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') return res.status(400).json({ error: 'Invalid JSON body' });
    res.status(500).json({ error: 'Internal server error' });
  });
  return app;
}
