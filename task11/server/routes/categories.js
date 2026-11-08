const { Router } = require('express');
const { listCategories, createCategory } = require('../controllers/categoryController');

const router = Router();
router.get('/', listCategories);
router.post('/', createCategory);

module.exports = router;