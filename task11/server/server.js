const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const categoriesRouter = require('./routes/categories'); // <- новое подключение
const PORT = 3001;

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Подключаем роуты категорий
app.use('/categories', categoriesRouter); // <- новое подключение

app.listen(PORT, () => {
  console.log(`Zen-Money server started on http://localhost:${PORT}`);
});