export function createController({ model, view, api }) {
  async function loadCategories() {
    const list = await api.getCategories();
    model.setCategories(list);
    view.renderCategoryOptions(list);
  }

  async function loadTransactions() {
    view.renderTransactions([], { loading: true });
    const list = await api.getTransactions(model.getFilters());
    model.setTransactions(list);
    view.renderTransactions(list);
    view.renderSummary(model.getSummary());
  }

  async function reloadAll() {
    try {
      await Promise.all([loadCategories(), loadTransactions()]);
    } catch (err) {
      view.showFormMessage(`Ошибка загрузки: ${err.message}`, true);
    }
  }

  function bindForms() {
    const txForm = document.getElementById('transaction-form');
    txForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        amount: Number(document.getElementById('tx-amount').value),
        category_id: Number(document.getElementById('tx-category').value),
        date: document.getElementById('tx-date').value,
        comment: document.getElementById('tx-comment').value.trim(),
      };
      if (!payload.amount || payload.amount <= 0 || !payload.category_id || !payload.date) {
        view.showFormMessage('Проверьте сумму, категорию и дату', true);
        return;
      }
      try {
        await api.createTransaction(payload);
        txForm.reset();
        view.showFormMessage('Операция добавлена');
        await loadTransactions();
      } catch (err) {
        view.showFormMessage(`Не удалось сохранить: ${err.message}`, true);
      }
    });

    const catForm = document.getElementById('category-form');
    catForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('cat-name').value.trim();
      const type = document.getElementById('cat-type').value;
      if (!name) {
        view.showCategoryMessage('Введите название', true);
        return;
      }
      try {
        await api.createCategory({ name, type });
        catForm.reset();
        view.showCategoryMessage('Категория создана');
        await loadCategories();
      } catch (err) {
        view.showCategoryMessage(`Ошибка: ${err.message}`, true);
      }
    });
  }

  function bindFilters() {
    const form = document.getElementById('filters-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      model.setFilters({
        type: document.getElementById('filter-type').value,
        category_id: document.getElementById('filter-category').value,
        from: document.getElementById('filter-from').value,
        to: document.getElementById('filter-to').value,
      });
      try {
        await loadTransactions();
      } catch (err) {
        view.showFormMessage(`Ошибка фильтра: ${err.message}`, true);
      }
    });

    document.getElementById('filters-reset').addEventListener('click', async () => {
      form.reset();
      model.setFilters({ type: '', category_id: '', from: '', to: '' });
      try {
        await loadTransactions();
      } catch (err) {
        view.showFormMessage(`Ошибка: ${err.message}`, true);
      }
    });
  }

  function bindList() {
    const list = document.getElementById('transactions');
    list.addEventListener('click', async (e) => {
      const button = e.target.closest('button[data-action]');
      if (!button) return;
      const li = button.closest('li');
      const id = Number(li.dataset.id);
      try {
        if (button.dataset.action === 'delete') {
          await api.deleteTransaction(id);
          await loadTransactions();
          return;
        }
        if (button.dataset.action === 'edit') {
          const tx = model.getTransactions().find((t) => t.id === id);
          if (!tx) return;
          const newAmount = Number(prompt('Новая сумма', String(tx.amount)));
          if (!newAmount || newAmount <= 0) return;
          await api.updateTransaction(id, {
            amount: newAmount,
            category_id: tx.category_id,
            date: tx.date,
            comment: tx.comment || '',
          });
          await loadTransactions();
        }
      } catch (err) {
        view.showFormMessage(`Ошибка операции: ${err.message}`, true);
      }
    });
  }

  function setDefaultDate() {
    const dateInput = document.getElementById('tx-date');
    if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
  }

  function start() {
    bindForms();
    bindFilters();
    bindList();
    setDefaultDate();
    reloadAll();
  }

  return { start };
}