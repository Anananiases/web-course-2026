const categoryModel = require('../models/categoryModel');

function listCategories(req, res, next) {
  try {
    res.json(categoryModel.getAll());
  } catch (err) {
    next(err);
  }
}

function createCategory(req, res, next) {
  try {
    const { name, type } = req.body || {};
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ error: "type must be 'income' or 'expense'" });
    }
    const created = categoryModel.create({ name: name.trim(), type });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory };