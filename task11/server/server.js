const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');
const categoriesRouter = require('./routes/categories');
const transactionsRouter = require('./routes/transactions');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const PORT = 3001;

initDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/categories', categoriesRouter);
app.use('/transactions', transactionsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Zen-Money server started on http://localhost:${PORT}`);
});