import { createApp } from './app.js';
import { openDatabase } from './db.js';
const db = openDatabase();
const server = createApp(db).listen(process.env.PORT || 3001, () => console.log('MiniDesk API ready'));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
}
