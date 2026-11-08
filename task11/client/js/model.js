export function createModel() {
  let categories = [];
  let transactions = [];
  let filters = { type: '', category_id: '', from: '', to: '' };
  const listeners = new Set();

  function notify() {
    listeners.forEach((fn) => fn());
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function setCategories(next) {
    categories = next;
    notify();
  }

  function setTransactions(next) {
    transactions = next;
    notify();
  }

  function setFilters(next) {
    filters = { ...filters, ...next };
    notify();
  }

  function getCategories() { return categories; }
  function getTransactions() { return transactions; }
  function getFilters() { return filters; }

  function getSummary() {
    const acc = transactions.reduce(
      (res, tx) => {
        if (tx.category_type === 'income') res.income += tx.amount;
        else res.expense += tx.amount;
        return res;
      },
      { income: 0, expense: 0 }
    );
    return { ...acc, balance: acc.income - acc.expense };
  }

  return {
    subscribe, setCategories, setTransactions, setFilters,
    getCategories, getTransactions, getFilters, getSummary,
  };
}