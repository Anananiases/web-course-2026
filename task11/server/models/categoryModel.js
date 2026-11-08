const { db } = require('../db');

function getAll() {
  return db.prepare('SELECT id, name, type FROM categories ORDER BY id').all();
}

function create({ name, type }) {
  const stmt = db.prepare('INSERT INTO categories (name, type) VALUES (?, ?)');
  const info = stmt.run(name, type);
  return db.prepare('SELECT id, name, type FROM categories WHERE id = ?').get(info.lastInsertRowid);
}

function existsById(id) {
  const row = db.prepare('SELECT 1 as ok FROM categories WHERE id = ?').get(id);
  return Boolean(row);
}

module.exports = { getAll, create, existsById };