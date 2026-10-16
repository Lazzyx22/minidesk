import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { openDatabase } from './db.js';
import { createApp } from './app.js';

function setup(t) {
  const db = openDatabase(':memory:');
  t.after(() => db.close());
  return { db, api: request(createApp(db)) };
}
test('create, list, change status, stats and delete', async t => {
  const { api } = setup(t);
  await api.get('/api/health').expect(200, { status: 'ok' });
  await api.get('/api/stats').expect(200, { total: 0, open: 0, in_progress: 0, done: 0 });
  const { body: issue } = await api.post('/api/issues').send({ title: '  Fix login  ', description: "It's broken", priority: 'high' }).expect(201);
  assert.equal(issue.title, 'Fix login');
  assert.equal(issue.status, 'open');
  assert.equal(new Date(issue.created_at).toISOString(), issue.created_at);
  assert.equal((await api.get('/api/issues').expect(200)).body.length, 1);
  const patched = await api.patch(`/api/issues/${issue.id}`).send({ status: 'done' }).expect(200);
  assert.equal(patched.body.status, 'done');
  assert.equal(patched.body.created_at, issue.created_at);
  await api.get('/api/stats').expect(200, { total: 1, open: 0, in_progress: 0, done: 1 });
  await api.delete(`/api/issues/${issue.id}`).expect(204);
  await api.delete(`/api/issues/${issue.id}`).expect(404);
});
test('invalid create is rejected', async t => {
  const { api } = setup(t);
  for (const body of [{}, { title: ' ' }, { title: 'ab' }, { title: 'x'.repeat(101) }, { title: 123 }, { title: 'Valid', description: 'x'.repeat(501) }, { title: 'Valid', priority: 'urgent' }, { title: 'Valid', status: null }, { title: 'Valid', id: 1 }]) {
    await api.post('/api/issues').send(body).expect(400);
  }
});
test('PATCH nonexistent ID returns 404', async t => {
  const { api } = setup(t);
  await api.patch('/api/issues/999').send({ status: 'done' }).expect(404);
});
test('invalid IDs, patches and JSON are safe', async t => {
  const { api } = setup(t);
  const { body } = await api.post('/api/issues').send({ title: 'Valid' }).expect(201);
  for (const id of ['0', '-1', '1.5', 'abc', '9007199254740992']) await api.patch(`/api/issues/${id}`).send({ status: 'done' }).expect(400);
  for (const patch of [{}, { title: 'ab' }, { status: 'closed' }, { priority: null }, { description: 12 }, []]) await api.patch(`/api/issues/${body.id}`).send(patch).expect(400);
  await api.post('/api/issues').set('Content-Type', 'application/json').send('{').expect(400, { error: 'Invalid JSON body' });
  await api.get('/unknown').expect(404, { error: 'Route not found' });
});
test('unexpected database failures do not expose details', async t => {
  const { api, db } = setup(t);
  db.exec('DROP TABLE issues');
  await api.get('/api/issues').expect(500, { error: 'Internal server error' });
});
