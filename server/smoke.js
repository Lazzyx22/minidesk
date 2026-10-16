import assert from 'node:assert/strict';
import { openDatabase } from './db.js';
import { createApp } from './app.js';
const db = openDatabase(':memory:');
const server = createApp(db).listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}/api`;
async function call(path, method = 'GET', body) {
  return fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, ...(body && { body: JSON.stringify(body) }) });
}
try {
  assert.equal((await call('/health')).status, 200);
  const created = await call('/issues', 'POST', { title: 'HTTP smoke issue' });
  assert.equal(created.status, 201);
  const issue = await created.json();
  assert.equal((await call(`/issues/${issue.id}`, 'PATCH', { status: 'in_progress' })).status, 200);
  assert.equal((await (await call('/stats')).json()).in_progress, 1);
  assert.equal((await (await call('/issues')).json()).length, 1);
  assert.equal((await call('/issues', 'POST', { title: 'x' })).status, 400);
  assert.equal((await call('/issues/999', 'PATCH', { status: 'done' })).status, 404);
  assert.equal((await call(`/issues/${issue.id}`, 'DELETE')).status, 204);
  console.log('HTTP smoke: 8 checks passed');
} finally { await new Promise(resolve => server.close(resolve)); db.close(); }
