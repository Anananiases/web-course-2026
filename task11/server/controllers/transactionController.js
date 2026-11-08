const transactionModel = require('../models/transactionModel');
const categoryModel = require('../models/categoryModel');

function parsePayload(body) {
  const amount = Number(body?.amount);
  const categoryId = Number(body?.category_id);
  const date = typeof body?.date === 'string' ? body.date : null;
  const comment = typeof body?.comment === 'string' ? body.comment : null;

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'amount must be a positive number' };
  }
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return { error: 'category_id must be a positive integer' };
  }
  if (!date || Number.isNaN(Date.parse(date))) {
    return { error: 'date must be a valid ISO date string' };
  }
  return { value: { amount, category_id: categoryId, date, comment } };
}

function listTransactions(req, res, next) {
  try {
    res.json(transactionModel.getAll(req.query));
  } catch (err) {
    next(err);
  }
}

function getTransaction(req, res, next) {
  try {
    const id = Number(req.params.id);
    const tx = transactionModel.getById(id);
    if (!tx) return res.status(404).json({ error: 'transaction not found' });
    res.json(tx);
  } catch (err) {
    next(err);
  }
}

function createTransaction(req, res, next) {
  try {
    const parsed = parsePayload(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    if (!categoryModel.existsById(parsed.value.category_id)) {
      return res.status(400).json({ error: 'category_id does not exist' });
    }
    res.status(201).json(transactionModel.create(parsed.value));
  } catch (err) {
    next(err);
  }
}

function updateTransaction(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!transactionModel.getById(id)) {
      return res.status(404).json({ error: 'transaction not found' });
    }
    const parsed = parsePayload(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    if (!categoryModel.existsById(parsed.value.category_id)) {
      return res.status(400).json({ error: 'category_id does not exist' });
    }
    res.json(transactionModel.update(id, parsed.value));
  } catch (err) {
    next(err);
  }
}

function deleteTransaction(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!transactionModel.remove(id)) {
      return res.status(404).json({ error: 'transaction not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};