const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(path.join(__dirname, 'database.sqlite'));
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      comment TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  const countQuery = db.prepare('SELECT COUNT(*) as count FROM categories');
  const { count } = countQuery.get();
  
  if (count === 0) {
    const insert = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)');
    insert.run('Зарплата', 'income');
    insert.run('Еда', 'expense');
    insert.run('Транспорт', 'expense');
    console.log('[db] seeded initial categories');
  }
}

module.exports = { db, initDatabase };