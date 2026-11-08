const { db } = require('../db');

function buildFilterSql(query) {
  const conditions = [];
  const params = {};

  if (query.category_id) {
    conditions.push('t.category_id = @category_id');
    params.category_id = Number(query.category_id);
  }
  if (query.type) {
    conditions.push('c.type = @type');
    params.type = query.type;
  }
  if (query.from) {
    conditions.push('t.date >= @from');
    params.from = query.from;
  }
  if (query.to) {
    conditions.push('t.date <= @to');
    params.to = query.to;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

function getAll(filters = {}) {
  const { where, params } = buildFilterSql(filters);
  return db
    .prepare(`
      SELECT t.id, t.amount, t.category_id, t.date, t.comment,
             c.name AS category_name, c.type AS category_type
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      ${where}
      ORDER BY t.date DESC, t.id DESC
    `)
    .all(params);
}

function getById(id) {
  return db
    .prepare(`
      SELECT t.id, t.amount, t.category_id, t.date, t.comment,
             c.name AS category_name, c.type AS category_type
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      WHERE t.id = ?
    `)
    .get(id);
}

function create({ amount, category_id, date, comment }) {
  const stmt = db.prepare(
    'INSERT INTO transactions (amount, category_id, date, comment) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(amount, category_id, date, comment || null);
  return getById(info.lastInsertRowid);
}

function update(id, { amount, category_id, date, comment }) {
  const stmt = db.prepare(
    'UPDATE transactions SET amount = ?, category_id = ?, date = ?, comment = ? WHERE id = ?'
  );
  stmt.run(amount, category_id, date, comment || null, id);
  return getById(id);
}

function remove(id) {
  const info = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = { getAll, getById, create, update, remove };